<?php

namespace Database\Factories;

use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Finance\Models\Cuenta>
 */
class CuentaFactory extends Factory
{
    protected $model = \App\Modules\Finance\Models\Cuenta::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $balance = $this->faker->numberBetween(1000, 100000);

        return [
            'nombre' => $this->faker->word() . ' - ' . $this->faker->randomElement(['Banco', 'Efectivo', 'Tarjeta']),
            'banco' => $this->faker->company(),
            'saldo_inicial' => $balance,
            'saldo_actual' => $balance,
            'tipo' => $this->faker->randomElement(['efectivo', 'banco', 'credito', 'otro']),
            'estado' => 'activa',
            'propietario_id' => Proyecto::factory(),
            'propietario_type' => 'proyecto',
        ];
    }
}
