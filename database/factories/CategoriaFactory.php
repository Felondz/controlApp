<?php

namespace Database\Factories;

use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Finance\Models\Categoria>
 */
class CategoriaFactory extends Factory
{
    protected $model = \App\Modules\Finance\Models\Categoria::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->words(3, true),
            'tipo' => $this->faker->randomElement(['ingreso', 'gasto']),
            'proyecto_id' => Proyecto::factory(),
        ];
    }
}
