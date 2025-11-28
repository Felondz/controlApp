<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/profile', [
                'name' => 'Test User Updated',
                'email' => 'test@example.com',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Perfil actualizado correctamente',
                'user' => [
                    'name' => 'Test User Updated',
                    'email' => 'test@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Test User Updated',
            'email' => 'test@example.com',
        ]);
    }
    public function test_email_verification_status_is_unchanged_when_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/profile', [
                'name' => 'Test User Updated',
                'email' => $user->email,
            ]);

        $response->assertStatus(200);

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_password_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/password', [
                'current_password' => 'password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contraseña actualizada correctamente']);

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }
    public function test_profile_photo_can_be_uploaded(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/profile/photo', [
                'profile_photo' => $file,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'profile_photo_url']);

        $this->assertNotNull($user->refresh()->profile_photo_path);
        Storage::disk('public')->assertExists($user->profile_photo_path);
    }

    public function test_profile_photo_can_be_deleted(): void
    {
        Storage::fake('public');
        $user = User::factory()->create([
            'profile_photo_path' => 'profile-photos/test.jpg',
        ]);
        Storage::disk('public')->put('profile-photos/test.jpg', 'content');

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/profile/photo');

        $response->assertStatus(200);

        $this->assertNull($user->refresh()->profile_photo_path);
        Storage::disk('public')->assertMissing('profile-photos/test.jpg');
    }
    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/profile', [
                'password' => 'password',
            ]);

        $response->assertStatus(200);

        $this->assertModelMissing($user);
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/profile', [
                'password' => 'wrong-password',
            ]);

        $response->assertStatus(422);
        $this->assertModelExists($user);
    }
}
