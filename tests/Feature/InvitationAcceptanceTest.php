<?php declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Invitacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvitationAcceptanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_accepted_invitation_appears_in_dashboard(): void
    {
        // 1. Create owner and guest
        $owner = User::factory()->create();
        $guest = User::factory()->create();

        // 2. Create project
        $proyecto = Proyecto::create([
            'nombre' => 'Shared Project',
            'moneda_default' => 'USD',
            'user_id' => $owner->id,
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => ['finance'],
        ]);
        $proyecto->miembros()->attach($owner->id, ['rol' => 'admin']);

        // 3. Create invitation
        $invitation = Invitacion::create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $owner->id,
            'email' => $guest->email,
            'rol' => 'miembro',
            'token' => 'test-token',
            'status' => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        // 4. Guest accepts invitation
        $this->actingAs($guest)
            ->post(route('invitation.process', ['token' => $invitation->token]))
            ->assertRedirect();

        // 5. Check if guest is member
        $this->assertTrue($guest->esMiembroDe($proyecto));

        // 6. Check guest dashboard
        $response = $this->actingAs($guest)->get(route('dashboard'));
        $response->assertStatus(200);
        
        // Assert project is in the list passed to Inertia
        $response->assertInertia(fn ($page) => $page
            ->has('proyectos')
            ->where('proyectos', function ($proyectos) use ($proyecto) {
                $uuids = collect($proyectos)->pluck('uuid')->toArray();
                return in_array($proyecto->uuid, $uuids);
            })
        );
    }
}
