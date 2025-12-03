<?php

namespace App\Modules\Notifications\Services;

use App\Core\Events\Contracts\ModuleEvent;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Notifications\Notifications\TransactionCreatedNotification;
use App\Modules\Notifications\Notifications\TaskAssignedNotification;
use App\Modules\Notifications\Notifications\MessageReceivedNotification;
use App\Modules\Notifications\Models\NotificationPreference;

/**
 * NotificationService
 * 
 * Central service for sending notifications based on events.
 */
class NotificationService
{
    /**
     * Notify about transaction creation.
     */
    public function notifyTransactionCreated(ModuleEvent $event): void
    {
        $projectId = $event->getProjectId();
        $project = Proyecto::find($projectId);

        if (!$project)
            return;

        // Notify all project members
        foreach ($project->miembros as $member) {
            if ($this->shouldNotify($member, 'transaction_created', 'database')) {
                $member->notify(new TransactionCreatedNotification(
                    $event->getPayload(),
                    $project->nombre
                ));
            }
        }
    }

    /**
     * Notify about task assignment.
     */
    public function notifyTaskCreated(ModuleEvent $event): void
    {
        $assigneeId = $event->get('assignee_id');

        if (!$assigneeId)
            return;

        $projectId = $event->getProjectId();
        $project = Proyecto::find($projectId);
        $assignee = User::find($assigneeId);

        if (!$project || !$assignee)
            return;

        if ($this->shouldNotify($assignee, 'task_assigned', 'database')) {
            $assignee->notify(new TaskAssignedNotification(
                $event->getPayload(),
                $project->nombre
            ));
        }
    }

    /**
     * Notify about private message.
     */
    public function notifyMessageSent(ModuleEvent $event): void
    {
        $receiverId = $event->get('receiver_id');

        if (!$receiverId)
            return; // Only notify for private messages

        $projectId = $event->getProjectId();
        $project = Proyecto::find($projectId);
        $receiver = User::find($receiverId);
        $sender = User::find($event->get('sender_id'));

        if (!$project || !$receiver || !$sender)
            return;

        if ($this->shouldNotify($receiver, 'message_received', 'database')) {
            $receiver->notify(new MessageReceivedNotification(
                $event->getPayload(),
                $project->nombre,
                $sender->name
            ));
        }
    }

    /**
     * Check if user should receive notification.
     */
    private function shouldNotify(User $user, string $eventType, string $channel): bool
    {
        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('event_type', $eventType)
            ->where('channel', $channel)
            ->first();

        // Default to enabled if no preference set
        return $preference ? $preference->enabled : true;
    }
}
