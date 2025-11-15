<?php

namespace Database\Factories;

use App\Models\Invitacion;
use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InvitacionFactory extends Factory
{
    protected $model = Invitacion::class;

    public function definition(): array
    {
        return [
            'proyecto_id' => Proyecto::factory(),
            'email' => $this->faker->unique()->safeEmail(),
            'rol' => $this->faker->randomElement(['miembro', 'tesorero', 'contador']),
            'token' => Str::random(40),
            'expires_at' => now()->addDays(7),
        ];
    }
}
