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

    public function store(Request $request, Proyecto $proyecto)
    {
        $this->authorize('update', $proyecto);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'is_financial' => 'boolean',
            'amount' => 'required_if:is_financial,true|numeric|min:0',
            'category_id' => 'required_if:is_financial,true|exists:categorias,id',
        ]);

        $task = $proyecto->tasks()->create($validated);

        if ($request->wantsJson()) {
            return response()->json($task, 201);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, Proyecto $proyecto, Task $task)
    {
        $this->authorize('update', $proyecto);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,done',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'is_financial' => 'boolean',
            'amount' => 'required_if:is_financial,true|numeric|min:0',
            'category_id' => 'required_if:is_financial,true|exists:categorias,id',
        ]);

        $task->update($validated);

        if ($request->wantsJson()) {
            return response()->json($task, 200);
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Request $request, Proyecto $proyecto, Task $task)
    {
        $this->authorize('update', $proyecto);

        $task->delete();

        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
