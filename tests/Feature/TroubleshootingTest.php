<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TroubleshootingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Validación 'unique' debe fallar en nombres duplicados
     * Nota: El UserObserver crea automáticamente un proyecto personal, por eso verificamos que sea no-personal
     */
    public function test_store_fails_on_unique_rule(): void
    {
        $user = User::factory()->create();

        // Crear un proyecto inicial - debe ser exitoso
        $response1 = $this->actingAs($user)->post('/mis-proyectos', [
            'nombre' => 'Proyecto Test',
            'descripcion' => 'Primera vez',
            'moneda_default' => 'COP',
        ]);
        
        // Verificar que el primer POST fue exitoso
        $response1->assertStatus(302);
        // Verificar que se creó el proyecto (solo contamos proyectos no personales)
        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Proyecto Test',
            'user_id' => $user->id,
            'es_personal' => false,
        ]);

        // Intentar crear otro con el mismo nombre - debe fallar
        $response = $this->actingAs($user)->post('/mis-proyectos', [
            'nombre' => 'Proyecto Test', // Duplicado
            'descripcion' => 'Segunda vez',
            'moneda_default' => 'COP',
        ]);

        // Debe fallar por unique
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['nombre']);

        // Verificar que no se creó un segundo proyecto con el mismo nombre
        $this->assertDatabaseMissing('proyectos', [
            'nombre' => 'Proyecto Test',
            'descripcion' => 'Segunda vez',
        ]);
    }

    /**
     * Test: Validación 'min:3' debe fallar en nombres cortos
     */
    public function test_store_fails_on_min_three_characters_rule(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/mis-proyectos', [
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

        $response = $this->actingAs($user)->post('/mis-proyectos', [
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

        $response = $this->actingAs($user)->post('/mis-proyectos', [
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
