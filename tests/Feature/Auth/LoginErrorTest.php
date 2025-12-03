<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginErrorTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_non_existent_email_returns_specific_error()
    {
        $response = $this->post('/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors([
            'email' => 'No existe una cuenta registrada con este correo electrónico.',
        ]);
    }

    public function test_login_with_wrong_password_returns_generic_error()
    {
        $user = \App\Models\User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertStringContainsString(trans('auth.failed'), session('errors')->first('email'));
    }
}
