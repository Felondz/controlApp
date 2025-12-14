<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Provider; // Use correct namespace
use Illuminate\Foundation\Testing\RefreshDatabase;

class OnlyProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_provider()
    {
        $proyecto = Proyecto::factory()->create();
        $provider = Provider::factory()->create(['proyecto_id' => $proyecto->id]);
        
        $this->assertDatabaseHas('providers', ['id' => $provider->id]);
    }
}
