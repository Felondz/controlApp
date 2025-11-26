<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateProjectFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_project_with_modules_color_and_icon()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'New Dynamic Project',
            'descripcion' => 'A project with modules',
            'moneda_default' => 'USD',
            'modules' => ['finance', 'tasks'],
            'color' => '#FF5733',
            'icon' => '🚀',
        ]);

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'New Dynamic Project',
            'user_id' => $user->id,
            'color' => '#FF5733',
            'icon' => '🚀',
        ]);

        $project = \App\Models\Proyecto::where('nombre', 'New Dynamic Project')->first();
        $this->assertIsArray($project->modules);
        $this->assertEquals(['finance', 'tasks'], $project->modules);
    }

    public function test_project_creation_fails_with_invalid_data()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'Invalid Project',
            'moneda_default' => 'USD',
            'modules' => [], // Empty modules
        ]);

        $response->assertSessionHasErrors(['modules']);
    }
}
