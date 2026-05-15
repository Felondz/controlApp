<?php declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\DatabaseNotification;
use App\Events\NotificationsCleared;

class NotificationController extends Controller
{
    /**
     * Mark a specific notification as read and delete it.
     */
    public function destroy(DatabaseNotification $notification): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        if ($notification->notifiable_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $type = $notification->data['type'] ?? 'generic';
        $projectUuid = $notification->data['project_uuid'] ?? null;

        $notification->delete();

        // Broadcast cleanup to other sessions
        NotificationsCleared::dispatch($user, $type, $projectUuid);

        return response()->json(['status' => 'success']);
    }

    /**
     * Delete all notifications for the authenticated user.
     */
    public function destroyAll(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->notifications()->delete();

        // Broadcast mass cleanup
        NotificationsCleared::dispatch($user, 'all');

        return response()->json([
            'status' => 'success',
            'message' => 'Todas las notificaciones han sido eliminadas.'
        ]);
    }
}
