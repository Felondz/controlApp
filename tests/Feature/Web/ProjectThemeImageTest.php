<?php

namespace Tests\Feature\Web;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectThemeImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_project_with_image_theme_typography()
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->image('project_cover.jpg');

        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'Proyecto Visual',
            'moneda_default' => 'USD',
            'descripcion' => 'Proyecto con tema e imagen',
            'modules' => ['finance'],
            'image' => $file,
            'theme' => 'emerald-nature',
            'typography' => 'roboto',
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Proyecto Visual',
            'theme' => 'emerald-nature',
            'typography' => 'roboto',
            'user_id' => $user->id,
        ]);

        $proyecto = \App\Models\Proyecto::where('nombre', 'Proyecto Visual')->first();
        $this->assertNotNull($proyecto->image_path);
        Storage::disk('public')->assertExists($proyecto->image_path);
    }

    public function test_project_creation_uses_defaults_when_theme_missing()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'Proyecto Default',
            'moneda_default' => 'COP',
            'modules' => ['tasks'],
            // No theme, no typography, no image
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('proyectos', [
            'nombre' => 'Proyecto Default',
            'theme' => 'purple-modern', // Default from migration
            'typography' => 'sans',     // Default from migration
            'image_path' => null,
        ]);
    }
    
    public function test_image_validation_rules()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        
        // Test non-image file
        $file = UploadedFile::fake()->create('document.pdf', 100);
        
        $response = $this->actingAs($user)->post(route('mis-proyectos.store'), [
            'nombre' => 'Proyecto Invalido',
            'moneda_default' => 'USD',
            'image' => $file,
        ]);
        
        $response->assertSessionHasErrors('image');
    }
}
