@extends('emails.layout')

@php
    $header = 'Verifica tu correo electrónico';
@endphp

@section('content')
<p>¡Hola <span class="greeting">{{ $user->name }}</span>!</p>

<p>
    Gracias por registrarte en <strong>ControlApp</strong>. Para completar tu registro y acceder a todas
    las funcionalidades, necesitas verificar tu dirección de correo electrónico.
</p>

<div class="highlight-box">
    <p>
        <strong>⏱️ Tiempo límite:</strong> Este enlace tiene una validez de <strong>24 horas</strong>.
        Después de este tiempo, deberás solicitar un nuevo enlace de verificación.
    </p>
</div>

<div class="button-wrapper">
    <a href="{{ $verificationUrl }}" class="cta-button">
        Verificar mi correo electrónico
    </a>
</div>

<div class="link-fallback">
    <p><strong>¿No puedes hacer clic en el botón?</strong></p>
    <p>Copia y pega la siguiente URL en tu navegador:</p>
    <p><a href="{{ $verificationUrl }}" class="break-all">{{ $verificationUrl }}</a></p>
</div>

<div class="alert-box">
    <p><strong>⚠️ Importante:</strong> Si no solicitaste este registro, por favor ignora este correo. 
    No se requiere ninguna acción adicional de tu parte.</p>
</div>

<p class="mt-8">
    Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este correo. 
    Nuestro equipo de soporte estará encantado de ayudarte.
</p>

<p class="mt-8">
    Saludos,<br>
    <strong>El equipo de ControlApp</strong>
</p>
@endsection