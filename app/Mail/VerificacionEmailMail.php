<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificacionEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La URL de verificación.
     */
    public $verificationUrl;

    /**
     * El usuario que debe verificar el email.
     */
    public $user;

    /**
     * La URL de verificación móvil.
     */
    public $mobileUrl;

    /**
     * Crea una nueva instancia del mensaje.
     */
    public function __construct($verificationUrl, User $user)
    {
        $this->verificationUrl = $verificationUrl;
        $this->user = $user;
    }

    /**
     * Set the mobile verification URL.
     */
    public function withMobileUrl($mobileUrl)
    {
        $this->mobileUrl = $mobileUrl;
        return $this;
    }

    /**
     * Define el "sobre" del mensaje (Asunto, De, Para).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verifica tu Correo Electrónico - ControlApp',
        );
    }

    /**
     * Define el contenido (la "plantilla" o "vista" del email).
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.verificacion-email',
            with: [
                'verificationUrl' => $this->verificationUrl,
                'mobileUrl' => $this->mobileUrl,
                'user' => $this->user,
            ],
        );
    }

    /**
     * Obtiene los adjuntos del mensaje.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
