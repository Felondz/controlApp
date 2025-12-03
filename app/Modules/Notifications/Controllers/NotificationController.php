<?php

namespace App\Modules\Notifications\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Notifications\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * NotificationController
 * 
 * API endpoints for managing notifications and preferences.
 */
class NotificationController extends Controller
{
    /**
     * Get user's notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->paginate(20);

        return response()->json($notifications);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['status' => 'success']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return response()->json(['status' => 'success']);
    }

    /**
     * Get user's notification preferences.
     */
    public function preferences(Request $request): JsonResponse
    {
        $preferences = NotificationPreference::where('user_id', $request->user()->id)
            ->get();

        return response()->json($preferences);
    }

    /**
     * Update notification preference.
     */
    public function updatePreference(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => 'required|string',
            'channel' => 'required|in:database,mail,broadcast',
            'enabled' => 'required|boolean',
        ]);

        NotificationPreference::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'event_type' => $validated['event_type'],
                'channel' => $validated['channel'],
            ],
            ['enabled' => $validated['enabled']]
        );

        return response()->json(['status' => 'success']);
    }
}
