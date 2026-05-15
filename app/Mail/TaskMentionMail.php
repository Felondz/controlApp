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
 * Mailable for task mention notifications.
 * Extends the shared email layout for visual consistency with other emails.
 */
class TaskMentionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Task $task;
    public User $mentionedBy;
    public string $commentContent;
    public string $recipientLocale;
    public string $taskUrl;

    public function __construct(
        Task $task,
        User $mentionedBy,
        string $commentContent,
        string $recipientLocale = 'es',
    ) {
        $this->task = $task;
        $this->mentionedBy = $mentionedBy;
        $this->commentContent = $commentContent;
        $this->recipientLocale = $recipientLocale;

        $proyecto = $task->proyecto;
        $this->taskUrl = $proyecto
            ? config('app.url') . '/mis-proyectos/' . $proyecto->uuid . '?tab=tasks&task=' . $task->uuid
            : config('app.url') . '/dashboard';
    }

    public function envelope(): Envelope
    {
        $subject = $this->recipientLocale === 'en'
            ? "{$this->mentionedBy->name} mentioned you in a task"
            : "{$this->mentionedBy->name} te mencionó en una tarea";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.task-mention',
        );
    }
}
