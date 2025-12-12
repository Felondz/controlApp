<?php

namespace App\Modules\Chat\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Chat\Events\MessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UpdateUnreadCount implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'redis'; // Use Redis as requested

    /**
     * Handle the event.
     */
    public function handle(ModuleEvent $event): void
    {
        // Only handle chat.message.sent
        if ($event->getName() !== 'chat.message.sent') {
            return;
        }

        $payload = $event->getPayload();
        $projectId = $event->getProjectId();
        $senderId = $payload['sender_id'];
        $recipientId = $payload['recipient_id'] ?? null; // Null for channel messages

        Log::channel('modules')->info("UpdateUnreadCount: Processing message {$payload['message_id']}", [
            'project_id' => $projectId,
            'sender_id' => $senderId,
            'recipient_id' => $recipientId
        ]);

        try {
            if ($recipientId) {
                // DM: Increment unread count for the recipient in the project
                // Logic: Need to confirm if unread_messages_count applies to DMs or just "project" messages.
                // The current schema has unread_messages_count on proyecto_user.
                // If it's a DM, it contributes to "unread" count for that project context.
                // But DMs are personal. The pivot tracks "total unread in this project".

                // Let's assume unread_messages_count aggregates everything unread in that project context for that user.

                DB::table('proyecto_user')
                    ->where('proyecto_id', $projectId)
                    ->where('user_id', $recipientId)
                    ->increment('unread_messages_count');

            } else {
                // Channel Message: Increment for ALL members EXCEPT sender
                DB::table('proyecto_user')
                    ->where('proyecto_id', $projectId)
                    ->where('user_id', '!=', $senderId)
                    ->increment('unread_messages_count');
            }

            Log::channel('modules')->debug("UpdateUnreadCount: Updated counts successfully.");

        } catch (\Exception $e) {
            Log::channel('modules')->error("UpdateUnreadCount: Failed to update counts", [
                'error' => $e->getMessage()
            ]);
            throw $e; // Retry
        }
    }
}
