<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfilePhotoTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_table_has_profile_photo_path_column()
    {
        $this->assertTrue(Schema::hasColumn('users', 'profile_photo_path'));
    }

    public function test_user_can_have_profile_photo_path()
    {
        $user = User::factory()->create([
            'profile_photo_path' => 'photos/test.jpg',
        ]);

        $this->assertEquals('photos/test.jpg', $user->profile_photo_path);
    }

    public function test_user_can_upload_profile_photo()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('profile.jpg', 200, 200);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasNoErrors();
        
        $user->refresh();
        
        // Assert file was stored
        $this->assertNotNull($user->profile_photo_path);
        Storage::disk('public')->assertExists($user->profile_photo_path);
    }

    public function test_old_profile_photo_is_deleted_when_uploading_new_one()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        
        // Upload first photo
        $firstFile = UploadedFile::fake()->image('first.jpg', 200, 200);
        $this->actingAs($user)->patch('/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'profile_photo' => $firstFile,
        ]);
        
        $user->refresh();
        $firstPhotoPath = $user->profile_photo_path;
        Storage::disk('public')->assertExists($firstPhotoPath);
        
        // Upload second photo
        $secondFile = UploadedFile::fake()->image('second.jpg', 200, 200);
        $this->actingAs($user)->patch('/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'profile_photo' => $secondFile,
        ]);
        
        $user->refresh();
        
        // Old photo should be deleted
        Storage::disk('public')->assertMissing($firstPhotoPath);
        // New photo should exist
        Storage::disk('public')->assertExists($user->profile_photo_path);
        $this->assertNotEquals($firstPhotoPath, $user->profile_photo_path);
    }

    public function test_user_can_delete_profile_photo()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        
        // Upload photo first
        $file = UploadedFile::fake()->image('profile.jpg', 200, 200);
        $this->actingAs($user)->patch('/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'profile_photo' => $file,
        ]);
        
        $user->refresh();
        $photoPath = $user->profile_photo_path;
        $this->assertNotNull($photoPath);
        
        // Delete photo
        $response = $this
            ->actingAs($user)
            ->delete('/profile/photo');
        
        $response->assertRedirect('/profile');
        
        $user->refresh();
        
        // Photo should be deleted from storage and database
        $this->assertNull($user->profile_photo_path);
        Storage::disk('public')->assertMissing($photoPath);
    }

    public function test_profile_photo_must_be_image()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasErrors('profile_photo');
    }

    public function test_profile_photo_cannot_exceed_3mb()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        // Create a file larger than 3MB
        $file = UploadedFile::fake()->image('large.jpg')->size(3073);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasErrors('profile_photo');
    }

    public function test_profile_photo_must_meet_dimension_requirements()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();
        // Create image smaller than minimum dimensions
        $file = UploadedFile::fake()->image('small.jpg', 50, 50);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo' => $file,
            ]);

        $response->assertSessionHasErrors('profile_photo');
    }
}
