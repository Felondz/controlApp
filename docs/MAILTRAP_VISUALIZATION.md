# 🎨 Visualización del Email en Mailtrap

## 📧 Vista Previa del Email de Reset de Contraseña

Cuando un usuario solicita restablecer su contraseña y el correo llega a Mailtrap, verás algo así:

---

## 🌐 Panel de Mailtrap - Inbox

```
┌──────────────────────────────────────────────────────────────────────────┐
│ MAILTRAP INBOX                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📬 Inbox                    ✉️ 12 emails                  🔍 Search    │
│  📋 All Inboxes                                                         │
│  ⚙️  Settings                                                           │
│  📊 Dashboard                                                           │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FROM: reset@controlapp.com (ControlApp)     TIME: 2 minutes ago        │
│  TO: juan@example.com                         [MARK] [DELETE]          │
│  SUBJECT: ✉️ Restablece tu contraseña - ControlApp                     │
│  STATUS: ✅ Delivered                                                  │
│  │                                                                       │
│  ├─ DATE: Nov 15, 2025, 10:30:45 PM UTC                               │
│  ├─ MESSAGE-ID: <abc123@mailtrap.io>                                  │
│  ├─ HEADERS: [Show]                                                    │
│  └─ CONTENT-TYPE: multipart/alternative                               │
│                                                                          │
│  ┌─ PREVIEW ────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ¡Hola!                                                         │  │
│  │                                                                  │  │
│  │  Recibiste este correo porque solicitaste restablecer tu...    │  │
│  │                                                                  │  │
│  │  [RESTABLECER CONTRASEÑA]                                      │  │
│  │                                                                  │  │
│  │  Este enlace expirará en 1 hora.                               │  │
│  │  Si no solicitaste...                                           │  │
│  │                                                                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Vista HTML del Email

Si haces clic en el email, ves toda la información:

### Headers (Encabezados)

```
RECEIVED: from mailtrap.io [192.0.2.1] by mailtrap.io
          (Postfix) with ESMTP id ABC123DEF456
          for <mailtrap@example.com>; Nov 15 22:30:45 +0000

FROM:       "ControlApp" <reset@controlapp.com>
TO:         juan@example.com
SUBJECT:    Restablece tu contraseña - ControlApp
DATE:       Mon, 15 Nov 2025 22:30:45 +0000

MESSAGE-ID: <mailj9q8r7s6t5@mailtrap.io>
X-MAILER:   Laravel/11.x
X-PRIORITY: 3 (Normal)
MIME-VERSION: 1.0
CONTENT-TYPE: multipart/alternative; boundary="===============boundary123=="
CONTENT-TRANSFER-ENCODING: 8bit
```

### Body - Plain Text (Texto Plano)

```
¡Hola!

Recibiste este correo porque solicitaste restablecer tu contraseña.

Restablecer Contraseña
http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com

Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, ignora este email.

Saludos,
ControlApp
```

### Body - HTML (Vista Formateada)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; }
        .button { background-color: #007bff; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>¡Hola!</h2>
    
    <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
    
    <p>
        <a href="http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com" 
           class="button">
            Restablecer Contraseña
        </a>
    </p>
    
    <p>Este enlace expirará en 1 hora.</p>
    
    <p>Si no solicitaste restablecer tu contraseña, ignora este email.</p>
    
    <p>
        Saludos,<br>
        <strong>ControlApp</strong>
    </p>
</body>
</html>
```

---

## 🔗 Links (Análisis de URLs)

Si haces clic en la pestaña "Links" en Mailtrap:

```
┌────────────────────────────────────────────────────────────────┐
│ LINKS IN THIS EMAIL                                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🔗 Link #1                                                   │
│  ─────────                                                    │
│  Text:     "Restablecer Contraseña"                          │
│  URL:      http://localhost:3000/reset-password?token=a7...  │
│  Status:   Not verified (link not clicked)                    │
│                                                                │
│  ┌─ FULL URL ───────────────────────────────────────────────┐ │
│  │ http://localhost:3000/reset-password                      │ │
│  │   ?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p          │ │
│  │   &email=juan%40example.com                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  Parameters:                                                  │
│  • token: a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p             │
│  • email: juan@example.com (URL encoded)                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Attachments (Adjuntos)

```
┌────────────────────────────────────────────────────────────────┐
│ ATTACHMENTS                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  No attachments found                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Email Metadata (Información del Email)

```
┌────────────────────────────────────────────────────────────────┐
│ EMAIL METADATA                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Delivered:      ✅ Yes                                        │
│  Spam Score:     0.0 (Not spam)                               │
│  Bounce Risk:    0.0                                          │
│  Read Status:    Marked as read by recipient                  │
│  Size:           12 KB                                        │
│  Parts:          2 (HTML + Plain text)                        │
│  Charset:        UTF-8                                        │
│  Encoding:       7bit                                         │
│                                                                │
│  AUTHENTICITY CHECKS                                          │
│  ─────────────────────────                                    │
│  SPF:      ✅ Pass   (from smtp.mailtrap.io)                  │
│  DKIM:     ❌ Fail   (Not signed)                             │
│  DMARC:    ⚠️  Neutral                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Vista de Código Fuente

Si quieres ver el correo en bruto, hay una opción "Show Source":

```
Return-Path: <reset@controlapp.com>
Received: from mailtrap.io (mailtrap.io [192.0.2.1])
	by mailtrap.io (Postfix) with ESMTP id ABC123
	for <mailtrap@example.com>;
	Mon, 15 Nov 2025 22:30:45 +0000 (UTC)

