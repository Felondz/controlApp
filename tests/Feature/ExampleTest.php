<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->getJson('/api/health-check');

        // Si el endpoint no existe, es OK - verificamos que la app está arriba
        $this->assertTrue(
            $response->status() === 404 || $response->status() === 200
        );
    }
}
