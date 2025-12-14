<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Finance\Models\SupplyContract;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Provider;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Cuenta;

class SupplyContractFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SupplyContract::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'provider_id' => 1, // Placeholder or Factory if Provider exists
            'name' => 'Contract ' . $this->faker->words(2, true),
            'frequency' => 'weekly',
            'recurrence_day' => 1,
            'items' => json_encode([]),
            'total_amount' => $this->faker->randomFloat(2, 100, 1000),
            'currency_code' => 'USD',
            'auto_generate_invoice' => true,
            'billing_category_id' => 1, // Placeholder or Factory
            'target_account_id' => 1, // Placeholder or Factory
            'next_run_at' => now()->addWeek(),
            'status' => 'active',
        ];
    }
}
