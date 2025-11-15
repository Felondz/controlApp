<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Proyecto;

class DashboardController extends Controller
{
    /**
     * Muestra las estadísticas principales del Súper Admin.
     * (Este método se llamará 'index' para que funcione con apiResource si queremos)
     */
    public function index(Request $request)
    {
        // En el futuro, aquí habrá consultas complejas.
        // Por ahora, solo confirmamos el acceso.
        $totalUsuarios = User::count();
        $totalProyectos = Proyecto::count();

        return response()->json([
            'message' => '¡Bienvenido, Súper Admin! Acceso concedido.',
            'usuario_autenticado' => $request->user()->name,
            'estadisticas' => [
                'total_usuarios_registrados' => $totalUsuarios,
                'total_proyectos_creados' => $totalProyectos,
            ]
        ]);
    }
}
