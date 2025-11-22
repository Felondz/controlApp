<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get(route('password.request'));
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Auth/ForgotPassword')
        );
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('password.email'), [
            'email' => $user->email,
            '_token' => csrf_token(),
        ]);

        $response->assertSessionHas('status', 'We have emailed your password reset link.');
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->get(route('password.reset', ['token' => $token]));

        $response->assertInertia(fn (Assert $page) => 
            $page->component('Auth/ResetPassword')
                ->has('token')
                ->has('email')
        );
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $newPassword = 'new-password-123';

        $response = $this->post(route('password.store'), [
            'token' => $token,
            'email' => $user->email,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
            '_token' => csrf_token(),
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    public function test_password_reset_requires_valid_data(): void
    {
        $response = $this->post(route('password.store'), [
            'token' => 'invalid-token',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => 'mismatch',
            '_token' => csrf_token(),
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['email', 'password']);
    }

    public function test_password_reset_requires_matching_passwords(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->post(route('password.store'), [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'wrong-confirmation',
            '_token' => csrf_token(),
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('password');
    }

    public function test_password_reset_requires_valid_email(): void
    {
        $response = $this->post(route('password.email'), [
            'email' => 'nonexistent@example.com',
            '_token' => csrf_token(),
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('email');
    }
}