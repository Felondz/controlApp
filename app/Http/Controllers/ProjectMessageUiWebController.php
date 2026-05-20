<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Modules\Chat\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Modules\Chat\Events\MessageUpdated;
use App\Modules\Chat\Events\MessageDeleted;
use App\Events\NotificationsCleared;

class ProjectMessageUiWebController extends Controller
{

    /**
     * List messages for a project (filtered by channel).
     */
    public function index(Request $request, Proyecto $proyecto): JsonResponse
    {
        // Authorization: Check if user is a member of the project
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $recipientId = $request->query('recipient_id');
        $query = Message::where('proyecto_id', $proyecto->id);

        if ($recipientId) {
            // Private messages between auth user and recipient
            $query->where(function ($q) use ($recipientId) {
                $q->where(function ($q2) use ($recipientId) {
                    $q2->where('user_id', auth()->id())
                        ->where('recipient_id', $recipientId);
                })->orWhere(function ($q2) use ($recipientId) {
                    $q2->where('user_id', $recipientId)
                        ->where('recipient_id', auth()->id());
                });
            });
        } else {
            // General messages
            $query->whereNull('recipient_id');
        }

        $messages = $query->with(['user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name', 'parent.user:id,uuid,name'])
            ->latest()
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Send a message to a project.
     */
    public function store(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $validated = $request->validate([
            'content' => 'nullable|string|max:2000',
            'type' => 'nullable|string|in:text,image,file',
            'recipient_id' => 'nullable|exists:users,id',
            'parent_id' => 'nullable|exists:messages,id',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if (empty($validated['content']) && !$request->hasFile('file')) {
            return response()->json(['message' => 'Message content or file is required'], 422);
        }

        $filePath = null;
        $type = $validated['type'] ?? 'text';

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mimeType = $file->getMimeType() ?? '';
            
            if (str_starts_with($mimeType, 'image/')) {
                $filePath = (new \App\Actions\SanitizeImageAction())->execute($file, 'chat/' . $proyecto->id, 'local');
                $type = 'image';
            } else {
                $extension = $file->getClientOriginalExtension();
                $filename = Str::uuid() . '.' . $extension;
                $filePath = $file->storeAs('chat/' . $proyecto->id, $filename, 'local');
                $type = 'file';
            }
            
            if (empty($validated['content'])) {
                $validated['content'] = $file->getClientOriginalName();
            }
        }

        /** @var \App\Modules\Chat\Models\Message $message */
        $message = $proyecto->messages()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'type' => $type,
            'recipient_id' => $validated['recipient_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'file_path' => $filePath,
        ]);

        $message->load(['user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name', 'parent.user:id,uuid,name']);

        // Dispatch el evento para WebSockets
        broadcast(new \App\Modules\Chat\Events\MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    /**
     * Update a message (edit content).
     */
    public function update(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        if ($message->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message->update([
            'content' => $validated['content'],
            'is_edited' => true,
        ]);

        $message->load(['user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name', 'parent.user:id,uuid,name']);

        broadcast(new \App\Modules\Chat\Events\MessageUpdated($message))->toOthers();

        return response()->json($message);
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        if ($message->user_id !== auth()->id() && !$user->esAdminDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messageId = $message->id;
        $proyectoId = $proyecto->id;

        $message->delete();

        broadcast(new \App\Modules\Chat\Events\MessageDeleted($message->uuid, $proyecto->uuid))->toOthers();

        return response()->json(['status' => 'success']);
    }

    /**
     * Toggle a reaction on a message.
     */
    public function toggleReaction(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        $validated = $request->validate([
            'emoji' => 'required|string|max:10',
        ]);

        $emoji = $validated['emoji'];
        $reactions = $message->reactions ?? [];

        if (!isset($reactions[$emoji])) {
            $reactions[$emoji] = [];
        }

        $userIdStr = (string)auth()->id();
        $userIndex = array_search($userIdStr, $reactions[$emoji]);

        if ($userIndex !== false) {
            unset($reactions[$emoji][$userIndex]);
            $reactions[$emoji] = array_values($reactions[$emoji]);
            if (empty($reactions[$emoji])) {
                unset($reactions[$emoji]);
            }
        } else {
            $reactions[$emoji][] = $userIdStr;
        }

        $message->update(['reactions' => empty($reactions) ? null : $reactions]);
        $message->load(['user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name', 'parent.user:id,uuid,name']);

        broadcast(new \App\Modules\Chat\Events\MessageUpdated($message))->toOthers();

        return response()->json($message);
    }

    /**
     * Mark messages as read (channel specific).
     */
    public function markAsRead(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $recipientId = $request->input('recipient_id');

        if ($recipientId) {
            // Mark DMs from this user as read
            Message::where('proyecto_id', $proyecto->id)
                ->where('user_id', $recipientId)
                ->where('recipient_id', auth()->id())
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            // Clear DM notifications
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $user->unreadNotifications()
                ->where('type', \App\Notifications\ChatMessageNotification::class)
                ->where('data->project_uuid', $proyecto->uuid)
                ->where('data->sender_id', (int)$recipientId)
                ->delete();
        } else {
            // Mark General messages as read
            if ($proyecto->miembros->contains('id', auth()->id())) {
                $proyecto->miembros()->updateExistingPivot(auth()->id(), [
                    'last_read_at' => now(),
                    'unread_messages_count' => 0 // Reset counter
                ]);
            } else if ($proyecto->user_id === auth()->id()) {
                // If owner is not in pivot, attach them to track read status
                $proyecto->miembros()->attach(auth()->id(), [
                    'rol' => 'admin',
                    'last_read_at' => now(),
                    'unread_messages_count' => 0 // Reset counter
                ]);
            }

            // Also update individual message read status for consistency
            Message::where('proyecto_id', $proyecto->id)
                ->whereNull('recipient_id')
                ->where('user_id', '!=', auth()->id())
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            // NEW: Clear database notifications for this project
            /** @var \App\Models\User $user */
            $user = auth()->user();
            $user->unreadNotifications()
                ->where('type', \App\Notifications\ChatMessageNotification::class)
                ->where('data->project_uuid', $proyecto->uuid)
                ->delete();
        }

        // Broadcast cleanup to other sessions (Mobile/Web)
        /** @var \App\Models\User $authUser */
        $authUser = auth()->user();
        broadcast(new \App\Events\NotificationsCleared($authUser, 'chat_message', $proyecto->uuid))->toOthers();

        return response()->json(['status' => 'success']);
    }

    /**
     * Get unread counts for all channels.
     */
    public function unreadCounts(Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // General Unread
        $generalLastReadAt = null;

        $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
            ->where('proyecto_id', $proyecto->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($pivot) {
            $generalLastReadAt = $pivot->last_read_at;
        }

        $generalUnread = Message::where('proyecto_id', $proyecto->id)
            ->whereNull('recipient_id')
            ->where('user_id', '!=', auth()->id())
            ->when($generalLastReadAt, function ($q) use ($generalLastReadAt) {
                $q->where('created_at', '>', $generalLastReadAt);
            })
            ->count();

        // DMs Unread (grouped by sender)
        $dmUnread = Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', auth()->id())
            ->whereNull('read_at')
            ->selectRaw('user_id, count(*) as count')
            ->groupBy('user_id')
            ->pluck('count', 'user_id');

        // DMs Last Read At (grouped by sender)
        $dmLastReadAt = Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', auth()->id())
            ->whereNotNull('read_at')
            ->selectRaw('user_id, max(read_at) as last_read')
            ->groupBy('user_id')
            ->pluck('last_read', 'user_id');

        return response()->json([
            'general' => $generalUnread,
            'general_last_read_at' => $generalLastReadAt,
            'dms' => $dmUnread,
            'dms_last_read_at' => $dmLastReadAt
        ]);
    }

    /**
     * Search messages in the project.
     */
    public function search(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $request->query('query');
        if (empty($query)) {
            return response()->json(['data' => []]);
        }

        $messages = Message::where('proyecto_id', $proyecto->id)
            ->where('content', 'LIKE', "%{$query}%")
            ->where(function ($q) {
                // Ensure user can only search messages they have access to
                $q->whereNull('recipient_id')
                  ->orWhere('recipient_id', auth()->id())
                  ->orWhere('user_id', auth()->id());
            })
            ->with(['user:id,uuid,name,profile_photo_path', 'recipient:id,uuid,name'])
            ->latest()
            ->paginate(20);

        return response()->json($messages);
    }

    /**
     * Serve a chat file securely.
     */
    public function file(Proyecto $proyecto, Message $message): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        // Authorization: Check if user is a member of the project
        if (!$proyecto->miembros->contains('id', auth()->id()) && $proyecto->user_id !== auth()->id()) {
            abort(403);
        }

        // Security: Ensure message belongs to project and user has access to it
        if ((int) $message->proyecto_id !== (int) $proyecto->id) {
            abort(404);
        }

        // If it's a DM, ensure the user is either the sender or the recipient
        if ($message->recipient_id && (int) $message->recipient_id !== (int) auth()->id() && (int) $message->user_id !== (int) auth()->id()) {
            abort(403);
        }

        if (!$message->file_path || !Storage::disk("local")->exists($message->file_path)) {
            abort(404);
        }

        return response()->file(Storage::disk('local')->path($message->file_path), [
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }
}