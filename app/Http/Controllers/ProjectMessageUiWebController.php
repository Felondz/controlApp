<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class ProjectMessageUiWebController extends Controller
{

    /**
     * List messages for a project (filtered by channel).
     */
    public function index(Request $request, Proyecto $mis_proyecto): JsonResponse
    {
        \Illuminate\Support\Facades\Log::info('ProjectMessageUiWebController::index', [
            'user_id' => auth()->id(),
            'project_id' => $mis_proyecto->id,
            'owner_id' => $mis_proyecto->user_id,
            'is_owner' => $mis_proyecto->user_id === auth()->id(),
            'member_ids' => $mis_proyecto->miembros->pluck('id')->toArray(),
            'contains_user' => $mis_proyecto->miembros->contains('id', auth()->id()),
        ]);

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

        $messages = $query->with('user:id,name,profile_photo_path', 'recipient:id,name')
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
            'content' => 'required|string|max:1000',
            'type' => 'nullable|string|in:text,image,file',
            'recipient_id' => 'nullable|exists:users,id',
        ]);

        $message = $mis_proyecto->messages()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'type' => $validated['type'] ?? 'text',
            'recipient_id' => $validated['recipient_id'] ?? null,
        ]);

        // Load user relationship for the response
        $message->load('user:id,name,profile_photo_path', 'recipient:id,name');

        return response()->json($message, 201);
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
        $lastReadAt = null;

        $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
            ->where('proyecto_id', $mis_proyecto->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($pivot) {
            $lastReadAt = $pivot->last_read_at;
        }

        $generalUnread = Message::where('proyecto_id', $mis_proyecto->id)
            ->whereNull('recipient_id')
            ->where('user_id', '!=', auth()->id())
            ->when($lastReadAt, function ($q) use ($lastReadAt) {
                $q->where('created_at', '>', $lastReadAt);
            })
            ->count();

        // DMs Unread (grouped by sender)
        $dmUnread = Message::where('proyecto_id', $mis_proyecto->id)
            ->where('recipient_id', auth()->id())
            ->whereNull('read_at')
            ->selectRaw('user_id, count(*) as count')
            ->groupBy('user_id')
            ->pluck('count', 'user_id');

        return response()->json([
            'general' => $generalUnread,
            'dms' => $dmUnread
        ]);
    }
}
