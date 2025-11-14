<?php

namespace Database\Factories;

// 1. IMPORTA TU MODELO REAL
use App\Features\Finanzas\Models\Transaccion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Features\Finanzas\Models\Transaccion>
 */
class TransaccionFactory extends Factory
{
    /**
     * El modelo asociado con el factory.
     *
     * @var string
     */
    protected $model = Transaccion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 2. LLENA TUS CAMPOS
            'descripcion' => $this->faker->sentence(6), // Una oración de 6 palabras
            'monto' => $this->faker->numberBetween(10000, 500000), // Un número entre 10k y 500k
            'tipo' => $this->faker->randomElement(['gasto', 'ingreso']), // Uno de estos dos
            'categoria' => $this->faker->randomElement(['Equipos', 'Servicios', 'Comida']),
            'fecha' => $this->faker->date(), // Una fecha aleatoria
            'notas' => $this->faker->paragraph(1), // Un párrafo corto
        ];
    }
}
