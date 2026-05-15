<?php declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use App\Modules\Tasks\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable for task assignment notifications.
 * Extends the shared email layout for visual consistency.
 */
class TaskAssignedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Task $task,
        public User $assignedBy,
        public string $recipientLocale = 'es',
        public string $taskUrl = '',
    ) {
        $proyecto = $task->proyecto;
        $this->taskUrl = $proyecto
            ? config('app.url') . '/mis-proyectos/' . $proyecto->uuid . '?tab=tasks&task=' . $task->uuid
            : config('app.url') . '/dashboard';
    }

    public function envelope(): Envelope
    {
        $subject = $this->recipientLocale === 'en'
            ? "New task assigned: {$this->task->title}"
            : "Nueva tarea asignada: {$this->task->title}";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.task-assigned',
        );
    }
}
