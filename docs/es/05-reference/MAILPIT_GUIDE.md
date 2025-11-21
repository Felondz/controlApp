# 📧 Mailpit - Guía Completa para Desarrollo Local

## 🎯 Resumen Ejecutivo

**Mailpit** es una herramienta SMTP local que simula un servidor de correos. En ControlApp:
- ✅ Se ejecuta en Docker con `./vendor/bin/sail up`
- ✅ Interfaz web en `http://localhost:8025`
- ✅ Se usa SOLO en desarrollo local
- ✅ En GitHub Actions (CI) se reemplaza con `MAIL_MAILER=log`

---

## 🚀 Quick Start

### 1. Iniciar Mailpit (con Sail)

```bash
./vendor/bin/sail up
```

Mailpit se inicia automáticamente como servicio en Docker.

### 2. Acceder a la Interfaz

Abre en tu navegador:
```
http://localhost:8025
```

### 3. Ver Correos Enviados

- Todos los correos de desarrollo se capturan aquí
- Puedes ver el HTML, plaintext, headers
- Los correos NO se envían a direcciones reales (solo se capturan)

---

## 🔧 Configuración

### En `.env` (Desarrollo Local)

```bash
MAIL_MAILER=mailpit
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_ENCRYPTION=
MAIL_USERNAME=
MAIL_PASSWORD=
```

**Nota**: Sail configura esto automáticamente en `compose.yaml`

### En `.env.testing` (Tests Locales)

```bash
MAIL_MAILER=log
QUEUE_CONNECTION=sync
CI=
```

**Explicación**:
- `MAIL_MAILER=log`: Los correos se escriben en `storage/logs/laravel.log`
- `CI=` (vacío): Tests saben que estamos en local, NO en GitHub Actions
- Tests visuales de Mailpit (VisualEmailTestsInMailpitTest.php) ejecutan normalmente

### En `.env.testing` (GitHub Actions)

El workflow automáticamente agrega:
```bash
CI=true
MAIL_MAILER=log
QUEUE_CONNECTION=sync
```

**Explicación**:
- `CI=true`: La clase setUp() de tests visuales detecta esto y salta los tests
- Tests visuales de Mailpit se saltan automáticamente
- Tests regulares de email siguen usando Notification::fake()

---

## 📁 Estructura de Tests de Email

### Tipo 1: Tests Visuales (Solo Local)

**Archivo**: `tests/Feature/VisualEmailTestsInMailpitTest.php`

**Comportamiento**:
```php
protected function setUp(): void
{
    parent::setUp();
    
    if (env('CI')) {
        // ⏭️ En GitHub Actions: SKIP estos tests
        $this->markTestSkipped('Visual email tests solo se ejecutan localmente con Mailpit');
    }
}
```

**Ejecutar localmente**:
```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php
```

**Resultado**:
- ✅ Tests ejecutan
- 📧 Correos van a Mailpit
- 🌐 Ver en http://localhost:8025

**En GitHub Actions**:
- ⏭️ Tests se saltan automáticamente (no bloquean)
- ✅ No afectan el resultado final del workflow

### Tipo 2: Tests Funcionales (Ambos Ambientes)

**Archivos**:
- `tests/Feature/PasswordResetMailTest.php`
- `tests/Feature/InvitacionesApiTest.php`
- `tests/Feature/EmailVerificationApiTest.php`

**Comportamiento**:
- **En Local**: Notification::fake() hace mock de emails
- **En CI**: Notification::fake() hace mock de emails (sin Mailpit)

**Ambos usan**:
```php
public function test_password_reset_notification_is_sent(): void
{
    Notification::fake();
    
    // ... crear usuario y enviar notificación ...
    
    Notification::assertSentTo($user, PasswordResetNotification::class);
}
```

**Ventaja**: No necesitan Mailpit para validar que emails SE ENVÍAN

---

## 🧪 Tests Visuales - Cómo Usarlos

### Test 1: Ver Correo de Verificación

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "verificacion"
```

**Resultado**:
1. Test envía correo de verificación a Mailpit
2. Test imprime instrucciones en consola:
   ```
   📧 ENVIANDO CORREO DE VERIFICACIÓN
   Para: verificacion@example.com
   Usuario: Juan Verificación
   
   URL de Verificación:
   http://localhost/verify/...
   
   ✅ Correo enviado a Mailpit
   
   📬 Ve a http://localhost:8025 en tu navegador
   🔍 Busca un email de: no-reply@controlapp.com
   📝 Asunto: Verifica tu email
   ```
3. Abre http://localhost:8025 en navegador
4. Busca el email enviado
5. Haz clic para ver HTML y detalles

### Test 2: Ver Correo de Invitación

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "invitacion"
```

**Resultado**: Similar, ve a Mailpit para inspeccionar

### Test 3: Ver TODOS los Correos a la Vez

```bash
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --filter "todos"
```

**Resultado**: Envía 3 correos:
1. Verificación de email
2. Invitación a proyecto
3. Password reset

Ve a http://localhost:8025 para ver los 3 juntos

---

## 🔍 Inspeccionar Correos en Mailpit

### En la Interfaz Web

```
1. Abre http://localhost:8025
2. Verás una lista de todos los correos capturados
3. Haz clic en un correo para abrir detalles
4. Puedes ver:
   - HTML (rendered)
   - Plain Text
   - Source (headers y body)
   - Attachments (si hay)
5. Prueba los links del correo directamente en navegador
```

