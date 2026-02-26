<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

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
            'password' => 'New-password1',
            'password_confirmation' => 'New-password1',
            'terms' => true,
        ]);

        // $this->assertAuthenticated(); // Auth::login removed in controller
        $response->assertRedirect(route('login'));
    }

    public function test_registration_fails_if_terms_not_accepted(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            // 'terms' => false, // Missing or false
        ]);

        $response->assertSessionHasErrors(['terms']);
        $this->assertGuest();
    }
}
