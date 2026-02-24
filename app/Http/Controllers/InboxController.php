<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Proyecto;

class InboxController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $proyectos = $user->proyectos()->get();

        // Si solo tiene uno, lo seleccionamos por defecto
        $selectedProyectoId = $request->query('proyecto_id');
        
        /** @var Proyecto|null $selectedProyecto */
        $selectedProyecto = $selectedProyectoId 
            ? Proyecto::find($selectedProyectoId) 
            : $proyectos->first();

        if ($selectedProyecto && !$selectedProyecto->hasMessagingFeature()) {
            return back()->with('error', 'El proyecto seleccionado no tiene habilitada la mensajería.');
        }

        return Inertia::render('Chat/Inbox', [
            'proyectos' => $proyectos,
            'selectedProyecto' => $selectedProyecto,
            'initialMessages' => $selectedProyecto 
                ? $selectedProyecto->messages()->with('user')->latest()->take(50)->get()->reverse()->values()
                : [],
        ]);
    }

    /**
     * @param Proyecto $proyecto
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function show(Proyecto $proyecto)
    {
        if (!$proyecto->hasMessagingFeature()) {
            return back()->with('error', 'Este proyecto no tiene habilitada la mensajería.');
        }

        return Inertia::render('Chat/Inbox', [
            'selectedProyecto' => $proyecto,
            'initialMessages' => $proyecto->messages()->with('user')->latest()->take(50)->get()->reverse()->values(),
        ]);
    }
}