### Ver HTML Renderizado

```
1. En detalles del correo, busca la pestaña "HTML"
2. Verás cómo se ve en un cliente de email
3. Puedes hacer clic en links para probarlos
4. Util para verificar que links de verificación, reset, invitación funcionan
```

### Copiar Tokens de Tests

```
1. Abre correo en Mailpit
2. Busca la URL con token
3. Copia la URL completa
4. Pégala en navegador para probar el flujo completo
```

---

## 🚨 Troubleshooting

### Mailpit no aparece en http://localhost:8025

**Causa**: El contenedor de Mailpit no está corriendo

**Solución**:
```bash
./vendor/bin/sail up -d
# Espera 30 segundos para que se inicie
curl http://localhost:8025
```

### No veo correos en Mailpit

**Causa 1**: `.env` tiene `MAIL_MAILER` incorrecto

**Verificar**:
```bash
grep MAIL_MAILER .env
# Debería ser: MAIL_MAILER=mailpit
```

**Solución**:
```bash
# Editar .env y establecer:
MAIL_MAILER=mailpit
MAIL_HOST=mailpit
MAIL_PORT=1025

# Reiniciar Sail
./vendor/bin/sail restart
```

**Causa 2**: El correo se envió a log en lugar de Mailpit

**Verificar**:
```bash
tail -f storage/logs/laravel.log | grep -i "sending"
```

**Solución**: Asegurar que no estés en `.env.testing`:
```bash
# En .env.testing:
MAIL_MAILER=log  # ← Esto va a logs, NO a Mailpit

# Para tests visuales, usas:
./vendor/bin/sail artisan test  # Usa .env.testing
```

### Los tests visuales se saltan en local

**Verificar**: Variable `CI`

```bash
grep "^CI=" .env.testing
# Debería estar vacío o ausente: CI=
# NO debería ser: CI=true
```

**Si está CI=true**:
```bash
# Editar .env.testing:
CI=
```

---

## 📊 Comparación: Local vs CI

| Aspecto | Local (Mailpit) | CI (GitHub Actions) |
|--------|-----------------|---------------------|
| **Tool** | Mailpit | N/A (log driver) |
| **Interface** | http://localhost:8025 | N/A |
| **MAIL_MAILER** | mailpit | log |
| **Ver Correos** | Web UI | storage/logs/laravel.log |
| **Visual Tests** | ✅ Ejecuta | ⏭️ Skipped |
| **Functional Tests** | ✅ Ejecuta | ✅ Ejecuta |
| **Validar Emails** | Mailpit | Notification::fake() |

---

## 💡 Best Practices

### 1. Siempre Verificar Correos en Mailpit Durante Dev

```bash
# Terminal 1: Iniciar Sail
./vendor/bin/sail up

# Terminal 2: Ejecutar tests visuales
./vendor/bin/sail artisan test tests/Feature/VisualEmailTestsInMailpitTest.php

# Navegador: Ver correos en http://localhost:8025
```

### 2. Usar Tests Funcionales para CI

```php
// ✅ BIEN: Usa Notification::fake()
Notification::fake();
$user->notify(new MyNotification());
Notification::assertSentTo($user, MyNotification::class);

// ❌ MAL: Confía en Mailpit (no existe en CI)
// Solo envía correo esperando ver en Mailpit
```

### 3. Respetar el Variable CI

```php
// Siempre chequea CI si tienes tests que necesitan Mailpit
if (env('CI')) {
    $this->markTestSkipped('Solo en desarrollo local');
}
```

### 4. Documentar Tests Visuales

```php
/**
 * 📧 TEST VISUAL: Ver correo en Mailpit
 * 
 * SOLO ejecuta localmente. En CI se salta automáticamente.
 * 
 * Instrucciones:
 * 1. ./vendor/bin/sail artisan test --filter "este_test"
 * 2. Abre http://localhost:8025
 * 3. Inspecciona el correo
 */
```

---

## 🔗 Referencias

- **Mailpit Documentation**: https://mailpit.axllent.org/
- **Docker Compose**: Ver `compose.yaml` en raíz del proyecto
- **Tests Visuales**: `tests/Feature/VisualEmailTestsInMailpitTest.php`
- **Tests Funcionales**: `tests/Feature/PasswordResetMailTest.php`
- **CI Configuration**: `.github/workflows/tests.yml`

---

## ✅ Checklist para Desarrolladores

Antes de hacer commit:

- [ ] Tests visuales funcionan en local (Mailpit visible)
- [ ] Tests funcionales pasan en CI (sin Mailpit)
- [ ] Verificaste que `CI=` en `.env.testing` (vacío)
- [ ] Verificaste que `CI=true` se agrega en workflow
- [ ] Si agregaste nuevo test de email:
  - [ ] ¿Es visual (necesita Mailpit)? → Agregar `if (env('CI')) { $this->markTestSkipped(...) }`
  - [ ] ¿Es funcional (Notification::fake())? → No necesita skip
- [ ] Documentaste el test con comentario claro

---

**Última actualización**: 16 de noviembre de 2025
**Status**: ✅ Mailpit + Log Driver + CI Skip configurado correctamente
