<?php

namespace App\Modules\Chat\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Chat\Models\Message;
use Illuminate\Http\Request;
use App\Core\Events\ModuleEventBus;
use App\Modules\Chat\Events\MessageSent;
use App\Modules\Chat\Events\MessageRead;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * List messages for a project.
     */
    /**
     * List messages for a project.
     */
    public function index(Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$proyecto->miembros->contains($user) && $proyecto->user_id !== $user->id) {
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
        /** @var \App\Models\User $user */
        $user = $request->user();
        if (!$proyecto->miembros->contains($user) && $proyecto->user_id !== $user->id) {
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

        $message = Message::create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $user->id,
            'recipient_id' => $validated['recipient_id'] ?? null,
            'content' => $validated['content'],
            'type' => $validated['type'] ?? 'text',
            'read_at' => null, // New messages are unread
        ]);

        // Dispatch MessageSent event
        MessageSent::dispatch($message);

        // Load user relationship for the response
        $message->load('user:id,name,profile_photo_path', 'recipient:id,name');

        return response()->json($message, 201);
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        if (!$proyecto->miembros->contains($user) && $proyecto->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update pivot for general chat (if user is a member via pivot)
        if ($proyecto->miembros->contains($user)) {
            $proyecto->miembros()->updateExistingPivot($user->id, ['last_read_at' => now()]);
        }

        // Update private messages sent TO me in this project
        $messages = Message::where('proyecto_id', $proyecto->id)
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->get();

        foreach ($messages as $message) {
            $message->update(['read_at' => now()]);

            // Dispatch MessageRead event for each message
            MessageRead::dispatch($message);
        }

        return response()->json(['status' => 'success']);
    }
}
