<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Operations\Models\LoteProduccion;
use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;
use App\Models\User;

class LoteProduccionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = LoteProduccion::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            // production_process_id: null by default or create one if needed
            // stage_id: null by default
            'inventory_item_id' => InventoryItem::factory(),
            'code' => 'LOTE-' . $this->faker->unique()->bothify('####-????'),
            'initial_quantity' => $this->faker->numberBetween(10, 100),
            'current_quantity' => $this->faker->numberBetween(10, 100),
            'start_date' => $this->faker->date(),
            // end_date: null
            'status' => 'active',
            'notes' => $this->faker->sentence(),
            'assigned_to' => User::factory(),
        ];
    }
}
