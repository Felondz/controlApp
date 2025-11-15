<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Correo Electrónico</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
        }

        .content {
            margin: 30px 0;
        }

        .content p {
            margin: 15px 0;
            font-size: 16px;
        }

        .highlight {
            background-color: #f0f8ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .cta-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #0056b3;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .link-fallback {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            word-break: break-all;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            font-size: 12px;
            color: #666;
        }

        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
        }

        strong {
            color: #007bff;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>✓ Verifica tu Correo Electrónico</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>¡Hola <strong>{{ $user->name }}</strong>!</p>

            <p>
                Gracias por registrarte en nuestra plataforma. Para completar tu registro y acceder a todas
                las funcionalidades, necesitas verificar tu correo electrónico.
            </p>

            <div class="highlight">
                <p>
                    <strong>Este enlace tiene una validez de 24 horas.</strong> Después de este tiempo, deberás
                    solicitar un nuevo enlace de verificación.
                </p>
            </div>

            <!-- Button -->
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="cta-button">
                    Verificar mi Correo Electrónico
                </a>
            </div>

            <!-- Fallback Link -->
            <p style="text-align: center; color: #666; font-size: 14px; margin: 20px 0;">
                Si el botón anterior no funciona, copia y pega el siguiente enlace en tu navegador:
            </p>
            <div class="link-fallback">
                <a href="{{ $verificationUrl }}" style="color: #007bff; text-decoration: none;">
                    {{ $verificationUrl }}
                </a>
            </div>

            <!-- Warning -->
            <div class="warning">
                <strong>⚠️ Seguridad:</strong> Si no realizaste este registro, ignora este correo.
                No se requiere ninguna acción adicional de tu parte.
            </div>

            <p>
                Si tienes algún problema para verificar tu cuenta o tienes dudas, contáctanos respondiendo a este correo.
            </p>

            <p>
                ¡Gracias por confiar en nosotros!<br>
                <strong>El Equipo de ControlApp</strong>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                © {{ date('Y') }} ControlApp. Todos los derechos reservados.<br>
                Este es un correo automático, por favor no respondas directamente.
            </p>
        </div>
    </div>
</body>

</html>