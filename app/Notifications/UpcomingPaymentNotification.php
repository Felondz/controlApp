<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UpcomingPaymentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $account;
    protected $daysRemaining;

    /**
     * Create a new notification instance.
     */
    public function __construct($account, $daysRemaining)
    {
        $this->account = $account;
        $this->daysRemaining = $daysRemaining;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Check user preferences if available, otherwise default to database
        // For now, default to database and mail
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Recordatorio de Pago: ' . $this->account->nombre)
            ->greeting('Hola ' . $notifiable->name . ',')
            ->line('Tienes un pago próximo para la cuenta **' . $this->account->nombre . '**.')
            ->line('La fecha de pago es en **' . $this->daysRemaining . ' días**.')
            ->action('Ver Panel Financiero', url('/finance'))
            ->line('Gracias por usar ControlApp.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Próximo Pago',
            'message' => 'El pago de ' . $this->account->nombre . ' vence en ' . $this->daysRemaining . ' días.',
            'account_id' => $this->account->id,
            'days_remaining' => $this->daysRemaining,
            'type' => 'payment_reminder',
            'link' => '/finance'
        ];
    }
}
