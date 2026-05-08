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
        Storage::fake('local');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['profile_photo']);
    }

    public function test_profile_photo_must_not_exceed_4mb(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        // 4MB = 4096KB. Create a file slightly larger (4100KB)
        $file = UploadedFile::fake()->image('large_avatar.jpg')->size(4100);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['profile_photo']);
    }
}
