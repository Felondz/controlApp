<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_deletion_requires_password()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create(['user_id' => $user->id]);
        $project->miembros()->attach($user->id, ['rol' => 'admin']);

        // Attempt without password
        $response = $this->actingAs($user)->delete(route('mis-proyectos.destroy', $project));
        $response->assertSessionHasErrors('password');
        $this->assertModelExists($project);

        // Attempt with wrong password
        $response = $this->actingAs($user)->delete(route('mis-proyectos.destroy', $project), [
            'password' => 'wrong-password',
        ]);
        $response->assertSessionHasErrors('password');
        $this->assertModelExists($project);

        // Attempt with correct password
        $response = $this->actingAs($user)->delete(route('mis-proyectos.destroy', $project), [
            'password' => 'password', // Default factory password
        ]);

        $response->assertRedirect(route('dashboard'));
        // Use assertSoftDeleted because the model uses SoftDeletes
        $this->assertSoftDeleted($project);
    }

    public function test_non_admin_cannot_delete_project()
    {
        $owner = User::factory()->create();
        $project = Proyecto::factory()->create(['user_id' => $owner->id]);
        $project->miembros()->attach($owner->id, ['rol' => 'admin']);

        $member = User::factory()->create();
        $project->miembros()->attach($member->id, ['rol' => 'miembro']);

        $response = $this->actingAs($member)->delete(route('mis-proyectos.destroy', $project), [
            'password' => 'password',
        ]);

        $response->assertStatus(403);
        $this->assertModelExists($project);
    }
}
