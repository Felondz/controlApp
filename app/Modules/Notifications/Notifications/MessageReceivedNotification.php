<?php

namespace App\Modules\Notifications\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * MessageReceivedNotification
 * 
 * Sent when a user receives a private message.
 */
class MessageReceivedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private array $messageData,
        private string $projectName,
        private string $senderName
    ) {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'message_received',
            'project_name' => $this->projectName,
            'sender_name' => $this->senderName,
            'content_preview' => substr($this->messageData['content'], 0, 100),
            'message_id' => $this->messageData['message_id'],
            'project_id' => $this->messageData['project_id'] ?? null,
        ];
    }
}
