<?php

namespace App\Notifications;

use App\Mail\PasswordResetMail;
use Illuminate\Notifications\Notification;

class PasswordResetNotification extends Notification
{

    /**
     * Constructor
     */
    public function __construct(
        public string $token,
        public string $email
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        return new PasswordResetMail($this->token, $this->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'token' => $this->token,
            'email' => $this->email,
        ];
    }
}
