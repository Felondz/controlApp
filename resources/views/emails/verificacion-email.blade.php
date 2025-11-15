@extends('emails.layout')

@section('content')
<h2>✓ Verifica tu Correo Electrónico</h2>

<p>¡Hola <span class="greeting">{{ $user->name }}</span>!</p>

<p>
    Gracias por registrarte en <strong>ControlApp</strong>. Para completar tu registro y acceder a todas
    las funcionalidades, necesitas verificar tu correo electrónico.
</p>

<div class="highlight-box">
    <p>
        <strong>⏱️ Tiempo límite:</strong> Este enlace tiene una validez de <strong>24 horas</strong>.
        Después de este tiempo, deberás solicitar un nuevo enlace de verificación.
    </p>
</div>

<div class="button-wrapper">
    <a href="{{ $verificationUrl }}" class="cta-button">
        ✓ Verificar mi Correo Electrónico
    </a>
</div>

<div class="link-fallback">
    <p><strong>¿No funciona el botón?</strong></p>
    <p>Copia y pega el siguiente enlace en tu navegador:</p>
    <p style="margin-top: 10px;">
        <a href="{{ $verificationUrl }}">{{ $verificationUrl }}</a>
    </p>
</div>

<div class="alert-box">
    <strong>⚠️ Seguridad:</strong> Si no realizaste este registro, ignora este correo.
    No se requiere ninguna acción adicional de tu parte.
</div>

<p>
    Si tienes algún problema para verificar tu cuenta o tienes dudas, no dudes en contactarnos
    respondiendo a este correo. ¡Estamos aquí para ayudarte!
</p>

<p style="color: #999; font-size: 14px; margin-top: 30px;">
    ¡Gracias por confiar en nosotros!<br>
    <strong style="color: #667eea;">El Equipo de ControlApp</strong>
</p>
@endsection