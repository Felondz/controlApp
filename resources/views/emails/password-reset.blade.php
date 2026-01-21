@extends('emails.layout')

@php
    $header = 'Restablece tu contraseña';
@endphp

@section('content')
    <p>¡Hola!</p>

    <p>
        Recibiste este correo porque solicitaste restablecer la contraseña de tu cuenta en
        <strong>ControlApp</strong>. Para completar el proceso, sigue las instrucciones a continuación.
    </p>

    <div class="highlight-box">
        <p>
            <strong>⏱️ Tiempo límite:</strong> Este enlace tiene una validez de <strong>1 hora</strong>.
            Después de este tiempo, deberás solicitar un nuevo enlace de restablecimiento.
        </p>
    </div>

    <div class="button-wrapper">
        <a href="{{ $resetUrl }}" class="cta-button">
            Restablecer mi contraseña
        </a>

        @if(isset($mobileUrl))
            <div style="margin-top: 15px;">
                <a href="{{ $mobileUrl }}" class="cta-button" style="background-color: #7c3aed;">
                    Abrir en la App
                </a>
            </div>
        @endif
    </div>

    <div class="link-fallback">
        <p><strong>¿No puedes hacer clic en el botón?</strong></p>
        <p>Copia y pega la siguiente URL en tu navegador:</p>
        <p><a href="{{ $resetUrl }}" class="break-all">{{ $resetUrl }}</a></p>
    </div>

    <div class="alert-box">
        <p><strong>⚠️ Importante:</strong> Si no solicitaste restablecer tu contraseña,
            por favor ignora este correo o contáctanos de inmediato.</p>
    </div>

    <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">Consejos de seguridad:</h3>
        <ul class="list-disc pl-5 space-y-1">
            <li>Usa una contraseña fuerte con mayúsculas, minúsculas, números y símbolos</li>
            <li>No reutilices contraseñas de otras cuentas</li>
            <li>Considera usar un gestor de contraseñas</li>
        </ul>
    </div>

    <p class="mt-8">
        Si tienes alguna pregunta o no solicitaste este cambio, por favor contáctanos
        respondiendo a este correo.
    </p>

    <p class="mt-8">
        Saludos,<br>
        <strong>El equipo de ControlApp</strong>
    </p>

    <p class="text-xs text-gray-500 mt-8">
        Este es un correo automático, por favor no respondas a este mensaje.
    </p>
@endsection