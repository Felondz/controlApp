<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Proyecto $proyecto)
    {
        $this->authorize('view', $proyecto);

        return Inertia::render('Projects/Tasks/Index', [
            'proyecto' => $proyecto->load('miembros'),
            'tasks' => $proyecto->tasks()->with(['assignee', 'category'])->get(),
            'categories' => $proyecto->categorias()->where('tipo', 'gasto')->get(),
        ]);
    }

    public function summary(Proyecto $proyecto)
    {
        $this->authorize('view', $proyecto);

        $tasks = $proyecto->tasks;

        return response()->json([
            'pending' => $tasks->where('status', 'todo')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'done' => $tasks->where('status', 'done')->count(),
            'overdue' => $tasks->where('due_date', '<', now())->where('status', '!=', 'done')->count(),
        ]);
    }

    public function store(Request $request, Proyecto $proyecto)
    {
        $this->authorize('addTask', $proyecto);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'is_financial' => 'boolean',
            'amount' => 'nullable|required_if:is_financial,true|numeric|min:0',
            'category_id' => 'nullable|required_if:is_financial,true|exists:categorias,id',
        ]);

        $task = $proyecto->tasks()->create($validated);

        if ($request->wantsJson()) {
            return response()->json($task, 201);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Proyecto $proyecto, Task $task)
    {
        $this->authorize('updateTask', $proyecto);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'is_financial' => 'boolean',
            'amount' => 'nullable|required_if:is_financial,true|numeric|min:0',
            'category_id' => 'nullable|required_if:is_financial,true|exists:categorias,id',
        ]);

        $task->update($validated);

        if ($request->wantsJson()) {
            return response()->json($task, 200);
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Request $request, Proyecto $proyecto, Task $task)
    {
        $this->authorize('deleteTask', $proyecto);

        $task->delete();

        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
