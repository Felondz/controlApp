<?php

namespace Tests\Feature\Modules\Tasks;

use Tests\TestCase;
use App\Models\User;
use App\Models\Proyecto;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Proyecto $proyecto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->proyecto = Proyecto::create([
            'nombre' => 'Test Project',
            'user_id' => $this->user->id,
            'moneda_default' => 'USD',
            'modules' => ['tasks']
        ]);

        $this->proyecto->miembros()->attach($this->user->id, ['rol' => 'admin']);
    }

    public function test_can_create_task()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/tasks", [
            'title' => 'New Task',
            'description' => 'Description',
            'status' => 'todo',
            'priority' => 'medium',
            'due_date' => '2025-12-31'
        ]);

        $response->assertStatus(302);

        $this->assertDatabaseHas('tasks', [
            'project_id' => $this->proyecto->id,
            'title' => 'New Task'
        ]);
    }

    public function test_can_update_task_status()
    {
        Sanctum::actingAs($this->user);

        $task = Task::create([
            'project_id' => $this->proyecto->id,
            'title' => 'Test Task',
            'status' => 'todo',
            'priority' => 'medium'
        ]);

        $response = $this->putJson("/api/proyectos/{$this->proyecto->id}/tasks/{$task->id}", [
            'title' => 'Test Task',
            'status' => 'done',
            'priority' => 'medium'
        ]);

        $response->assertStatus(302);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'done'
        ]);
    }

    public function test_can_create_financial_task()
    {
        Sanctum::actingAs($this->user);

        $category = \App\Models\Categoria::factory()->create(['proyecto_id' => $this->proyecto->id]);

        $response = $this->postJson("/api/proyectos/{$this->proyecto->id}/tasks", [
            'title' => 'Financial Task',
            'status' => 'todo',
            'priority' => 'high',
            'is_financial' => true,
            'amount' => 150.00,
            'category_id' => $category->id
        ]);

        $response->assertStatus(302);

        $this->assertDatabaseHas('tasks', [
            'project_id' => $this->proyecto->id,
            'title' => 'Financial Task',
            'is_financial' => true,
            'amount' => 150.00
        ]);
    }
}
