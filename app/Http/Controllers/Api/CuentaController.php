<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cuenta;
use App\Models\Proyecto; // modelo Proyecto
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // para validar el ENUM!


class CuentaController extends Controller
{
    /**
     * Muestra las cuentas de un proyecto específico.
     * GET /api/proyectos/{proyecto}/cuentas
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Devolvemos las cuentas que pertenecen A ESTE PROYECTO
        // Usamos la relación 'cuentas' que definimos en el Modelo Proyecto
        return response()->json($proyecto->cuentas);

        // NOTA: Para obtener las cuentas PERSONALES del usuario:
        // $cuentasPersonales = Auth::user()->cuentas;
    }

    /**
     * Almacena una nueva cuenta en un proyecto.
     * POST /api/proyectos/{proyecto}/cuentas
     */
    public function store(Request $request, Proyecto $proyecto)
    {
        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // 1. Validar la entrada
        $datosValidados = $request->validate([
            'nombre' => 'required|string|max:255',
            'banco' => 'nullable|string|max:255',
            'balance_inicial' => 'required|numeric', // El frontend debe enviar 0 si no hay
            'tipo' => [
                'required',
                'string',
                //validacion ENUM para el tipo de cuenta
                Rule::in(['efectivo', 'banco', 'credito', 'otro']),
            ],
        ]);

        // 2. Crear la cuenta usando la relación polimórfica
        // Esto automáticamente rellena 'propietario_id' y 'propietario_type'
        $cuenta = $proyecto->cuentas()->create($datosValidados);

        // 3. Devolver la cuenta recién creada
        return response()->json($cuenta, 201); // 201 = Creado
    }

    // ... (los otros métodos show, update, destroy los haremos después)
}
