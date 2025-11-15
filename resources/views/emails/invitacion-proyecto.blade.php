@extends('emails.layout')

@section('content')
@php
$frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
$invitationUrl = $frontendUrl . '/invitacion/' . $invitacion->token;
@endphp

<h2>🎉 ¡Has sido Invitado a un Proyecto!</h2>

<p>¡Hola!</p>

<p>
    <span class="greeting">{{ $invitacion->invitador->name }}</span> te ha invitado a unirte al proyecto
    <strong>{{ $invitacion->proyecto->nombre }}</strong> en ControlApp.
</p>

<div class="highlight-box">
    <p>
        <strong>Tu rol en el proyecto:</strong> <span style="background-color: #e8f4f8; padding: 4px 8px; border-radius: 3px;">
            {{ ucfirst($invitacion->rol) }}
        </span>
    </p>
    <p style="margin-top: 12px;">
        <strong>⏱️ Tiempo límite:</strong> Esta invitación expirará en <strong>7 días</strong>.
        Después de este tiempo, el enlace no será válido.
    </p>
</div>

<p>
    Para aceptar esta invitación y comenzar a colaborar en el proyecto, haz clic en el botón siguiente:
</p>

<div class="button-wrapper">
    <a href="{{ $invitationUrl }}" class="cta-button">
        👥 Aceptar Invitación
    </a>
</div>

<div class="info-box">
    <strong>💡 Nota:</strong> Si aún no tienes una cuenta en ControlApp, puedes crear una usando este
    correo electrónico cuando hagas clic en el enlace anterior.
</div>

<div class="link-fallback">
    <p><strong>¿No funciona el botón?</strong></p>
    <p>Copia y pega el siguiente enlace en tu navegador:</p>
    <p style="margin-top: 10px;">
        <a href="{{ $invitationUrl }}">{{ $invitationUrl }}</a>
    </p>
</div>

<div class="divider"></div>

<h3 style="color: #333; font-size: 16px; margin-bottom: 12px;">📋 Detalles de la Invitación</h3>
<ul style="list-style: none; padding: 0; margin: 0;">
    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
        <strong>Proyecto:</strong> {{ $invitacion->proyecto->nombre }}
    </li>
    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
        <strong>Rol:</strong> {{ ucfirst($invitacion->rol) }}
    </li>
    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
        <strong>Invitado por:</strong> {{ $invitacion->invitador->name }} ({{ $invitacion->invitador->email }})
    </li>
    <li style="padding: 8px 0;">
        <strong>Válida hasta:</strong> {{ $invitacion->created_at->addDays(7)->format('d/m/Y H:i') }}
    </li>
</ul>

<div class="alert-box" style="margin-top: 25px;">
    <strong>⚠️ Seguridad:</strong> Si no esperabas esta invitación o crees que fue un error,
    ignora este correo. Tu correo electrónico no será agregado a ningún proyecto sin tu consentimiento.
</div>

<p style="color: #999; font-size: 14px; margin-top: 30px;">
    ¿Preguntas o problemas? Contáctanos respondiendo a este correo.<br>
    <strong style="color: #667eea;">El Equipo de ControlApp</strong>
</p>
@endsection