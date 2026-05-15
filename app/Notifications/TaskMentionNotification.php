<?php declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use App\Modules\Tasks\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Mail\TaskMentionMail;

/**
 * Core notification dispatched when a user is mentioned (@) in a task comment.
 * Lives in app/Notifications/ because the notification system is cross-cutting (core).
 * 
 * Channels: database (inbox badge) + mail (queued email).
 */
class TaskMentionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Task $task,
        private readonly User $mentionedBy,
        private readonly string $commentContent,
    ) {}

    /**
     * @param User $notifiable
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        return ['database', 'mail', 'broadcast'];
    }

    /**
     * Data stored in the `notifications` table for the inbox/topbar badge.
     *
     * @param User $notifiable
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        $proyecto = $this->task->proyecto;

        return [
            'type' => 'task_mention',
            'task_id' => $this->task->id,
            'task_uuid' => $this->task->uuid,
            'task_title' => $this->task->title,
            'task_id_string' => $this->task->task_id_string,
            'project_id' => $proyecto?->id,
            'project_uuid' => $proyecto?->uuid,
            'project_name' => $proyecto->nombre ?? '',
            'mentioned_by_name' => $this->mentionedBy->name,
            'mentioned_by_id' => $this->mentionedBy->id,
            'comment_excerpt' => mb_substr($this->commentContent, 0, 120),
        ];
    }

    /**
     * Mail channel — uses a dedicated Mailable that extends the shared email layout.
     *
     * @param User $notifiable
     * @return TaskMentionMail
     */
    public function toMail(User $notifiable): TaskMentionMail
    {
        return (new TaskMentionMail(
            task: $this->task,
            mentionedBy: $this->mentionedBy,
            commentContent: $this->commentContent,
            recipientLocale: $notifiable->locale ?? 'es',
        ))->to($notifiable->email);
    }
}
