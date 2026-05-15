<?php declare(strict_types=1);

namespace App\Modules\Tasks\Actions;

use App\Models\User;
use App\Modules\Tasks\Models\Task;
use App\Modules\Tasks\Models\TaskComment;
use App\Notifications\TaskMentionNotification;

class CreateTaskCommentAction
{
    /**
     * Create a comment and process mentions.
     *
     * @param Task $task
     * @param User $user
     * @param string $content
     * @param array<int, int> $mentionedUserIds  IDs of users mentioned via @
     * @return TaskComment
     */
    public function execute(Task $task, User $user, string $content, array $mentionedUserIds = []): TaskComment
    {
        /** @var TaskComment $comment */
        $comment = $task->comments()->create([
            'user_id' => $user->id,
            'content' => $content,
        ]);

        if (empty($mentionedUserIds)) {
            // Auto-detect mentions in text if not provided by frontend
            preg_match_all('/@([a-zA-Z0-9\s]+?)(?=\s|$|[,.!?])/', $content, $matches);
            if (!empty($matches[1])) {
                $mentionedNames = array_map('trim', $matches[1]);
                $mentionedUserIds = \Illuminate\Support\Facades\DB::table('proyecto_user')
                    ->join('users', 'users.id', '=', 'proyecto_user.user_id')
                    ->where('proyecto_user.proyecto_id', $task->project_id)
                    ->whereIn('users.name', $mentionedNames)
                    ->pluck('users.id')
                    ->map(fn($id) => (int)$id)
                    ->toArray();
            }
        }

        if (!empty($mentionedUserIds)) {
            $this->processMentions($task, $user, $content, $mentionedUserIds);
        }

        return $comment;
    }

    /**
     * Validate mentioned users belong to project, attach them to the task,
     * and dispatch notifications (queued to avoid saturating the server).
     *
     * @param Task $task
     * @param User $mentionedBy
     * @param string $commentContent
     * @param array<int, int> $mentionedUserIds
     */
    private function processMentions(Task $task, User $mentionedBy, string $commentContent, array $mentionedUserIds): void
    {
        $proyecto = $task->proyecto;
        if (!$proyecto) {
            \Illuminate\Support\Facades\Log::warning("Mention process aborted: Task has no project", ['task_id' => $task->id]);
            return;
        }

        \Illuminate\Support\Facades\Log::info("Processing mentions", [
            'task' => $task->uuid,
            'mentioned_by' => $mentionedBy->id,
            'input_ids' => $mentionedUserIds
        ]);

        // Filter: only project members can be mentioned
        // Using direct DB query on the pivot table for robustness
        $validMemberIds = \Illuminate\Support\Facades\DB::table('proyecto_user')
            ->where('proyecto_id', $proyecto->id)
            ->whereIn('user_id', $mentionedUserIds)
            ->pluck('user_id')
            ->map(fn($id) => (int)$id)
            ->toArray();

        \Illuminate\Support\Facades\Log::info("Valid members identified", ['valid_ids' => $validMemberIds]);

        if (empty($validMemberIds)) {
            return;
        }

        // Give mentioned users access to the task (without removing existing assignees)
        $task->users()->syncWithoutDetaching($validMemberIds);

        // Notify each mentioned user (except the commenter themselves)
        $usersToNotify = User::whereIn('id', $validMemberIds)
            ->where('id', '!=', $mentionedBy->id)
            ->get();

        \Illuminate\Support\Facades\Log::info("Users to notify count: " . $usersToNotify->count());

        foreach ($usersToNotify as $mentionedUser) {
            \Illuminate\Support\Facades\Log::info("Dispatching notification to: " . $mentionedUser->email);
            $mentionedUser->notify(
                new TaskMentionNotification($task, $mentionedBy, $commentContent)
            );
        }
    }
}
