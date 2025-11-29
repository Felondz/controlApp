<?php

namespace Tests\Feature\Tools;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MarketTest extends TestCase
{
    use RefreshDatabase;

    public function test_market_page_is_accessible()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('tools.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
                ->component('Tools/Index')
        );
    }

    public function test_tools_can_be_toggled()
    {
        $user = User::factory()->create([
            'enabled_tools' => [],
        ]);

        $response = $this->actingAs($user)->post(route('tools.toggle'), [
            'tool' => 'financial-calculator',
            'enable' => true,
        ]);

        $response->assertRedirect();
        $this->assertTrue(in_array('financial-calculator', $user->fresh()->enabled_tools));

        $response = $this->actingAs($user)->post(route('tools.toggle'), [
            'tool' => 'financial-calculator',
            'enable' => false,
        ]);

        $response->assertRedirect();
        $this->assertFalse(in_array('financial-calculator', $user->fresh()->enabled_tools));
    }
}
