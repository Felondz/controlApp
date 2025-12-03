<?php

namespace App\Modules\Notifications\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * TransactionCreatedNotification
 * 
 * Sent when a new transaction is created in a project.
 */
class TransactionCreatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private array $transactionData,
        private string $projectName
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'transaction_created',
            'project_name' => $this->projectName,
            'amount' => $this->transactionData['amount'],
            'description' => $this->transactionData['description'] ?? '',
            'transaction_id' => $this->transactionData['transaction_id'],
            'project_id' => $this->transactionData['project_id'] ?? null,
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        $amount = number_format($this->transactionData['amount'], 2);

        return (new MailMessage)
            ->subject("Nueva transacción en {$this->projectName}")
            ->line("Se ha creado una nueva transacción:")
            ->line("**Monto:** \${$amount}")
            ->line("**Descripción:** {$this->transactionData['description']}")
            ->action('Ver Proyecto', url("/proyectos/{$this->transactionData['project_id']}"));
    }
}
