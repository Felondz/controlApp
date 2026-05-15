<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Chat\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Events\NotificationsCleared;

class MessageController extends Controller
{

    /**
     * List messages for a project.
     */
    public function index(Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = request()->user();
        if (!$proyecto->miembros->contains($user) && (int)$proyecto->user_id !== (int)$user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $messages = Message::where('proyecto_id', $proyecto->id)
            ->where(function ($query) use ($user) {
                $query->whereNull('recipient_id') // General messages
                    ->orWhere('recipient_id', $user->id) // Private to me
                    ->orWhere('user_id', $user->id); // Private from me
            })
            ->with('user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name')
            ->latest()
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Send a message to a project.
     */
    public function store(Request $request, Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = request()->user();
        if (!$proyecto->miembros->contains($user) && (int)$proyecto->user_id !== (int)$user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'type' => 'nullable|string|in:text,image,file',
            'recipient_id' => 'nullable|exists:users,id',
        ]);

        $message = $proyecto->messages()->create([
            'user_id' => $user->id,
            'content' => $validated['content'],
            'type' => $validated['type'] ?? 'text',
            'recipient_id' => $validated['recipient_id'] ?? null,
        ]);

        // Load user relationship for the response
        $message->load('user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name');

        return response()->json($message, 201);
    }
    /**
     * Get unread messages count.
     */
    public function unread(Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = request()->user();
        if (!$proyecto->miembros->contains($user) && (int)$proyecto->user_id !== (int)$user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Private messages unread
        $privateUnread = Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->count();

        // General messages unread
        $generalUnread = 0;
        $lastReadAt = null;

        // Check if user is a member (to get last_read_at from pivot)
        $member = $proyecto->miembros()->where('user_id', $user->id)->first();

        if ($member) {
            /** @var mixed $pivot */
            $pivot = $member->pivot;
            $lastReadAt = $pivot->last_read_at;

            if ($lastReadAt) {
                $generalUnread = Message::where('proyecto_id', $proyecto->id)
                    ->whereNull('recipient_id')
                    ->where('created_at', '>', $lastReadAt)
                    ->where('user_id', '!=', $user->id) // Don't count own messages
                    ->count();
            } else {
                // If never read, count all general messages not from self
                $generalUnread = Message::where('proyecto_id', $proyecto->id)
                    ->whereNull('recipient_id')
                    ->where('user_id', '!=', $user->id)
                    ->count();
            }
        } else if ($proyecto->user_id === $user->id) {
            // Owner might not be in members pivot?
            // Usually owner is also a member, but if not, logic might differ.
            // For now assume owner is member or doesn't track general read status this way.
            // If owner is not in pivot, we can't track last_read_at for general chat unless we store it elsewhere.
            // Let's assume owner is added to members on creation.
        }

        return response()->json(['count' => $privateUnread + $generalUnread]);
    }


    /**
     * Mark messages as read.
     */
    public function markAsRead(Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = request()->user();
        if (!$proyecto->miembros->contains($user) && (int)$proyecto->user_id !== (int)$user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update pivot for general chat (if user is a member via pivot)
        if ($proyecto->miembros->contains($user)) {
            /** @var int $userId */
            $userId = $user->id;
            $proyecto->miembros()->updateExistingPivot($userId, ['last_read_at' => now()]);
        }

        // Update private messages sent TO me in this project
        Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // Clean up database notifications for chat messages in this project
        // This ensures the "unread" count in the topbar/notification center is accurate
        $user->notifications()
            ->where('type', 'App\Notifications\ChatMessageNotification')
            ->where('data->proyecto_uuid', $proyecto->uuid)
            ->delete();

        // Broadcast cleanup to other sessions (Mobile/Web)
        NotificationsCleared::dispatch($user, 'chat_message', $proyecto->uuid);

        return response()->json(['status' => 'success']);
    }
}
