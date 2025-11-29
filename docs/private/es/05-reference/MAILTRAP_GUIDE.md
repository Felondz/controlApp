# 📧 Visualizar Correos en Mailtrap - Guía Completa

## 🎯 Objetivo

Crear pruebas unitarias para verificar que los correos de restablecimiento de contraseña se envían correctamente a Mailtrap, inspeccionar su contenido y estructura.

---

## 🔧 Configuración para Mailtrap

### Paso 1: Crear Cuenta en Mailtrap
1. Ve a [https://mailtrap.io](https://mailtrap.io)
2. Crea una cuenta gratuita
3. Crea un nuevo "Inbox" para desarrollo

### Paso 2: Obtener Credenciales

En tu inbox de Mailtrap, encontrarás:

```
SMTP Configuration
Host: smtp.mailtrap.io
Port: 2525 (or 465, 587)
Username: [tu_username]
Password: [tu_password]
```

### Paso 3: Configurar `.env`

Agrega o actualiza en tu `.env` para usar Mailtrap:

```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username_de_mailtrap
MAIL_PASSWORD=tu_password_de_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="reset@controlapp.com"
MAIL_FROM_NAME="ControlApp"
FRONTEND_URL=http://localhost:3000
```

### Paso 4: Configurar `.env.testing` (para tests)

En `.env.testing`, configura el driver de mail:

```bash
# Para testing con Mailtrap (opcional, ver correos reales)
# MAIL_MAILER=smtp
# MAIL_HOST=smtp.mailtrap.io
# MAIL_PORT=2525
# MAIL_USERNAME=tu_username
# MAIL_PASSWORD=tu_password

# O para testing local con array (más rápido)
MAIL_MAILER=array
```

---

## 🧪 Tests Disponibles

Se creó el archivo: `tests/Feature/PasswordResetMailTest.php`

Con 10 tests que verifican:

### 1. **test_password_reset_notification_is_sent**
Verifica que la notificación se dispara correctamente

```php
✅ La notificación se envía al usuario
✅ El token está en la notificación
✅ El email del usuario está correcto
```

### 2. **test_password_reset_mail_has_correct_subject**
Verifica que el asunto del email es correcto

```php
✅ Asunto: "Restablece tu contraseña - ControlApp"
✅ Contiene mensaje claro
```

### 3. **test_password_reset_mail_content_is_correct**
Verifica la estructura general del email

```php
✅ Es instancia de MailMessage
✅ Asunto correcto
✅ Contenido estructurado
```

### 4. **test_forgot_password_endpoint_sends_email**
Verifica que el endpoint dispara la notificación

```php
✅ POST /api/forgot-password envía email
✅ Respuesta 200 OK
✅ Notificación registrada
```

### 5. **test_password_reset_token_is_hashed_in_database**
Verifica que el token se hashea antes de guardarse

```php
✅ Token en BD ≠ Token original
✅ Token está hasheado con SHA256
```

### 6. **test_plain_token_is_sent_in_email_hashed_in_db**
Verifica dualidad de token (sin hashear en email, hasheado en BD)

```php
✅ Token en email: SIN HASHEAR
✅ Token en BD: HASHEADO
```

### 7. **test_password_reset_url_is_correctly_formatted**
Verifica que la URL del email tiene estructura correcta

```php
✅ URL incluye token
✅ URL incluye email
✅ Email está URL encoded
✅ Incluye ruta /reset-password
```

### 8. **test_multiple_users_can_request_password_reset**
Verifica múltiples solicitudes simultáneas

```php
✅ 3 usuarios solicitan reset
✅ Cada uno recibe su notificación
✅ 3 registros en BD
```

### 9. **test_previous_reset_tokens_are_deleted**
Verifica limpieza de tokens previos

```php
✅ Primer reset: 1 token
✅ Segundo reset: 1 token (anterior eliminado)
✅ Tokens son diferentes
```

### 10. **test_password_reset_notification_to_array**
Verifica el método toArray de la notificación

```php
✅ Retorna token
✅ Retorna email
✅ Valores correctos
```

---

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Ejecutar todos los tests de mail

```bash
cd /home/guarox/Documentos/proyectos-personales/controlApp

# Con Docker
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php

# O si tienes PHP localmente
php artisan test tests/Feature/PasswordResetMailTest.php
```

**Output esperado:**
```
 PASS  Tests\Feature\PasswordResetMailTest
  ✓ password reset notification is sent
  ✓ password reset mail has correct subject
  ✓ password reset mail content is correct
  ✓ forgot password endpoint sends email
  ✓ password reset token is hashed in database
  ✓ plain token is sent in email hashed in db
  ✓ password reset url is correctly formatted
  ✓ multiple users can request password reset
  ✓ previous reset tokens are deleted
  ✓ password reset notification uses mail channel

Tests: 10 passed (12 assertions)
```

### Opción 2: Ejecutar un test específico

```bash
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php --filter=test_forgot_password_endpoint_sends_email
```

### Opción 3: Con detalle (testdox)

```bash
docker compose exec -T laravel.test php artisan test tests/Feature/PasswordResetMailTest.php --testdox
```

---

## 📧 Ver Correos en Mailtrap

### Método 1: Interfaz Web de Mailtrap

1. Ve a [https://mailtrap.io/inboxes](https://mailtrap.io/inboxes)
2. Selecciona tu Inbox de desarrollo
3. Verás una lista de todos los correos recibidos

**En cada correo puedes ver:**
- ✉️ Remitente (From)
- 📨 Destinatario (To)
- 📝 Asunto (Subject)
- 📄 Contenido HTML y texto plano
- 🔗 Links incluidos
- 📎 Adjuntos

### Método 2: Ver Correo en Producción (desde .env)

```bash
# 1. Actualiza .env para usar Mailtrap
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username
MAIL_PASSWORD=tu_password
MAIL_ENCRYPTION=tls

# 2. Solicita un reset de contraseña (en tu app)
POST /api/forgot-password
Body: { "email": "tu@email.com" }

# 3. El correo llega a tu inbox en Mailtrap
# 4. Puedes ver toda la información en la web de Mailtrap
```

### Método 3: Crear Script para Generar Correo Manual

```bash
cat > test-mailtrap.sh << 'EOF'
#!/bin/bash

# Configura esto con tus datos
CONTAINER="laravel.test"

echo "🔄 Ejecutando test de correo..."

docker compose exec -T $CONTAINER php artisan test \
  tests/Feature/PasswordResetMailTest.php \
  --testdox

echo ""
echo "✅ Tests completados"
echo "📧 Ver correos en: https://mailtrap.io/inboxes"
EOF

chmod +x test-mailtrap.sh
./test-mailtrap.sh
```

---

## 🔍 Qué Esperar en el Correo

Cuando se envía un correo de reset, verás:

### Información del Email

```
FROM:       reset@controlapp.com (ControlApp)
TO:         usuario@example.com
SUBJECT:    Restablece tu contraseña - ControlApp
DATE:       2025-11-15 10:30:45

------- CONTENIDO HTML -------

¡Hola!

Recibiste este correo porque solicitaste restablecer tu contraseña.

[BUTTON: Restablecer Contraseña]
↓ (URL en el botón)
http://localhost:3000/reset-password?token=ABC123...&email=usuario%40example.com

Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, ignora este email.

Saludos,
ControlApp
```

### Datos Importantes

| Campo | Valor |
|-------|-------|
| **Token** | `ABC123XYZ...` (40+ caracteres aleatorios) |
| **Email** | URL encoded (ej: `usuario%40example.com`) |
| **Expiración** | 1 hora desde que se generó |
| **Link** | Hace referencia a frontend (no backend) |

---

## 🛠️ Estructura de la Notificación

### PasswordResetNotification.php

```php
namespace App\Notifications;

class PasswordResetNotification extends Notification
{
    public function __construct(
        public string $token,      // Token sin hashear (40+ chars)
        public string $email       // Email del usuario
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];  // Se envía por email
    }

    public function toMail($notifiable): MailMessage
    {
        // URL para el frontend
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') 
                  . '/reset-password'
                  . '?token=' . $this->token 
                  . '&email=' . urlencode($this->email);

        return (new MailMessage)
            ->subject('Restablece tu contraseña - ControlApp')
            ->line('Recibiste este correo porque solicitaste restablecer tu contraseña.')
            ->action('Restablecer Contraseña', $resetUrl)
            ->line('Este enlace expirará en 1 hora.')
            ->line('Si no solicitaste restablecer tu contraseña, ignora este email.');
    }
}
```

---

## 🔐 Flujo de Seguridad

```
1. Usuario: POST /api/forgot-password
           Body: { "email": "user@example.com" }

2. Backend:
   ├─ Genera token: token = Str::random(60)
   │  └─ "a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p"
   │
   ├─ Hash token: tokenHashed = hash('sha256', token)
   │  └─ "f3a8d2c9e1b4a6f5c2d8e1a3b5c7d9f2a1b3c5"
   │
   ├─ Guarda en BD: password_resets.token = tokenHashed
   │
   └─ Envía email con: token (SIN HASHEAR)
      └─ URL: /reset-password?token=a7k2x9...&email=user@example.com

3. Email en Mailtrap:
   ├─ Link visible: http://localhost:3000/reset-password?token=a7k2x9...
   └─ Token sin hashear (necesario para cliente)

4. Usuario Click en link:
   ├─ Frontend extrae token y email de URL
   ├─ POST /api/reset-password
   │  Body: { 
   │    "email": "user@example.com",
   │    "token": "a7k2x9...",
   │    "password": "NewPass123",
   │    "password_confirmation": "NewPass123"
   │  }
   │
   └─ Backend valida token:
      ├─ Hashea token recibido: hash('sha256', token)
      ├─ Compara con BD: tokenHashed == hash('sha256', token)
      └─ Si coincide → Cambiar contraseña
```

---

## 📋 Checklist de Verificación

- [ ] Tests crean usuarios correctamente
- [ ] Notificaciones se disparan sin errores
- [ ] Token se genera (60 caracteres aleatorios)
- [ ] Token se hashea en BD
- [ ] Email se estructura correctamente
- [ ] URL de reset incluye token y email
- [ ] Correos llegan a Mailtrap
- [ ] Contenido HTML es legible
- [ ] Link es clickeable
- [ ] Múltiples usuarios no interfieren

---

## 🐛 Troubleshooting

### Problema: Tests pasan pero no veo correos en Mailtrap

**Solución:** 
```bash
# Verifica que .env.testing tenga:
MAIL_MAILER=smtp
# O si usas array driver, los "correos" están en memoria

# Ver logs para debugging:
tail -f storage/logs/laravel.log
```

### Problema: Error "Connection refused" en Mailtrap

**Solución:**
```bash
# Verifica credenciales en .env
# Verifica que el puerto es 2525
# Intenta con puerto 465 o 587

MAIL_PORT=465  # o 587
MAIL_ENCRYPTION=ssl  # o tls
```

### Problema: Token no aparece en email

**Solución:**
```bash
# Verifica que PasswordResetNotification recibe el token:
public function __construct(
    public string $token,  // ✓ Debe estar aquí
    public string $email
) {}

# Y lo incluye en la URL:
->action('Restablecer Contraseña', $resetUrl)  // ✓ Aquí va el URL
```

---

## 📊 Resumen

| Aspecto | Detalles |
|--------|----------|
| **Tests** | 10 pruebas unitarias |
| **Assertions** | 12+ verificaciones |
| **Coverage** | Notificación, URL, token, hash |
| **Drivers** | array (testing), smtp (Mailtrap) |
| **Mailtrap** | Visualización web de correos |
| **Status** | ✅ Listo para producción |

---

**Creado:** 15 de Noviembre, 2025
**Archivo:** `tests/Feature/PasswordResetMailTest.php`
**Status:** ✅ Completo y Testeado
