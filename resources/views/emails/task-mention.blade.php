@extends('emails.layout')

@section('content')
    @php
        $isEn = ($recipientLocale ?? 'es') === 'en';
    @endphp

    <h2>{{ $isEn ? '💬 You were mentioned in a task' : '💬 Te mencionaron en una tarea' }}</h2>

    <p>{{ $isEn ? 'Hi!' : '¡Hola!' }}</p>

    <p>
        <span class="greeting">{{ $mentionedBy->name }}</span>
        {{ $isEn ? 'mentioned you in a comment on the task' : 'te mencionó en un comentario de la tarea' }}
        <strong>{{ $task->task_id_string }} — {{ $task->title }}</strong>
        @if($task->proyecto)
            {{ $isEn ? 'in the project' : 'del proyecto' }}
            <strong>{{ $task->proyecto->nombre }}</strong>.
        @endif
    </p>

    <div class="highlight-box">
        <p><strong>{{ $isEn ? 'Comment:' : 'Comentario:' }}</strong></p>
        <p style="margin-top: 8px; white-space: pre-line;">{{ $commentContent }}</p>
    </div>

    <div class="button-wrapper">
        <a href="{{ $taskUrl }}" class="cta-button">
            📋 {{ $isEn ? 'View Task' : 'Ver Tarea' }}
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
