<?php

namespace App\Modules\Tasks\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Tasks\Models\Task;
use App\Models\Proyecto;
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

        if ($request->wantsJson()) {
            return response()->json($proyecto->tasks()->with(['users', 'category'])->get());
        }

        return Inertia::render('Projects/Tasks/Index', [
            'proyecto' => $proyecto->load('miembros'),
            'tasks' => $proyecto->tasks()->with(['users', 'category'])->get(),
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

            $tasks = $proyecto->tasks;

            return response()->json([
                'pending' => $tasks->where('status', 'todo')->count(),
                'in_progress' => $tasks->where('status', 'in_progress')->count(),
                'done' => $tasks->where('status', 'done')->count(),
                'overdue' => $tasks->where('due_date', '<', now())->where('status', '!=', 'done')->count(),
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

            $users = $proyecto->miembros()->with([
                'tasks' => function ($query) use ($proyecto) {
                    // Fix: Qualify column to avoid ambiguity if joined
                    $query->where('tasks.project_id', $proyecto->id);
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
    public function store(Request $request, Proyecto $proyecto): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
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
        ]);

        /** @var \App\Modules\Tasks\Models\Task $task */
        $task = $proyecto->tasks()->create($validated);

        if (!empty($validated['assignees'])) {
            $task->users()->sync($validated['assignees']);
        }

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
    public function update(Request $request, Proyecto $proyecto, Task $task): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $this->authorize('updateTask', $proyecto);

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
        ]);

        $task->update($validated);

        if (isset($validated['assignees'])) {
            $task->users()->sync($validated['assignees']);
        }

        if ($request->wantsJson()) {
            return response()->json($task, 200);
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
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

        $task->delete();

        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
