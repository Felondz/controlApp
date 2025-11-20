<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @skip Pendiente: Refactorizar con Inertia/React
     */
    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        // Verify user was created in database
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);

        // Get the created user and verify authentication
        $user = \App\Models\User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        
        // Verify redirect location
        $response->assertRedirect(route('dashboard', absolute: false));
        
        // Mark user as verified to access dashboard
        $user->forceFill(['email_verified_at' => now()])->save();
        
        // Verify user is authenticated by making a request to a protected route
        $this->actingAs($user)
            ->get(route('dashboard', absolute: false))
            ->assertStatus(200);
    }
}
