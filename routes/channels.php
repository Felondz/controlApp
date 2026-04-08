<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('project.{projectId}.chat', function ($user, $projectId) {
    /** @var \App\Models\Proyecto|null $proyecto */
    $proyecto = \App\Models\Proyecto::find($projectId);
    
    if (!$proyecto instanceof \App\Models\Proyecto) {
        return false;
    }

    // Check if user is the owner or a member of the project
    $isMember = $proyecto->user_id === $user->id || $proyecto->miembros->contains($user);

    if ($isMember) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'profile_photo_url' => $user->profile_photo_url ?? null,
        ];
    }

    return false;
});
