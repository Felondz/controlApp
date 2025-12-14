<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\VerificacionEmailMail;

class VerificacionEmailNotification extends VerifyEmail
{
    /**
     * Get the verification URL for the given notifiable.
     * 
     * Override to generate simple hash URLs without signature parameter.
     * This prevents 403 "invalid signature" errors in production.
     */
    protected function verificationUrl($notifiable)
    {
        return route('verification.verify', [
            'id' => $notifiable->getKey(),
            'hash' => sha1($notifiable->getEmailForVerification()),
        ]);
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // Generamos la URL de verificación usando nuestro método personalizado
        $verificationUrl = $this->verificationUrl($notifiable);

        // Enviamos nuestro Mailable personalizado
        return (new VerificacionEmailMail($verificationUrl, $notifiable))
            ->to($notifiable->getEmailForVerification());
    }
}
