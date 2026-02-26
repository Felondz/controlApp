<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Operations\Models\ProductionProcess;
use App\Models\Proyecto;
use App\Modules\Inventory\Models\InventoryItem;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Operations\Models\ProductionProcess>
 */
class ProductionProcessFactory extends Factory
{
    protected $model = ProductionProcess::class;

    /**
     * @return array<string, mixed>
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