Date: Mon, 15 Nov 2025 22:30:45 +0000
From: "ControlApp" <reset@controlapp.com>
Reply-To: reset@controlapp.com
To: juan@example.com
Subject: Restablece tu contraseña - ControlApp
Message-ID: <mailj9q8r7s6t5@mailtrap.io>
MIME-Version: 1.0
Content-Type: multipart/alternative;
 boundary="===============boundary123=="
Content-Transfer-Encoding: 8bit

--===============boundary123==
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: 8bit

¡Hola!

Recibiste este correo porque solicitaste restablecer tu contraseña.

Restablecer Contraseña
http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com

Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, ignora este email.

Saludos,
ControlApp

--===============boundary123==
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: 8bit

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; }
        .button { background-color: #007bff; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>¡Hola!</h2>
    <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
    <p><a href="http://localhost:3000/reset-password?token=a7k2x9q1m3n5p8l0z6c4v2b9d1f3h5jk2m4n6p&email=juan%40example.com" class="button">Restablecer Contraseña</a></p>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste restablecer tu contraseña, ignora este email.</p>
    <p>Saludos,<br><strong>ControlApp</strong></p>
</body>
</html>

--===============boundary123==--
```

---

## 🖼️ Vista Renderizada en Cliente

Cuando el usuario abre el correo en su cliente de email (Gmail, Outlook, etc.):

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
│  De: ControlApp <reset@controlapp.com>                             │
│  Para: juan@example.com                                            │
│  Asunto: Restablece tu contraseña - ControlApp                    │
│  Fecha: 15 de noviembre de 2025 22:30                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│  ¡Hola!                                                            │
│                                                                     │
│  Recibiste este correo porque solicitaste restablecer tu           │
│  contraseña.                                                       │
│                                                                     │
│                                                                     │
│  ┌────────────────────────────────┐                                │
│  │  Restablecer Contraseña       │  ← BOTÓN CLICKEABLE            │
│  └────────────────────────────────┘                                │
│                                                                     │
│  Este enlace expirará en 1 hora.                                   │
│                                                                     │
│  Si no solicitaste restablecer tu contraseña, ignora este email.  │
│                                                                     │
│                                                                     │
│  Saludos,                                                          │
│  ControlApp                                                        │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Verificación de Componentes

Cuando ves un email en Mailtrap, verifica que tenga:

### ✓ Estructura Básica
- [x] De (From): reset@controlapp.com
- [x] Para (To): usuario@example.com
- [x] Asunto (Subject): "Restablece tu contraseña - ControlApp"
- [x] Fecha (Date): Hora actual

### ✓ Contenido
- [x] Saludo: "¡Hola!"
- [x] Explicación: "Recibiste este correo porque..."
- [x] Botón/Link: "Restablecer Contraseña"
- [x] Mensaje de expiración: "Este enlace expirará en 1 hora"
- [x] Descargo de responsabilidad

### ✓ Token y Email en URL
- [x] URL incluye parámetro `token=abc123...`
- [x] URL incluye parámetro `email=usuario%40example.com`
- [x] URL apunta a frontend (`localhost:3000` o tu dominio)
- [x] Email está URL encoded (@ = %40)

### ✓ Partes MIME
- [x] Versión MIME: 1.0
- [x] Content-Type: multipart/alternative
- [x] Boundary separador definido
- [x] Parte text/plain
- [x] Parte text/html

### ✓ Seguridad
- [x] No tiene fallos de SPF
- [x] Email no marcado como spam
- [x] Headers correctos
- [x] No tiene virus (Mailtrap verifica)

---

## 🎯 Casos de Uso en Mailtrap

### Caso 1: Verificar Token Correcto
1. Abre el email en Mailtrap
2. Busca la URL en la sección de Links
3. Copia el token (parámetro `token=...`)
4. Verifica que es diferente cada vez que se solicita un reset

### Caso 2: Probar Email del Usuario
1. En los tests, usa diferentes emails
2. Verifica que cada uno recibe su email
3. Busca los múltiples emails en Mailtrap
4. Confirma que cada uno tiene su propio token

### Caso 3: Verificar Expiración
1. Solicita un reset
2. Espera más de 1 hora
3. El token debería estar expirado
4. Intenta usarlo (debería fallar)

---

## 📞 Support & Troubleshooting

Si no ves los correos en Mailtrap:

1. **Verifica .env:**
   ```bash
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   ```

2. **Verifica credenciales:**
   - MAIL_USERNAME (tu username en Mailtrap)
   - MAIL_PASSWORD (tu token en Mailtrap)

3. **Verifica logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Ejecuta test:**
   ```bash
   php artisan test tests/Feature/PasswordResetMailTest.php
   ```

---

**Creado:** 15 de Noviembre, 2025
**Tema:** Visualización de emails en Mailtrap
**Status:** ✅ Completo
