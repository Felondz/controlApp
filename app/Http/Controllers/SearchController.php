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
            // If Meilisearch is down or index doesn't exist, return empty results
            // Log the error if needed: \Log::error($e->getMessage());
            $users = [];
            $projects = [];
        }

        return Inertia::render('SearchResults', [
            'users' => $users,
            'projects' => $projects,
            'query' => $query,
        ]);
    }
}
