<?php

namespace Database\Factories;

use App\Models\UserLlmSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserLlmSetting>
 */
class UserLlmSettingFactory extends Factory
{
    protected $model = UserLlmSetting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => $this->faker->randomElement(['openai', 'anthropic', 'google']),
            'api_key' => 'sk-' . $this->faker->password(32, 32),
            'default_model' => 'gpt-4o',
            'is_active' => true,
        ];
    }
}
