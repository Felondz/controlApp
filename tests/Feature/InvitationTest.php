<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Invitacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_invitations()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create();

        Invitacion::create([
            'user_id' => $project->user_id,
            'proyecto_id' => $project->id,
            'email' => $user->email,
            'rol' => 'miembro',
            'token' => 'test-token',
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($user)->get(route('invitations.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component('Invitations/Index')
                ->has('invitations', 1)
        );
    }

    public function test_user_can_accept_invitation()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create();

        $invitation = Invitacion::create([
            'user_id' => $project->user_id,
            'proyecto_id' => $project->id,
            'email' => $user->email,
            'rol' => 'miembro',
            'token' => 'test-token',
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($user)->post(route('invitations.accept', $invitation));

        $response->assertRedirect(route('mis-proyectos.show', $project->uuid));
        $this->assertDatabaseMissing('invitaciones', ['id' => $invitation->id]);
        $this->assertTrue($user->esMiembroDe($project));
    }

    public function test_user_can_reject_invitation()
    {
        $user = User::factory()->create();
        $project = Proyecto::factory()->create();

        $invitation = Invitacion::create([
            'user_id' => $project->user_id,
            'proyecto_id' => $project->id,
            'email' => $user->email,
            'rol' => 'miembro',
            'token' => 'test-token-reject',
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->actingAs($user)->post(route('invitations.reject', $invitation));

        $response->assertRedirect();
        $this->assertDatabaseMissing('invitaciones', ['id' => $invitation->id]);
        $this->assertFalse($user->esMiembroDe($project));
    }
}
