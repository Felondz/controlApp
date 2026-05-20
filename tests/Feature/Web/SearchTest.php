<?php declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Laravel\Scout\Facades\Scout;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_page_is_accessible(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('search'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('SearchResults')
                ->has('users')
                ->has('projects')
            );
    }

    public function test_search_returns_results(): void
    {
        // Use the 'collection' driver which runs synchronously in memory.
        Config::set('scout.driver', 'collection');

        $user = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
        $targetUser = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        $targetProject = Proyecto::factory()->create(['nombre' => 'Project Alpha', 'user_id' => $user->id]);

        // We manually "index" the models in the fake driver if needed, 
        // but Scout::fake() usually requires us to mock the results directly 
        // or it just captures the query. 
        // Actually, standard Scout::fake() doesn't return results automatically based on query.
        // It's often better to test that the *search* method is called.
        // However, for an integration test of the controller, we want to see data.
        // Let's use the 'collection' driver for testing if we want real results, 
        // or just verify the view receives what we expect if we mock it.
        


        $this->actingAs($user)
            ->get(route('search', ['query' => 'John']))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('SearchResults')
                ->has('users', 1) // Should find John
                ->where('users.0.name', 'John Doe')
            );

        $this->actingAs($user)
            ->get(route('search', ['query' => 'Alpha']))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('SearchResults')
                ->has('projects', 1) // Should find Project Alpha
                ->where('projects.0.nombre', 'Project Alpha')
            );
    }

    public function test_models_have_correct_searchable_array(): void
    {
        $user = User::factory()->create(['name' => 'Test User', 'email' => 'test@test.com']);
        $array = $user->toSearchableArray();

        $this->assertArrayHasKey('id', $array);
        $this->assertArrayHasKey('name', $array);
        $this->assertArrayHasKey('email', $array);
        $this->assertEquals('Test User', $array['name']);

        $project = Proyecto::factory()->create(['nombre' => 'Test Project']);
        $projectArray = $project->toSearchableArray();

        $this->assertArrayHasKey('id', $projectArray);
        $this->assertArrayHasKey('nombre', $projectArray);
        $this->assertArrayHasKey('user_id', $projectArray);
        $this->assertEquals('Test Project', $projectArray['nombre']);
    }

    public function test_search_respects_project_access(): void
    {
        Config::set('scout.driver', 'collection');

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        // Project owned by user
        $myProject = Proyecto::factory()->create([
            'nombre' => 'My Secret Project', 
            'user_id' => $user->id
        ]);

        // Project owned by other user (not shared)
        $otherProject = Proyecto::factory()->create([
            'nombre' => 'Other Secret Project', 
            'user_id' => $otherUser->id
        ]);

        // Search as user - should only see my project
        $this->actingAs($user)
            ->get(route('search', ['query' => 'Secret']))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('SearchResults')
                ->has('projects', 1)
                ->where('projects.0.nombre', 'My Secret Project')
            );
    }
}
