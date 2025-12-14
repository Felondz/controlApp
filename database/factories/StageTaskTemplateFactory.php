<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Operations\Models\StageTaskTemplate;
use App\Models\Proyecto;
use App\Modules\Operations\Models\EtapaProceso;

class StageTaskTemplateFactory extends Factory
{
    protected $model = StageTaskTemplate::class;

    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'etapa_proceso_id' => EtapaProceso::factory(),
            'name' => 'Auto Task: ' . $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'priority' => 'medium',
            'days_due_offset' => 3,
            'is_mandatory' => $this->faker->boolean(20),
        ];
    }
}
