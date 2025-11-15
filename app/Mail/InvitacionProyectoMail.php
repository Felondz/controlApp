<?php

namespace App\Mail;

use App\Models\Invitacion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvitacionProyectoMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La instancia de la invitación.
     */
    public $invitacion;

    /**
     * Crea una nueva instancia del mensaje.
     */
    public function __construct(Invitacion $invitacion)
    {
        // 1. Recibimos la invitación (con el token, email, etc.)
        $this->invitacion = $invitacion;
    }

    /**
     * Define el "sobre" del mensaje (Asunto, De, Para).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invitación para unirte a un Proyecto',
        );
    }

    /**
     * Define el contenido (la "plantilla" o "vista" del email).
     */
    public function content(): Content
    {
        // 2. Le decimos que use una plantilla que crearemos
        //    en: resources/views/emails/invitacion-proyecto.blade.php
        return new Content(
            view: 'emails.invitacion-proyecto',
        );
    }
}
