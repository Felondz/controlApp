<?php

namespace App\Modules\Notifications\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * TaskAssignedNotification
 * 
 * Sent when a task is assigned to a user.
 */
class TaskAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(
        private array $taskData,
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
            'type' => 'task_assigned',
            'project_name' => $this->projectName,
            'task_title' => $this->taskData['title'],
            'task_id' => $this->taskData['task_id'],
            'project_id' => $this->taskData['project_id'] ?? null,
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Nueva tarea asignada en {$this->projectName}")
            ->line("Se te ha asignado una nueva tarea:")
            ->line("**Título:** {$this->taskData['title']}")
            ->action('Ver Tarea', url("/proyectos/{$this->taskData['project_id']}/tasks"));
    }
}
