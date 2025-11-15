<!DOCTYPE html>
<html>

<head>
    <title>Invitación a Proyecto</title>
</head>

<body>
    <h2>¡Has sido invitado!</h2>
    <p>
        Has sido invitado a unirte al proyecto: <strong>{{ $invitacion->proyecto->nombre }}</strong>.
    </p>
    <p>
        Esta invitación expirará en 7 días.
    </p>
    <p>
        Para aceptar, primero inicia sesión (o regístrate con este email) en nuestra app,
        y luego haz clic en el siguiente enlace:
    </p>
    <p>
        {{-- ¡Este es el enlace que tu React necesita! --}}
        {{-- Lee la URL del archivo .env --}}
        @php
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $urlDeInvitacion = $frontendUrl . '/invitacion/' . $invitacion->token;
        @endphp

        <a href="{{ $urlDeInvitacion }}">
            Aceptar Invitación ({{ $urlDeInvitacion }})
        </a>
    </p>
    <p>
        (Si tienes problemas, copia y pega el enlace en tu navegador).
    </p>
</body>

</html>