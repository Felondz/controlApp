<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proyecto;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class ProjectMessageUiWebController extends Controller
{

    /**
     * List messages for a project.
     */
    public function index(Proyecto $proyecto): JsonResponse
    {
        // Authorization: Check if user is a member of the project
        if (!$proyecto->miembros->contains(auth()->user()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$proyecto->hasMessagingFeature()) {
            return response()->json(['message' => 'Messaging not enabled for this project'], 403);
        }

        $messages = Message::where('proyecto_id', $proyecto->id)
            ->where(function ($query) {
                $query->whereNull('recipient_id') // General messages
                    ->orWhere('recipient_id', auth()->id()) // Private to me
                    ->orWhere('user_id', auth()->id()); // Private from me
            })
            ->with('user:id,name,profile_photo_path', 'recipient:id,name')
            ->latest()
            ->paginate(50);

        return response()->json($messages);
    }

    /**
     * Send a message to a project.
     */
    public function store(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains(auth()->user()) && $proyecto->user_id !== auth()->id()) {
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
     * Mark messages as read.
     */
    public function markAsRead(Proyecto $proyecto): JsonResponse
    {
        if (!$proyecto->miembros->contains(auth()->user()) && $proyecto->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update pivot for general chat (if user is a member via pivot)
        if ($proyecto->miembros->contains(auth()->user())) {
            $proyecto->miembros()->updateExistingPivot(auth()->id(), ['last_read_at' => now()]);
        }

        // Update private messages sent TO me in this project
        Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', auth()->id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['status' => 'success']);
    }
}
