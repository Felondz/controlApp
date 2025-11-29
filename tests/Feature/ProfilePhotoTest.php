<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfilePhotoTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_photo_column_is_added()
    {
        $user = User::factory()->create();

        $this->assertTrue(
            in_array('profile_photo_path', $user->getFillable()) || 
            \Schema::hasColumn('users', 'profile_photo_path')
        );
    }

    public function test_profile_photo_can_be_uploaded()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this
            ->actingAs($user)
            ->post('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(200);
        
        $user->refresh();
        $this->assertNotNull($user->profile_photo_path);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $disk->assertExists($user->profile_photo_path);
    }

    public function test_old_profile_photo_is_deleted_when_new_one_is_uploaded()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $oldPhoto = UploadedFile::fake()->image('old_photo.jpg');
        
        // Upload first photo
        $this->actingAs($user)->post('/api/profile/photo', [
            'profile_photo' => $oldPhoto,
        ]);
        
        $user->refresh();
        $oldPhotoPath = $user->profile_photo_path;
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $disk->assertExists($oldPhotoPath);

        // Upload second photo
        $newPhoto = UploadedFile::fake()->image('new_photo.jpg');
        $this->actingAs($user->fresh())->post('/api/profile/photo', [
            'profile_photo' => $newPhoto,
        ]);

        $user->refresh();
        $newPhotoPath = $user->profile_photo_path;

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $disk->assertExists($newPhotoPath);
        $disk->assertMissing($oldPhotoPath);
        $this->assertNotEquals($oldPhotoPath, $newPhotoPath);
    }

    public function test_profile_photo_can_be_deleted()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg');
        
        // Upload photo
        $this->actingAs($user)->post('/api/profile/photo', [
            'profile_photo' => $file,
        ]);
        
        $user->refresh();
        $photoPath = $user->profile_photo_path;
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $disk->assertExists($photoPath);

        // Delete photo
        $response = $this->actingAs($user)->delete('/api/profile/photo');
        
        $response->assertStatus(200);
        
        $user->refresh();
        $this->assertNull($user->profile_photo_path);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $disk->assertMissing($photoPath);
    }

    public function test_validation_profile_photo_must_be_image()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this
            ->actingAs($user)
            ->post('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasErrors('profile_photo');
    }

    public function test_profile_photo_cannot_exceed_4mb()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        // Create a file larger than 4MB
        $file = UploadedFile::fake()->image('large.jpg')->size(4097);

        $response = $this
            ->actingAs($user)
            ->post('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasErrors('profile_photo');
    }
}
