<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserLocaleApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Usuario autenticado puede cambiar su idioma preferido.
     */
    public function test_authenticated_user_can_update_locale(): void
    {
        $user = User::factory()->create(['locale' => 'es']);
        /** @var User $user */
        $user = $user;

        $response = $this->actingAs($user)
            ->putJson('/api/user/locale', ['locale' => 'en']);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'locale' => 'en',
            ]);

        // Verificar que se actualizó en BD
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'locale' => 'en',
        ]);
    }

    /**
     * Usuario no autenticado no puede cambiar idioma.
     */
    public function test_unauthenticated_user_cannot_update_locale(): void
    {
        $response = $this->putJson('/api/user/locale', ['locale' => 'en']);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    /**
     * Validar que solo acepta locales válidos.
     */
    public function test_invalid_locale_is_rejected(): void
    {
        $user = User::factory()->create(['locale' => 'es']);
        /** @var User $user */
        $user = $user;

        $response = $this->actingAs($user)
            ->putJson('/api/user/locale', ['locale' => 'invalid']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('locale');
    }

    /**
     * Validar que el campo locale es requerido.
     */
    public function test_locale_field_is_required(): void
    {
        $user = User::factory()->create();
        /** @var User $user */
        $user = $user;

        $response = $this->actingAs($user)
            ->putJson('/api/user/locale', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('locale');
    }

    /**
     * Aceptar todos los locales válidos.
     */
    public function test_all_valid_locales_are_accepted(): void
    {
        $user = User::factory()->create();
        /** @var User $user */
        $user = $user;

        foreach (['es', 'en', 'pt'] as $locale) {
            $response = $this->actingAs($user)
                ->putJson('/api/user/locale', ['locale' => $locale]);

            $response->assertStatus(200)
                ->assertJson(['locale' => $locale]);

            $this->assertDatabaseHas('users', [
                'id' => $user->id,
                'locale' => $locale,
            ]);
        }
    }
}
