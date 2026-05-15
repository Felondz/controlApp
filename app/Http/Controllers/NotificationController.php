<?php declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    /**
     * Mark a specific notification as read and delete it (as per user request).
     */
    public function destroy(DatabaseNotification $notification): RedirectResponse
    {
        $notification->delete();

        return back();
    }

    /**
     * Delete all notifications for the authenticated user.
     */
    public function destroyAll(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->notifications()->delete();

        return back()->with('success', 'Todas las notificaciones han sido eliminadas.');
    }
}
