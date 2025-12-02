<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Fetch projects with unread messages
        $projects = $user->proyectos()
            ->get()
            ->map(function ($proyecto) use ($user) {
                if (!$proyecto->hasMessagingFeature()) {
                    $proyecto->unread_count = 0;
                    return $proyecto;
                }

                $pivot = $proyecto->pivot;
                $lastReadAt = $pivot ? $pivot->last_read_at : null;

                $generalUnread = $proyecto->messages()
                    ->whereNull('recipient_id')
                    ->where('user_id', '!=', $user->id)
                    ->when($lastReadAt, function ($q) use ($lastReadAt) {
                        $q->where('created_at', '>', $lastReadAt);
                    })
                    ->count();

                $privateUnread = $proyecto->messages()
                    ->where('recipient_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                $proyecto->unread_count = $generalUnread + $privateUnread;
                return $proyecto;
            })
            ->filter(function ($proyecto) {
                return $proyecto->unread_count > 0;
            })
            ->values();

        return Inertia::render('Inbox/Index', [
            'projects' => $projects
        ]);
    }
}
