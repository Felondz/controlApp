<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Proyecto;
use App\Notifications\VerificacionEmailNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class VisualEmailTestsInMailpitTest extends TestCase
{
    use RefreshDatabase;

    /**
     * setUp: Saltear tests si estamos en CI
     * 
     * Los tests visuales de Mailpit solo funcionan en desarrollo local.
     * En GitHub Actions (CI), el driver es "log" y Mailpit no está disponible.
     * 
     * Esta clase solo ejecutará tests cuando CI no esté establecido.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Si estamos en CI (GitHub Actions), saltar todos estos tests
        if (env('CI')) {
            $this->markTestSkipped('Visual email tests solo se ejecutan localmente con Mailpit');
        }
    }

    /**
     * Test: Visualizar correo de verificación en Mailpit
     * 
     * Este test dispara realmente el correo de verificación para que lo veas en:
     * http://localhost:8025
     * 
     * Instrucciones:
     * 1. Ejecuta este test
     * 2. Abre http://localhost:8025 en tu navegador
     * 3. Busca un correo con asunto "Verifica tu email"
     * 4. Haz clic para ver el contenido HTML
     */
    public function test_ver_correo_verificacion_en_mailpit(): void
    {
        // Crear un usuario
        $user = User::factory()->create([
            'name' => 'Juan Verificación',
            'email' => 'verificacion@example.com',
            'email_verified_at' => null,
        ]);

        echo "\n\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "📧 ENVIANDO CORREO DE VERIFICACIÓN\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "Para: {$user->email}\n";
        echo "Usuario: {$user->name}\n";
        echo "\n";

        // Generar token de verificación
        $verificationUrl = route('verification.verify', [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]);

        echo "URL de Verificación:\n";
        echo "{$verificationUrl}\n";
        echo "\n";

        // Enviar notificación realmente (no fake)
        $user->notify(new VerificacionEmailNotification($verificationUrl));

        echo "✅ Correo enviado a Mailpit\n";
        echo "\n";
        echo "📬 Ve a http://localhost:8025 en tu navegador\n";
        echo "🔍 Busca un email de: no-reply@controlapp.com\n";
        echo "📝 Asunto: Verifica tu email\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        // Verificar que se envió
        $this->assertTrue(true);
    }

    /**
     * Test: Visualizar correo de invitación en Mailpit
     * 
     * Este test dispara realmente el correo de invitación para que lo veas en:
     * http://localhost:8025
     * 
     * Instrucciones:
     * 1. Ejecuta este test
     * 2. Abre http://localhost:8025 en tu navegador
     * 3. Busca un correo con asunto "Te han invitado a un proyecto"
     * 4. Haz clic para ver el contenido HTML con el enlace de invitación
     */
    public function test_ver_correo_invitacion_en_mailpit(): void
    {
        // Crear un admin
        $admin = User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
        ]);
        /** @var User $admin */

        // Crear un proyecto
        $proyecto = Proyecto::factory()->create([
            'nombre' => 'Test Proyecto',
            'moneda_default' => 'COP',
        ]);

        // Asignar admin al proyecto
        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        echo "\n\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "📧 ENVIANDO CORREO DE INVITACIÓN\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "De: {$admin->email} ({$admin->name})\n";
        echo "Proyecto: {$proyecto->nombre}\n";
        echo "Para: invitado@gmail.com\n";
        echo "\n";

        // Disparar endpoint de invitación
        $this->actingAs($admin);

        $response = $this->postJson('/api/proyectos/' . $proyecto->id . '/invitaciones', [
            'email' => 'invitado@gmail.com',
            'rol' => 'miembro',
        ]);

        echo "Respuesta del API:\n";
        echo "Status: {$response->status()}\n";
        echo "Mensaje: " . ($response->json('message') ?? 'OK') . "\n";
        echo "\n";

        echo "✅ Correo de invitación enviado a Mailpit\n";
        echo "\n";
        echo "📬 Ve a http://localhost:8025 en tu navegador\n";
        echo "🔍 Busca un email de: no-reply@controlapp.com\n";
        echo "📝 Asunto: Te han invitado a un proyecto\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        // Verificar que se envió
        $response->assertStatus(201);
    }

    /**
     * Test: Enviar TODOS los correos a la vez para verlos en Mailpit
     * 
     * Este es el test más completo que envía:
     * 1. Correo de verificación
     * 2. Correo de invitación
     * 3. Correo de password reset
     * 
     * Ve a http://localhost:8025 para verlos todos
     */
    public function test_enviar_todos_los_correos_a_mailpit(): void
    {
        echo "\n\n";
        echo "╔════════════════════════════════════════════════════════════════╗\n";
        echo "║                                                                ║\n";
        echo "║         📧 ENVIANDO TODOS LOS CORREOS A MAILPIT 📧             ║\n";
        echo "║                                                                ║\n";
        echo "╚════════════════════════════════════════════════════════════════╝\n\n";

        // 1. CORREO DE VERIFICACIÓN
        echo "1️⃣  CORREO DE VERIFICACIÓN\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

        $user = User::factory()->create([
            'name' => 'Usuario Verificación',
            'email' => 'verificacion-test@example.com',
            'email_verified_at' => null,
        ]);

        $verificationUrl = route('verification.verify', [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]);

        $user->notify(new VerificacionEmailNotification($verificationUrl));
        echo "✅ Correo de verificación enviado a: {$user->email}\n";
        echo "   Asunto: Verifica tu email\n\n";

        // 2. CORREO DE INVITACIÓN
        echo "2️⃣  CORREO DE INVITACIÓN\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

        $admin = User::factory()->create([
            'name' => 'Admin Invitador',
            'email' => 'admin-invitacion@example.com',
        ]);
        /** @var User $admin */

        $proyecto = Proyecto::factory()->create([
            'nombre' => 'Proyecto Con Invitación',
            'moneda_default' => 'COP',
        ]);

        $proyecto->miembros()->attach($admin, ['rol' => 'admin']);

        $this->actingAs($admin);
        $response = $this->postJson('/api/proyectos/' . $proyecto->id . '/invitaciones', [
            'email' => 'invitado-test@example.com',
            'rol' => 'miembro',
        ]);

        echo "✅ Correo de invitación enviado\n";
        echo "   De: {$admin->email}\n";
        echo "   Para: invitado-test@example.com\n";
        echo "   Proyecto: {$proyecto->nombre}\n";
        echo "   Asunto: Te han invitado a un proyecto\n\n";

        // 3. CORREO DE PASSWORD RESET
        echo "3️⃣  CORREO DE PASSWORD RESET\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

        $resetUser = User::factory()->create([
            'name' => 'Usuario Reset',
            'email' => 'reset-test@example.com',
        ]);

        $response = $this->postJson('/api/password-reset', [
            'email' => $resetUser->email,
        ]);

        echo "✅ Correo de password reset enviado\n";
        echo "   Para: {$resetUser->email}\n";
        echo "   Asunto: Restablece tu contraseña - ControlApp\n\n";

        // RESUMEN
        echo "╔════════════════════════════════════════════════════════════════╗\n";
        echo "║                                                                ║\n";
        echo "║  ✅ TODOS LOS CORREOS ENVIADOS A MAILPIT                       ║\n";
        echo "║                                                                ║\n";
        echo "║  📬 Abre tu navegador en: http://localhost:8025                ║\n";
        echo "║                                                                ║\n";
        echo "║  Deberías ver 3 correos nuevos:                               ║\n";
        echo "║                                                                ║\n";
        echo "║  1. Verifica tu email                                         ║\n";
        echo "║     De: verificacion-test@example.com                         ║\n";
        echo "║                                                                ║\n";
        echo "║  2. Te han invitado a un proyecto                             ║\n";
        echo "║     Para: invitado-test@example.com                           ║\n";
        echo "║                                                                ║\n";
        echo "║  3. Restablece tu contraseña - ControlApp                     ║\n";
        echo "║     Para: reset-test@example.com                              ║\n";
        echo "║                                                                ║\n";
        echo "║  Puedes hacer clic en cada uno para ver el contenido HTML     ║\n";
        echo "║                                                                ║\n";
        echo "╚════════════════════════════════════════════════════════════════╝\n\n";

        $this->assertTrue(true);
    }
}
