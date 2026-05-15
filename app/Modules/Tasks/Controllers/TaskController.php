<?php

namespace App\Modules\Tasks\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Tasks\Models\Task;
use App\Models\Proyecto;
use App\Modules\Tasks\Actions\CreateTaskAction;
use App\Modules\Tasks\Actions\UpdateTaskAction;
use App\Modules\Tasks\DTOs\CreateTaskDTO;
use App\Modules\Tasks\DTOs\UpdateTaskDTO;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

/**
 * @tags Tasks
 * 
 * APIs for managing Project Tasks.
 */
class TaskController extends Controller
{
    public function index(Request $request, Proyecto $proyecto): \Inertia\Response|\Illuminate\Http\JsonResponse
    {
        $this->authorize('view', $proyecto);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $query = $proyecto->tasks()->with(['users', 'category', 'images.task.proyecto', 'comments.user', 'proyecto']);
        
        if (!$user->esAdminDe($proyecto)) {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_to', $user->id)
                  ->orWhereHas('users', function($q2) use ($user) {
                      $q2->where('users.id', $user->id);
                  });
            });
        }
        
        $tasks = $query->get();

        if ($request->wantsJson()) {
            return response()->json($tasks);
        }

        return Inertia::render('Projects/Tasks/Index', [
            'proyecto' => $proyecto->load('miembros'),
            'tasks' => $tasks,
            'categories' => $proyecto->categorias()->where('tipo', 'gasto')->get(),
        ]);
    }

    /**
     * Get Task Summary
     * 
     * Get counters for tasks by status (todo, in_progress, done, overdue).
     */
    public function summary(Proyecto $proyecto): JsonResponse
    {
        try {
            $this->authorize('view', $proyecto);

            /** @var \App\Models\User $user */
            $user = auth()->user();
            
            $query = $proyecto->tasks();
            
            if (!$user->esAdminDe($proyecto)) {
                $query->where(function($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhereHas('users', function($q2) use ($user) {
                          $q2->where('users.id', $user->id);
                      });
                });
            }
            
            $tasks = $query->get();
            $tasksCollection = collect($tasks);

            return response()->json([
                'pending' => $tasksCollection->where('status', 'todo')->count(),
                'in_progress' => $tasksCollection->where('status', 'in_progress')->count(),
                'done' => $tasksCollection->where('status', 'done')->count(),
                'overdue' => $tasksCollection->where('due_date', '<', now())->where('status', '!=', 'done')->count(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error in Task Summary: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Users Workload
     * 
     * Get a list of project members with their task statistics.
     */
    public function usersLoad(Proyecto $proyecto): JsonResponse
    {
        $this->authorize('view', $proyecto);

        // Get all project members
        try {
            \Illuminate\Support\Facades\Log::info("UsersLoad called for project: " . $proyecto->id);
            
            /** @var \App\Models\User $authUser */
            $authUser = auth()->user();
            $isAdmin = $authUser->esAdminDe($proyecto);

            $users = $proyecto->miembros()->with([
                'tasks' => function ($query) use ($proyecto, $authUser, $isAdmin) {
                    $query->where('tasks.project_id', $proyecto->id);
                    if (!$isAdmin) {
                        $query->where(function($q) use ($authUser) {
                            $q->where('tasks.user_id', $authUser->id)
                              ->orWhereHas('users', function($q2) use ($authUser) {
                                  $q2->where('users.id', $authUser->id);
                              });
                        });
                    }
                }
            ])->get();

            \Illuminate\Support\Facades\Log::info("Users fetched for workload: " . $users->count());

            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users */
            $data = $users->map(function (\App\Models\User $user) {
                // Calculate stats
                $stats = new \stdClass();
                // Ensure accessed via relation property
                $userTasks = $user->tasks; 
                
                $stats->total = $userTasks->count();
                $stats->todo = $userTasks->where('status', 'todo')->count();
                $stats->in_progress = $userTasks->where('status', 'in_progress')->count();
                $stats->done = $userTasks->where('status', 'done')->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'profile_photo_url' => $user->profile_photo_url,
                    'stats' => [
                        'total' => $stats->total ?? 0,
                        'todo' => $stats->todo ?? 0,
                        'in_progress' => $stats->in_progress ?? 0,
                        'done' => $stats->done ?? 0,
                    ]
                ];
            });

            return response()->json($data);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error in UsersLoad: " . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create Task
     * 
     * Create a new task in the project.
     * Supports both JSON and HTML responses.
     */
    public function store(Request $request, Proyecto $proyecto, CreateTaskAction $action): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('addTask', $proyecto);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assignees' => 'nullable|array',
            'assignees.*' => 'exists:users,id',
            'related_type' => 'nullable|string|max:255',
            'related_id' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:3072',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,webp|max:3072',
        ]);

        $dto = new CreateTaskDTO(
            proyecto: $proyecto,
            title: $validated['title'],
            status: $validated['status'],
            priority: $validated['priority'],
            description: $validated['description'] ?? null,
            dueDate: $validated['due_date'] ?? null,
            assignees: $validated['assignees'] ?? null,
            relatedType: $validated['related_type'] ?? null,
            relatedId: $validated['related_id'] ?? null,
            image: $request->file('image'),
            images: $request->file('images')
        );

        $task = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($task, 201);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    /**
     * Update Task
     * 
     * Update an existing task.
     * Supports both JSON and HTML responses.
     */
    public function update(Request $request, Proyecto $proyecto, Task $task, UpdateTaskAction $action): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('updateTask', $proyecto);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        \Illuminate\Support\Facades\Log::info("Updating task: " . $task->uuid, [
            'proyecto' => $proyecto->id,
            'data' => $request->all()
        ]);

        // Sanitize: If 'images' is present but not as files (e.g. from a relation), remove it to avoid validation failure
        if ($request->has('images') && !$request->hasFile('images')) {
            $request->request->remove('images');
        }
        if ($request->has('image') && !$request->hasFile('image')) {
            $request->request->remove('image');
        }

        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'status' => 'sometimes|required|in:todo,in_progress,done',
                'priority' => 'sometimes|required|in:low,medium,high',
                'due_date' => 'sometimes|nullable|date',
                'assignees' => 'sometimes|nullable|array',
                'assignees.*' => 'exists:users,id',
                'related_type' => 'sometimes|nullable|string|max:255',
                'related_id' => 'sometimes|nullable|string|max:255',
                'image' => 'sometimes|nullable|image|mimes:jpeg,jpg,png,webp|max:3072',
                'images' => 'sometimes|nullable|array',
                'images.*' => 'image|mimes:jpeg,jpg,png,webp|max:3072',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::error("Validation failed updating task", [
                'errors' => $e->errors()
            ]);
            throw $e;
        }

        $dataToUpdate = $validated;
        $assigneesToUpdate = $validated['assignees'] ?? null;

        // Security check: only admins or creators can modify core fields
        $canEditFullTask = $user->esAdminDe($proyecto) || (int) $task->user_id === (int) $user->id;
        if (!$canEditFullTask) {
            // Remove restricted fields from the data payload
            $restrictedFields = ['title', 'description', 'priority', 'due_date'];
            foreach ($restrictedFields as $field) {
                unset($dataToUpdate[$field]);
            }
            // Also prevent assignee changes
            $assigneesToUpdate = null;
        }

        $dto = new UpdateTaskDTO(
            task: $task,
            data: $dataToUpdate,
            assignees: $assigneesToUpdate,
            image: $request->file('image'),
            images: $request->file('images')
        );

        $task = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($task, 200);
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    /**
     * Store a comment for the task.
     */
    public function storeComment(Request $request, Proyecto $proyecto, Task $task, \App\Modules\Tasks\Actions\CreateTaskCommentAction $action): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('updateTask', $proyecto);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'mentioned_user_ids' => 'nullable|array',
            'mentioned_user_ids.*' => 'integer|exists:users,id',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();
        /** @var array<int, int> $mentionedIds */
        $mentionedIds = array_map('intval', $validated['mentioned_user_ids'] ?? []);

        \Illuminate\Support\Facades\Log::info("Storing comment for task: " . $task->uuid, [
            'user' => $user->id,
            'mentioned_ids' => $mentionedIds,
            'content_length' => strlen($validated['content'])
        ]);

        $comment = $action->execute($task, $user, $validated['content'], $mentionedIds);

        if ($request->wantsJson()) {
            return response()->json($comment->load('user'), 201);
        }

        return redirect()->back()->with('success', 'Comment added successfully.');
    }

    /**
     * Serve the task's image securely.
     */
    public function image(Proyecto $proyecto, Task $task): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Security check: task must belong to the project
        if ((int) $task->project_id !== (int) $proyecto->id) {
            abort(404);
        }

        // Authorization check: user must be a member of the project
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user->esMiembroDe($proyecto)) {
            abort(403);
        }

        if (!$task->image_path || !\Illuminate\Support\Facades\Storage::disk("local")->exists($task->image_path)) {
            abort(404);
        }

        return response()->file(\Illuminate\Support\Facades\Storage::disk('local')->path($task->image_path), [
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }

    /**
     * Serve the task's gallery image securely.
     */
    public function galleryImage(Proyecto $proyecto, Task $task, \App\Modules\Tasks\Models\TaskImage $image): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Security check: task must belong to the project
        if ((int) $task->project_id !== (int) $proyecto->id) {
            abort(404);
        }
        
        // Security check: image must belong to the task
        if ((string) $image->task_id !== (string) $task->id) {
            abort(404);
        }

        // Authorization check: user must be a member of the project
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$user->esMiembroDe($proyecto)) {
            abort(403);
        }

        // Visibility check: admins see all. Non-admins can only see if assigned (assigned_to or in users relation) OR creator
        $isAdmin = $user->esAdminDe($proyecto);
        $isCreator = (int) $task->user_id === (int) $user->id;
        $isAssigned = ((int) $task->assigned_to === (int) $user->id) || $task->users->contains('id', $user->id);
        
        if (!$isAdmin && !$isCreator && !$isAssigned) {
            \Illuminate\Support\Facades\Log::warning("Unauthorized gallery image access attempt", [
                'user_id' => $user->id,
                'project_id' => $proyecto->id,
                'task_id' => $task->id,
                'image_id' => $image->id
            ]);
            abort(403);
        }

        if (!$image->image_path || !\Illuminate\Support\Facades\Storage::disk("local")->exists($image->image_path)) {
            abort(404);
        }

        return response()->file(\Illuminate\Support\Facades\Storage::disk('local')->path($image->image_path), [
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }

    /**
     * Delete Task
     * 
     * Permanently delete a task.
     * Supports both JSON and HTML responses.
     */
    public function destroy(Request $request, Proyecto $proyecto, Task $task): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('deleteTask', $proyecto);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Only admin or creator can delete
        if (!$user->esAdminDe($proyecto) && (int) $task->user_id !== (int) $user->id) {
            abort(403, 'Solo el creador o un administrador pueden eliminar la tarea.');
        }

        $task->delete();

        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
