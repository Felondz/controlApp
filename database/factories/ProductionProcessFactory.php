<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Operations\Models\ProductionProcess;
use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;

class ProductionProcessFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ProductionProcess::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'is_active' => true,
            'inventory_item_id' => InventoryItem::factory(), // Creates a new item by default
        ];
    }
}
