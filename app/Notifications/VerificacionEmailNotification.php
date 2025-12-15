<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\VerificacionEmailMail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerificacionEmailNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;
    /**
     * Get the verification URL for the given notifiable.
     * 
     * Override to generate simple hash URLs without signature parameter.
     * This prevents 403 "invalid signature" errors in production.
     */
    protected function verificationUrl($notifiable)
    {
        return \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            \Illuminate\Support\Carbon::now()->addMinutes(\Illuminate\Support\Facades\Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
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
