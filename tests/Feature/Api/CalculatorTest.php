<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculator_api_requires_authentication()
    {
        $response = $this->postJson('/api/tools/calculator/calculate', [
            'amount' => 1000000,
            'rate' => 12,
            'term' => 12,
            'termType' => 'months',
            'rateType' => 'EA'
        ]);

        $response->assertStatus(401);
    }

    public function test_calculator_api_returns_correct_structure()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/tools/calculator/calculate', [
            'amount' => 10000000,
            'rate' => 15,
            'term' => 12,
            'termType' => 'months',
            'rateType' => 'EA',
            'insurance' => 0
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'monthlyPayment',
                'principalAmount',
                'totalInterest',
                'totalPayment',
                'schedule' => [
                    '*' => [
                        'month',
                        'payment',
                        'interest',
                        'principal',
                        'balance'
                    ]
                ],
                'inputs'
            ]);
    }

    public function test_calculator_api_validates_inputs()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/tools/calculator/calculate', [
            'amount' => -100, // Invalid
            'rate' => 'abc', // Invalid
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount', 'rate', 'term', 'termType', 'rateType']);
    }
}
