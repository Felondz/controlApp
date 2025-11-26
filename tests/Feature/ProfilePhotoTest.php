<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
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
}
