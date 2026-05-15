<?php declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use App\Modules\Tasks\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification dispatched when a user is assigned to a task.
 * 
 * Channels: database (inbox), mail (email).
 */
class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Task $task,
        private readonly User $assignedBy,
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
     * Data stored in the `notifications` table.
     *
     * @param User $notifiable
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        $proyecto = $this->task->proyecto;

        return [
            'type' => 'task_assigned',
            'task_id' => $this->task->id,
            'task_uuid' => $this->task->uuid,
            'task_title' => $this->task->title,
            'task_id_string' => $this->task->task_id_string,
            'project_id' => $proyecto?->id,
            'project_uuid' => $proyecto?->uuid,
            'project_name' => $proyecto->nombre ?? '',
            'assigned_by_name' => $this->assignedBy->name,
            'assigned_by_id' => $this->assignedBy->id,
        ];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param User $notifiable
     * @return \App\Mail\TaskAssignedMail
     */
    public function toMail(User $notifiable): \App\Mail\TaskAssignedMail
    {
        return (new \App\Mail\TaskAssignedMail(
            task: $this->task,
            assignedBy: $this->assignedBy,
            recipientLocale: $notifiable->locale ?? 'es',
        ))->to($notifiable->email);
    }
}
