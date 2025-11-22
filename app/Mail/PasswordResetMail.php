<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * El token de restablecimiento.
     */
    public $token;

    /**
     * El email del usuario.
     */
    public $email;

    /**
     * Crea una nueva instancia del mensaje.
     */
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Define el "sobre" del mensaje (Asunto, De, Para).
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: $this->email,
            subject: 'Restablece tu Contraseña - ControlApp',
        );
    }

    /**
     * Define el contenido (la "plantilla" o "vista" del email).
     */
    public function content(): Content
    {
        // URL para restablecimiento (mismo dominio que el backend)
        $resetUrl = url('/reset-password?token=' . $this->token . '&email=' . urlencode($this->email));

        return new Content(
            view: 'emails.password-reset',
            with: [
                'resetUrl' => $resetUrl,
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
