#!/usr/bin/env bash

# ================================================
#  ControlApp - Test Email Sending to Mailtrap
# ================================================
#
# Este script demuestra cómo:
# 1. Ejecutar los tests de mail
# 2. Ver los correos en Mailtrap
# 3. Verificar la estructura de los emails

set -e

CONTAINER="laravel.test"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║          📧 MAILTRAP EMAIL TESTING - PASSWORD RESET 📧            ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que Docker está corriendo
echo "🐳 Verificando Docker..."
if ! docker compose ps | grep -q "$CONTAINER"; then
    echo "❌ Error: Contenedor $CONTAINER no está corriendo"
    echo ""
    echo "Ejecuta primero:"
    echo "  docker compose up -d"
    exit 1
fi
echo "✅ Docker está corriendo"
echo ""

# Tests de mail
echo "🧪 Ejecutando tests de Password Reset Mail..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

docker compose exec -T $CONTAINER php artisan test tests/Feature/PasswordResetMailTest.php --testdox

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Información de los tests
echo "📊 TEST SUMMARY"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "✅ Tests en PasswordResetMailTest:"
echo "   • test_password_reset_notification_is_sent"
echo "   • test_password_reset_mail_has_correct_subject"
echo "   • test_password_reset_mail_content_is_correct"
echo "   • test_forgot_password_endpoint_sends_email"
echo "   • test_password_reset_token_is_hashed_in_database"
echo "   • test_plain_token_is_sent_in_email_hashed_in_db"
echo "   • test_password_reset_url_is_correctly_formatted"
echo "   • test_multiple_users_can_request_password_reset"
echo "   • test_previous_reset_tokens_are_deleted"
echo "   • test_password_reset_notification_to_array"
echo "   • test_password_reset_notification_uses_mail_channel"
echo ""

# Instrucciones para ver en Mailtrap
echo "📧 PARA VER LOS CORREOS EN MAILTRAP:"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1. Abre https://mailtrap.io en tu navegador"
echo "2. Inicia sesión con tu cuenta"
echo "3. Selecciona tu Inbox de desarrollo"
echo "4. Verás una lista de correos recibidos"
echo ""
echo "En cada correo puedes ver:"
echo "   ✉️  Remitente (From)"
echo "   📨 Destinatario (To)"
echo "   📝 Asunto (Subject)"
echo "   📄 Contenido HTML"
echo "   🔗 Links (incluyendo token de reset)"
echo ""

# Configuración de Mailtrap
echo "⚙️  CONFIGURACIÓN MAILTRAP EN .env:"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "Agrega esto a tu .env para usar Mailtrap en desarrollo:"
echo ""
echo "MAIL_MAILER=smtp"
echo "MAIL_HOST=smtp.mailtrap.io"
echo "MAIL_PORT=2525"
echo "MAIL_USERNAME=tu_username"
echo "MAIL_PASSWORD=tu_password"
echo "MAIL_ENCRYPTION=tls"
echo "MAIL_FROM_ADDRESS=noreply@controlapp.com"
echo "MAIL_FROM_NAME=ControlApp"
echo ""

# Verificar configuración actual
echo "🔍 VERIFICANDO CONFIGURACIÓN ACTUAL:"
echo "─────────────────────────────────────────────────────────────────"
echo ""

if [ -f .env ]; then
    MAIL_DRIVER=$(grep "MAIL_MAILER=" .env | head -1 | cut -d= -f2 || echo "no configurado")
    echo "  MAIL_MAILER: $MAIL_DRIVER"
    
    if [ -f .env.testing ]; then
        TEST_MAIL_DRIVER=$(grep "MAIL_MAILER=" .env.testing | head -1 | cut -d= -f2 || echo "array (default)")
        echo "  MAIL_MAILER (testing): $TEST_MAIL_DRIVER"
    fi
fi
echo ""

# Flujo de prueba
echo "🔄 FLUJO DE PRUEBA COMPLETO:"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "1. Usuario solicita reset:"
echo "   POST /api/forgot-password"
echo "   Body: { \"email\": \"usuario@example.com\" }"
echo ""
echo "2. Backend:"
echo "   ✓ Genera token seguro (60 caracteres)"
echo "   ✓ Hashea token con SHA256"
echo "   ✓ Guarda en BD"
echo "   ✓ Envía notificación por email"
echo ""
echo "3. Email contiene:"
echo "   ✓ Asunto: 'Restablece tu contraseña - ControlApp'"
echo "   ✓ URL con token (sin hashear)"
echo "   ✓ URL con email codificado"
echo "   ✓ Mensaje de expiración (1 hora)"
echo ""
echo "4. En Mailtrap ves:"
echo "   ✓ El correo recibido"
echo "   ✓ El contenido HTML formateado"
echo "   ✓ El link clickeable con token"
echo "   ✓ Todos los detalles del email"
echo ""

# Links útiles
echo "🔗 LINKS ÚTILES:"
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "  📖 Documentación: docs/MAILTRAP_GUIDE.md"
echo "  🧪 Tests: tests/Feature/PasswordResetMailTest.php"
echo "  📧 Mailtrap: https://mailtrap.io"
echo "  📝 Notificación: app/Notifications/PasswordResetNotification.php"
echo ""

# Status final
echo "✅ TESTING COMPLETO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Todos los tests de mail pasaron correctamente."
echo "Para ver los correos reales, ve a: https://mailtrap.io"
echo ""
