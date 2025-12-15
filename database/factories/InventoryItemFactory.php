<?php

namespace Database\Factories;

use App\Modules\Inventory\Models\InventoryItem;
use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    public function definition(): array
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'parent_id' => null,
            'sku' => strtoupper($this->faker->unique()->bothify('???-####')),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['raw_material', 'finished_good', 'service', 'asset']),
            'unit' => $this->faker->randomElement(['unit', 'kg', 'g', 'l', 'ml', 'm']),
            'attributes' => null,
            'min_stock_level' => $this->faker->randomFloat(2, 0, 50),
            'max_stock_level' => $this->faker->randomFloat(2, 50, 200),
            'current_stock' => $this->faker->randomFloat(2, 0, 100),
            'cost_price' => $this->faker->randomFloat(2, 1, 500),
            'sale_price' => $this->faker->randomFloat(2, 10, 1000),
            'is_active' => true,
            'image_path' => null,
        ];
    }

    /**
     * Indicate low stock item
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'current_stock' => $this->faker->randomFloat(2, 0, 5),
            'min_stock_level' => 10,
        ]);
    }

    /**
     * Indicate raw material
     */
    public function rawMaterial(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'raw_material',
        ]);
    }

    /**
     * Indicate finished good
     */
    public function finishedGood(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'finished_good',
        ]);
    }
}
