<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TroubleshootingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Validación 'max:1' debe fallar en nombres largos
     * Diagnóstico: Confirmar si StoreProyectoRequest está siendo ejecutado
     */
    public function test_store_fails_on_max_one_character_rule(): void
    {
        // ARRANGE: Crear usuario autenticado
        $user = User::factory()->create();

        // ACT: Intentar enviar un nombre que debería fallar por 'max:1'
        $response = $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'Nombre Muy Largo', // Fallaría en max:1
            'descripcion' => 'Descripción de prueba',
            'moneda_default' => 'COP',
        ]);

        // ASSERT: Debe fallar la validación
        $response->assertStatus(302); // Redirect on validation failure
        $response->assertSessionHasErrors(['nombre']);

        // Verificar que NO se creó el proyecto
        $this->assertDatabaseMissing('proyectos', [
            'nombre' => 'Nombre Muy Largo',
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test: Validación 'unique' debe fallar en nombres duplicados
     */
    public function test_store_fails_on_unique_rule(): void
    {
        $user = User::factory()->create();

        // Crear un proyecto inicial
        $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'Proyecto Test',
            'descripcion' => 'Primera vez',
            'moneda_default' => 'COP',
        ]);

        // Intentar crear otro con el mismo nombre
        $response = $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'Proyecto Test', // Duplicado
            'descripcion' => 'Segunda vez',
            'moneda_default' => 'COP',
        ]);

        // Debe fallar por unique
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['nombre']);

        // Verificar que solo hay UN proyecto
        $this->assertDatabaseCount('proyectos', 1);
    }

    /**
     * Test: Validación 'min:3' debe fallar en nombres cortos
     */
    public function test_store_fails_on_min_three_characters_rule(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'AB', // Menos de 3 caracteres
            'descripcion' => 'Prueba',
            'moneda_default' => 'COP',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['nombre']);

        $this->assertDatabaseMissing('proyectos', [
            'nombre' => 'AB',
        ]);
    }

    /**
     * Test: Validación 'in' debe fallar en monedas inválidas
     */
    public function test_store_fails_on_invalid_currency(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'Proyecto Válido',
            'descripcion' => 'Prueba',
            'moneda_default' => 'JPY', // No está en COP, USD, EUR
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['moneda_default']);

        $this->assertDatabaseMissing('proyectos', [
            'nombre' => 'Proyecto Válido',
        ]);
    }

    /**
     * Test: La creación DEBE exitosa con datos válidos
     */
    public function test_store_succeeds_with_valid_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/proyectos', [
            'nombre' => 'Proyecto Válido ABC',
            'descripcion' => 'Esta es una descripción válida',
            'moneda_default' => 'COP',
        ]);

        // Debe redirigir exitosamente (302 o similar)
        $response->assertStatus(302);

        // Verificar que SE CREÓ el proyecto
        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Proyecto Válido ABC',
            'user_id' => $user->id,
            'moneda_default' => 'COP',
        ]);
    }
}
