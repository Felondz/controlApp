<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicUserProfileController extends Controller
{
    /**
     * Display the public profile of a user.
     */
    public function show(Request $request, User $user)
    {
        // Get projects where the current user is an admin (to allow invitation)
        $currentUser = $request->user();

        $adminProjects = $currentUser->proyectos()
            ->wherePivot('rol', 'admin')
            ->whereNull('proyectos.deleted_at')
            ->get();

        $ownedProjects = $currentUser->proyectosPersonales()
            ->whereNull('proyectos.deleted_at')
            ->get();

        $myProjects = $adminProjects->merge($ownedProjects)->unique('id')->values();

        return Inertia::render('Users/Show', [
            'userProfile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_url' => $user->profile_photo_url,
                'created_at' => $user->created_at,
            ],
            'myProjects' => $myProjects,
        ]);
    }
}
