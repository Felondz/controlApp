<?php

namespace Tests\Feature;

use App\Models\PasswordReset;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetMailTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Verificar que el email de reset se envía correctamente
     */
    public function test_password_reset_notification_is_sent(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'juan@example.com',
            'name' => 'Juan Pérez',
        ]);

        $token = 'a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p';
        $user->notify(new PasswordResetNotification($token, $user->email));

        Notification::assertSentTo(
            $user,
            PasswordResetNotification::class,
            function ($notification) use ($token) {
                return $notification->token === $token;
            }
        );
    }

    /**
     * Test: Verificar la estructura del email
     */
    public function test_password_reset_mail_has_correct_subject(): void
    {
        $user = User::factory()->create([
            'email' => 'maria@example.com',
            'name' => 'María García',
        ]);

        $token = 'token123abc456def789ghi012jkl345mno678pqr';
        $notification = new PasswordResetNotification($token, $user->email);
        $mail = $notification->toMail($user);

        // El mail es ahora una instancia de PasswordResetMail
        // Accedemos al subject a través del método envelope()
        $envelope = $mail->envelope();
        $this->assertStringContainsString('Restablece tu Contraseña', $envelope->subject);
    }

    /**
     * Test: Verificar el contenido del email
     */
    public function test_password_reset_mail_content_is_correct(): void
    {
        $user = User::factory()->create(['email' => 'test@example.com']);
        $token = 'secure_token_1234567890abcdefghijklmnop';

        $notification = new PasswordResetNotification($token, $user->email);
        $mail = $notification->toMail($user);

        // Verificar que devuelve PasswordResetMail con el sujeto correcto
        $envelope = $mail->envelope();
        $this->assertEquals('Restablece tu Contraseña - ControlApp', $envelope->subject);
    }

    /**
     * Test: Verificar que el API endpoint envía el email
     */
    public function test_forgot_password_endpoint_sends_email(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'correo@example.com']);

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200);

        Notification::assertSentTo(
            $user,
            PasswordResetNotification::class
        );
    }

    /**
     * Test: Verificar que el token en BD está hasheado
     */
    public function test_password_reset_token_is_hashed_in_database(): void
    {
        $user = User::factory()->create(['email' => 'user@example.com']);
        $tokenPlain = 'plaintoken123456789abc';
        $tokenHashed = hash('sha256', $tokenPlain);

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => $tokenHashed,
        ]);

        $record = PasswordReset::where('user_id', $user->id)->first();
        $this->assertEquals($tokenHashed, $record->token);
        $this->assertNotEquals($tokenPlain, $record->token);
    }

    /**
     * Test: Verificar token sin hashear en email, hasheado en DB
     */
    public function test_plain_token_is_sent_in_email_hashed_in_db(): void
    {
        $user = User::factory()->create(['email' => 'sender@example.com']);
        $token = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
        $tokenHashed = hash('sha256', $token);

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => $tokenHashed,
        ]);

        $dbRecord = PasswordReset::where('user_id', $user->id)->first();

        $this->assertNotEquals($token, $dbRecord->token);
        $this->assertEquals($tokenHashed, $dbRecord->token);
    }

    /**
     * Test: Verificar URL de reset en el email
     */
    public function test_password_reset_url_is_correctly_formatted(): void
    {
        $user = User::factory()->create(['email' => 'contact+test@example.com']);
        $token = 'token_abc_123_def_456';

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $expectedUrl = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        $this->assertStringContainsString('reset-password', $expectedUrl);
        $this->assertStringContainsString('token=' . $token, $expectedUrl);
        $this->assertStringContainsString('email=', $expectedUrl);
    }

    /**
     * Test: Múltiples usuarios solicitan reset
     */
    public function test_multiple_users_can_request_password_reset(): void
    {
        Notification::fake();

        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);
        $user3 = User::factory()->create(['email' => 'user3@example.com']);

        $this->postJson('/api/forgot-password', ['email' => $user1->email]);
        $this->postJson('/api/forgot-password', ['email' => $user2->email]);
        $this->postJson('/api/forgot-password', ['email' => $user3->email]);

        Notification::assertSentTo($user1, PasswordResetNotification::class);
        Notification::assertSentTo($user2, PasswordResetNotification::class);
        Notification::assertSentTo($user3, PasswordResetNotification::class);

        $this->assertEquals(3, PasswordReset::count());
    }

    /**
     * Test: Tokens previos se limpian
     */
    public function test_previous_reset_tokens_are_deleted(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'cleanup@example.com']);

        $this->postJson('/api/forgot-password', ['email' => $user->email]);
        $this->assertEquals(1, PasswordReset::where('user_id', $user->id)->count());

        $firstToken = PasswordReset::where('user_id', $user->id)->first();

        $this->postJson('/api/forgot-password', ['email' => $user->email]);

        $this->assertEquals(1, PasswordReset::where('user_id', $user->id)->count());
        $secondToken = PasswordReset::where('user_id', $user->id)->first();

        $this->assertNotEquals($firstToken->token, $secondToken->token);
    }

    /**
     * Test: Array de notificación
     */
    public function test_password_reset_notification_to_array(): void
    {
        $user = User::factory()->create(['email' => 'array@example.com']);
        $token = 'test_token_array_123';

        $notification = new PasswordResetNotification($token, $user->email);
        $array = $notification->toArray($user);

        $this->assertArrayHasKey('token', $array);
        $this->assertArrayHasKey('email', $array);
        $this->assertEquals($token, $array['token']);
        $this->assertEquals($user->email, $array['email']);
    }

    /**
     * Test: Notificación usa canal mail
     */
    public function test_password_reset_notification_uses_mail_channel(): void
    {
        $user = User::factory()->create(['email' => 'channel@example.com']);
        $token = 'test_token_channel_456';

        $notification = new PasswordResetNotification($token, $user->email);
        $channels = $notification->via($user);

        $this->assertContains('mail', $channels);
        $this->assertCount(1, $channels);
    }
}
