<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search for users and projects.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([
                'users' => [],
                'projects' => [],
                'query' => '',
            ]);
        }

        try {
            // Search in Users using Scout/Meilisearch
            $users = User::search($query)
                ->take(10)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'profile_photo_url' => $user->profile_photo_url,
                    ];
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
                ->get()
                ->map(function ($project) {
                    return [
                        'id' => $project->id,
                        'nombre' => $project->nombre,
                        'description' => $project->description,
                        'icon' => $project->icon,
                        'color' => $project->color,
                    ];
                });
        } catch (\Exception $e) {
            // If Meilisearch is down or index doesn't exist, fallback to SQL search
            \Log::warning('API Search failed, using SQL fallback: ' . $e->getMessage());

            // SQL Fallback for Users
            $users = User::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
                ->take(10)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'profile_photo_url' => $user->profile_photo_url,
                    ];
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

        return response()->json([
            'users' => $users,
            'projects' => $projects,
            'query' => $query,
        ]);
    }
}
