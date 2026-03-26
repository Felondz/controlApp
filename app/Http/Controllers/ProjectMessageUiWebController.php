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

class ProjectMessageUiWebController extends Controller
{

    /**
     * List messages for a project (filtered by channel).
     */
    public function index(Request $request, Proyecto $mis_proyecto): JsonResponse
    {
        // Authorization: Check if user is a member of the project
        if (!$mis_proyecto->miembros->contains('id', auth()->id()) && $mis_proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$mis_proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $recipientId = $request->query('recipient_id');
        $query = Message::where('proyecto_id', $mis_proyecto->id);

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

        $messages = $query->with(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent.user:id,name'])
            ->latest()
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Send a message to a project.
     */
    public function store(Request $request, Proyecto $mis_proyecto): JsonResponse
    {
        if (!$mis_proyecto->miembros->contains('id', auth()->id()) && $mis_proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$mis_proyecto->hasMessagingFeature()) {
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
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;
            $filePath = $file->storeAs('chat/' . $mis_proyecto->id, $filename, 'public');
            
            if (str_starts_with($file->getMimeType(), 'image/')) {
                $type = 'image';
            } else {
                $type = 'file';
            }
            
            if (empty($validated['content'])) {
                $validated['content'] = $file->getClientOriginalName();
            }
        }

        $message = $mis_proyecto->messages()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'type' => $type,
            'recipient_id' => $validated['recipient_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'file_path' => $filePath,
        ]);

        $message->load(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent.user:id,name']);

        // Dispatch el evento para WebSockets
        \App\Modules\Chat\Events\MessageSent::dispatch($message);

        return response()->json($message, 201);
    }

    /**
     * Update a message (edit content).
     */
    public function update(Request $request, Proyecto $mis_proyecto, Message $message): JsonResponse
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

        $message->load(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent.user:id,name']);

        MessageUpdated::dispatch($message);

        return response()->json($message);
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, Proyecto $mis_proyecto, Message $message): JsonResponse
    {
        if ($message->user_id !== auth()->id() && !$request->user()->esAdminDe($mis_proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messageId = $message->id;
        $proyectoId = $mis_proyecto->id;

        $message->delete();

        MessageDeleted::dispatch($messageId, $proyectoId);

        return response()->json(['status' => 'success']);
    }

    /**
     * Toggle a reaction on a message.
     */
    public function toggleReaction(Request $request, Proyecto $mis_proyecto, Message $message): JsonResponse
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
        $message->load(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent.user:id,name']);

        MessageUpdated::dispatch($message);

        return response()->json($message);
    }

    /**
     * Mark messages as read (channel specific).
     */
    public function markAsRead(Request $request, Proyecto $mis_proyecto): JsonResponse
    {
        if (!$mis_proyecto->miembros->contains('id', auth()->id()) && $mis_proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $recipientId = $request->input('recipient_id');

        if ($recipientId) {
            // Mark DMs from this user as read
            Message::where('proyecto_id', $mis_proyecto->id)
                ->where('user_id', $recipientId)
                ->where('recipient_id', auth()->id())
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        } else {
            // Mark General messages as read
            if ($mis_proyecto->miembros->contains('id', auth()->id())) {
                $mis_proyecto->miembros()->updateExistingPivot(auth()->id(), [
                    'last_read_at' => now(),
                    'unread_messages_count' => 0 // Reset counter
                ]);
            } else if ($mis_proyecto->user_id === auth()->id()) {
                // If owner is not in pivot, attach them to track read status
                $mis_proyecto->miembros()->attach(auth()->id(), [
                    'rol' => 'admin',
                    'last_read_at' => now(),
                    'unread_messages_count' => 0 // Reset counter
                ]);
            }

            // Also update individual message read status for consistency
            Message::where('proyecto_id', $mis_proyecto->id)
                ->whereNull('recipient_id')
                ->where('user_id', '!=', auth()->id())
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Get unread counts for all channels.
     */
    public function unreadCounts(Proyecto $mis_proyecto): JsonResponse
    {
        if (!$mis_proyecto->miembros->contains('id', auth()->id()) && $mis_proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // General Unread
        $generalLastReadAt = null;

        $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
            ->where('proyecto_id', $mis_proyecto->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($pivot) {
            $generalLastReadAt = $pivot->last_read_at;
        }

        $generalUnread = Message::where('proyecto_id', $mis_proyecto->id)
            ->whereNull('recipient_id')
            ->where('user_id', '!=', auth()->id())
            ->when($generalLastReadAt, function ($q) use ($generalLastReadAt) {
                $q->where('created_at', '>', $generalLastReadAt);
            })
            ->count();

        // DMs Unread (grouped by sender)
        $dmUnread = Message::where('proyecto_id', $mis_proyecto->id)
            ->where('recipient_id', auth()->id())
            ->whereNull('read_at')
            ->selectRaw('user_id, count(*) as count')
            ->groupBy('user_id')
            ->pluck('count', 'user_id');

        // DMs Last Read At (grouped by sender)
        $dmLastReadAt = Message::where('proyecto_id', $mis_proyecto->id)
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
    public function search(Request $request, Proyecto $mis_proyecto): JsonResponse
    {
        if (!$mis_proyecto->miembros->contains('id', auth()->id()) && $mis_proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $request->query('query');
        if (empty($query)) {
            return response()->json(['data' => []]);
        }

        $messages = Message::where('proyecto_id', $mis_proyecto->id)
            ->where('content', 'LIKE', "%{$query}%")
            ->where(function ($q) {
                // Ensure user can only search messages they have access to
                $q->whereNull('recipient_id')
                  ->orWhere('recipient_id', auth()->id())
                  ->orWhere('user_id', auth()->id());
            })
            ->with(['user:id,name,profile_photo_path', 'recipient:id,name'])
            ->latest()
            ->paginate(20);

        return response()->json($messages);
    }
}