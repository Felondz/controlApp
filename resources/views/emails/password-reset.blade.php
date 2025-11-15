@extends('emails.layout')

@section('content')
<h2>🔐 Restablece tu Contraseña</h2>

<p>¡Hola!</p>

<p>
    Recibiste este correo porque solicitaste restablecer la contraseña de tu cuenta en
    <strong>ControlApp</strong>.
</p>

<div class="highlight-box">
    <p>
        <strong>⏱️ Tiempo límite:</strong> Este enlace tiene una validez de <strong>1 hora</strong>.
        Después de este tiempo, deberás solicitar un nuevo enlace de restablecimiento.
    </p>
</div>

<p>
    Para restablecer tu contraseña, haz clic en el botón siguiente:
</p>

<div class="button-wrapper">
    <a href="{{ $resetUrl }}" class="cta-button">
        🔓 Restablecer mi Contraseña
    </a>
</div>

<div class="link-fallback">
    <p><strong>¿No funciona el botón?</strong></p>
    <p>Copia y pega el siguiente enlace en tu navegador:</p>
    <p style="margin-top: 10px;">
        <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
    </p>
</div>

<div class="alert-box">
    <strong>⚠️ Seguridad:</strong> Si no solicitaste restablecer tu contraseña,
    ignora este correo o contacta a nuestro equipo de seguridad de inmediato.
    No compartas este enlace con nadie.
</div>

<div class="info-box">
    <strong>💡 Consejos de Seguridad:</strong>
    <ul style="margin: 10px 0 0 20px; padding-left: 0;">
        <li>Usa una contraseña fuerte con mayúsculas, minúsculas, números y símbolos</li>
        <li>No reutilices contraseñas de otras cuentas</li>
        <li>Cambia tu contraseña regularmente</li>
    </ul>
</div>

<p>
    Si tienes problemas para restablecer tu contraseña o sospechas de actividad sospechosa en tu cuenta,
    contáctanos respondiendo a este correo de inmediato.
</p>

<p style="color: #999; font-size: 14px; margin-top: 30px;">
    ¡Gracias por usar ControlApp!<br>
    <strong style="color: #667eea;">El Equipo de ControlApp</strong>
</p>
@endsection