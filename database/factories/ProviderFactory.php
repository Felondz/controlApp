<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Modules\Finance\Models\Provider;
use App\Models\Proyecto;

class ProviderFactory extends Factory
{
    protected $model = Provider::class;

    public function definition()
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'name' => $this->faker->company(),
            'tax_id' => $this->faker->unique()->isbn13(),
            'contact_name' => $this->faker->name(),
            'email' => $this->faker->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'payment_terms' => 'immediate',
            'category' => 'goods',
            'notes' => $this->faker->sentence(),
        ];
    }
}
