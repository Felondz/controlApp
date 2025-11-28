<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfilePhotoValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_photo_must_be_an_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['profile_photo']);
    }

    public function test_profile_photo_must_not_exceed_3mb(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        // 3MB = 3072KB. Create a file slightly larger (3100KB)
        $file = UploadedFile::fake()->image('large_avatar.jpg')->size(3100);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['profile_photo']);
    }
}
