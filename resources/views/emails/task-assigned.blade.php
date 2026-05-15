@extends('emails.layout')

@section('content')
    @php
        $isEn = ($recipientLocale ?? 'es') === 'en';
    @endphp

    <h2>{{ $isEn ? '📋 New task assigned' : '📋 Nueva tarea asignada' }}</h2>

    <p>{{ $isEn ? 'Hi!' : '¡Hola!' }}</p>

    <p>
        <span class="greeting">{{ $assignedBy->name }}</span>
        {{ $isEn ? 'has assigned you a new task:' : 'te ha asignado una nueva tarea:' }}
    </p>

    <div class="highlight-box">
        <p><strong>{{ $task->task_id_string }} — {{ $task->title }}</strong></p>
        @if($task->proyecto)
            <p style="margin-top: 8px; font-size: 14px; color: #666;">
                {{ $isEn ? 'Project:' : 'Proyecto:' }} <strong>{{ $task->proyecto->nombre }}</strong>
            </p>
        @endif
    </div>

    <div class="button-wrapper">
        <a href="{{ $taskUrl }}" class="cta-button">
            🚀 {{ $isEn ? 'View Task' : 'Ver Tarea' }}
        </a>
    </div>

    <div class="link-fallback">
        <p><strong>{{ $isEn ? 'Button not working?' : '¿No funciona el botón?' }}</strong></p>
        <p>{{ $isEn ? 'Copy and paste this link into your browser:' : 'Copia y pega el siguiente enlace en tu navegador:' }}</p>
        <p style="margin-top: 10px;">
            <a href="{{ $taskUrl }}">{{ $taskUrl }}</a>
        </p>
    </div>

    <p style="color: #999; font-size: 14px; margin-top: 30px;">
        {{ $isEn ? 'Questions? Reply to this email.' : '¿Preguntas? Responde a este correo.' }}<br>
        <strong style="color: #667eea;">{{ $isEn ? 'The ControlApp Team' : 'El Equipo de ControlApp' }}</strong>
    </p>
@endsection
