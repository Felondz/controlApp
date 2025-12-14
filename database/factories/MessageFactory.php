<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Chat\Models\Message>
 */
class MessageFactory extends Factory
{
    protected $model = \App\Modules\Chat\Models\Message::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'proyecto_id' => \App\Models\Proyecto::factory(),
            'user_id' => \App\Models\User::factory(),
            'content' => $this->faker->sentence(),
            'type' => 'text',
        ];
    }
}
