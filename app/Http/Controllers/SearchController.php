<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return Inertia::render('SearchResults', [
                'users' => [],
                'projects' => [],
                'query' => '',
            ]);
        }

        try {
            // Search in Users and Projects using Scout/Meilisearch
            $users = User::search($query)->take(10)->get();

            // Append profile_photo_url accessor
            $users->each(function ($user) {
                $user->append('profile_photo_url');
            });

            // Get IDs of projects where the user is an ADMIN (Owner or Admin role)
            $user = auth()->user();
            $adminProjectIds = $user->proyectosPersonales()->pluck('id')
                ->merge($user->proyectos()->wherePivot('rol', 'admin')->pluck('proyectos.id'))
                ->unique()
                ->values()
                ->all();

            // Filter search results by ADMIN access only
            $projects = Proyecto::search($query)
                ->whereIn('id', $adminProjectIds)
                ->take(10)
                ->get();
        } catch (\Exception $e) {
            // If Meilisearch is down or index doesn't exist, fallback to SQL search
            \Log::warning('Search failed, using SQL fallback: ' . $e->getMessage());

            // SQL Fallback for Users
            $users = User::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
                ->take(10)
                ->get();

            $users->each(function ($user) {
                $user->append('profile_photo_url');
            });

            // SQL Fallback for Projects
            $user = auth()->user();
            $adminProjectIds = $user->proyectosPersonales()->pluck('id')
                ->merge($user->proyectos()->wherePivot('rol', 'admin')->pluck('proyectos.id'))
                ->unique()
                ->values()
                ->all();

            $projects = Proyecto::whereIn('id', $adminProjectIds)
                ->where(function ($q) use ($query) {
                    $q->where('nombre', 'like', "%{$query}%")
                        ->orWhere('descripcion', 'like', "%{$query}%");
                })
                ->take(10)
                ->get()
                ->map(function ($project) {
                    return [
                        'id' => $project->id,
                        'nombre' => $project->nombre,
                        'descripcion' => $project->descripcion,
                        'icon' => $project->icon,
                        'color' => $project->color,
                        'image_path' => $project->image_path,
                    ];
                });
        }

        return Inertia::render('SearchResults', [
            'users' => $users,
            'projects' => $projects,
            'query' => $query,
        ]);
    }
}
