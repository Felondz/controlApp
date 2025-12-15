<?php

namespace Database\Factories;

use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Cuenta;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Finance\Models\Transaccion>
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
        $proyecto = Proyecto::factory();

        return [
            'descripcion' => $this->faker->sentence(6),
            'monto' => $this->faker->randomElement([-50000, -30000, -20000, 10000, 20000, 50000, 100000]),
            'fecha' => $this->faker->date(),
            'notas' => $this->faker->paragraph(1),
            'proyecto_id' => $proyecto,
            'categoria_id' => Categoria::factory()->for($proyecto),
            'cuenta_id' => Cuenta::factory()->for($proyecto, 'propietario'),
            'user_id' => User::factory(),
        ];
    }
}
