<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @skip Pendiente: Refactorizar con Inertia/React
     */
    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get(route('login'));

        $response->assertInertia(fn (Assert $page) => 
            $page->component('Auth/Login')
        );
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
            '_token' => csrf_token(),
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'wrong-password',
            '_token' => csrf_token(),
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_remember_me_functionality(): void
    {
        $user = User::factory()->create();
        
        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
            'remember' => 'on',
            '_token' => csrf_token(),
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
        
        // Verificar que se estableció la cookie de recuerdo
        $response->assertCookie(
            auth()->guard()->getRecallerName(),
            $user->id.'|'.$user->getRememberToken().'|'.$user->getAuthPassword()
        );
    }
}
