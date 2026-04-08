<?php

namespace App\Modules\Chat\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Chat\Models\Message;
use Illuminate\Http\Request;
use App\Core\Events\ModuleEventBus;
use App\Modules\Chat\Events\MessageSent;
use App\Modules\Chat\Events\MessageRead;
use App\Modules\Chat\Events\MessageUpdated;
use App\Modules\Chat\Events\MessageDeleted;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
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
            ->with(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent'])
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
            $filePath = $file->storeAs('chat/' . $proyecto->id, $filename, 'public');
            
            $mimeType = (string)$file->getMimeType();
            if (str_starts_with($mimeType, 'image/')) {
                $type = 'image';
            } else {
                $type = 'file';
            }
            
            // Si el contenido está vacío pero hay archivo, asignamos el nombre del archivo
            if (empty($validated['content'])) {
                $validated['content'] = $file->getClientOriginalName();
            }
        }

        $message = Message::create([
            'proyecto_id' => $proyecto->id,
            'user_id' => $user->id,
            'recipient_id' => $validated['recipient_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'content' => $validated['content'],
            'type' => $type,
            'file_path' => $filePath,
            'read_at' => null, // New messages are unread
        ]);

        // Load relationships for the response and event
        $message->load(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent']);

        // Dispatch MessageSent event to others
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    /**
     * Update a message (edit content).
     */
    public function update(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        if ($message->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $message->update([
            'content' => $validated['content'],
            'is_edited' => true,
        ]);

        $message->load(['user:id,name,profile_photo_path', 'recipient:id,name', 'parent']);
        
        // Dispatch MessageUpdated event to others
        broadcast(new MessageUpdated($message))->toOthers();

        return response()->json($message);
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        if ($message->user_id !== $user->id && !$user->esAdminDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messageId = $message->id;
        $message->delete();
        
        // Dispatch MessageDeleted event to others
        broadcast(new MessageDeleted($messageId, $proyecto->id))->toOthers();

        return response()->json(['status' => 'success']);
    }

    /**
     * Toggle a reaction on a message.
     */
    public function toggleReaction(Request $request, Proyecto $proyecto, Message $message): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        
        $validated = $request->validate([
            'emoji' => 'required|string|max:10',
        ]);

        $emoji = $validated['emoji'];
        $reactions = $message->reactions ?? [];

        if (!isset($reactions[$emoji])) {
            $reactions[$emoji] = [];
        }

        $userIdStr = (string)$user->id;
        $userIndex = array_search($userIdStr, $reactions[$emoji]);

        if ($userIndex !== false) {
            // Remove reaction
            unset($reactions[$emoji][$userIndex]);
            $reactions[$emoji] = array_values($reactions[$emoji]); // reindex
            if (empty($reactions[$emoji])) {
                unset($reactions[$emoji]);
            }
        } else {
            // Add reaction
            $reactions[$emoji][] = $userIdStr;
        }

        $message->update(['reactions' => empty($reactions) ? null : $reactions]);
        
        // Dispatch MessageUpdated event (which includes reactions) to others
        broadcast(new MessageUpdated($message))->toOthers();

        return response()->json($message);
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
