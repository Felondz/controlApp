<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Operations\Models\EtapaProceso;
use App\Models\Proyecto;

class EtapaProcesoFactory extends Factory
{
    protected $model = EtapaProceso::class;

    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'name' => $this->faker->word(),
            'order' => $this->faker->numberBetween(1, 10),
            'description' => $this->faker->sentence(),
            'requires_quality_check' => $this->faker->boolean(),
            'estimated_duration_days' => $this->faker->numberBetween(1, 30),
        ];
    }
}
