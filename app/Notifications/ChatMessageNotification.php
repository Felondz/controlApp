<?php declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Chat\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

/**
 * Notification dispatched when a new chat message is sent.
 * 
 * Channels: database (inbox). Mail is only used for private messages to avoid spam.
 */
class ChatMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Message $message,
    ) {}

    /**
     * @param User $notifiable
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Data stored in the `notifications` table.
     *
     * @param User $notifiable
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        $proyecto = $this->message->proyecto;
        $sender = $this->message->user;

        return [
            'type' => 'chat_message',
            'message_id' => $this->message->id,
            'message_uuid' => $this->message->uuid,
            'message_content' => mb_substr($this->message->content, 0, 100),
            'project_id' => $proyecto?->id,
            'project_uuid' => $proyecto?->uuid,
            'project_name' => $proyecto->nombre ?? 'Chat Personal',
            'sender_name' => $sender->name,
            'sender_id' => $sender->id,
            'is_private' => !is_null($this->message->recipient_id),
        ];
    }

}
