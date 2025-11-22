<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @skip Pendiente: Refactorizar con Inertia/React
     */
    public function test_confirm_password_screen_can_be_rendered(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('password.confirm'));

        $response->assertInertia(fn (Assert $page) => 
            $page->component('Auth/ConfirmPassword')
        );
    }

    public function test_password_can_be_confirmed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('password.confirm'), [
            'password' => 'password',
            '_token' => csrf_token(),
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    public function test_password_is_not_confirmed_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('password.confirm'), [
            'password' => 'wrong-password',
            '_token' => csrf_token(),
        ]);

        $response->assertSessionHasErrors('password');
    }
}
