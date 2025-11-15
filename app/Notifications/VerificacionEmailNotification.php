<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\VerificacionEmailMail;

class VerificacionEmailNotification extends VerifyEmail
{
    use Queueable;

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // Generamos la URL de verificación (la misma que Laravel genera por defecto)
        $verificationUrl = $this->verificationUrl($notifiable);

        // Enviamos nuestro Mailable personalizado
        return (new VerificacionEmailMail($verificationUrl, $notifiable))
            ->to($notifiable->getEmailForVerification());
    }
}
