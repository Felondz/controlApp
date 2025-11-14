<?php


namespace App\Features\Finanzas\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto; // modelo del Núcleo
use App\Models\Transaccion; // modelo del Núcleo
use Illuminate\Http\Request;
use App\Features\Finanzas\Requests\StoreTransaccionRequest;
use App\Features\Finanzas\Requests\UpdateTransaccionRequest;

class TransaccionController extends Controller
{
    /**
     * Muestra las transacciones de un proyecto específico.
     * GET /api/proyectos/{proyecto}/transacciones
     */
    public function index(Request $request, Proyecto $proyecto)
    {

        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Devolvemos las transacciones del proyecto.
        // Usamos with() para cargar las relaciones 
        $transacciones = $proyecto->transacciones()
            ->with('categoria', 'cuenta') // Carga la info de la categoría y la cuenta
            ->orderBy('fecha', 'desc') // Ordena por fecha
            ->get();

        return response()->json($transacciones);
    }

    /**
     * Almacena una nueva transacción en un proyecto.
     * POST /api/proyectos/{proyecto}/transacciones
     */

    public function store(StoreTransaccionRequest $request, Proyecto $proyecto)
    {
        // AUTORIZACIÓN
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para añadir transacciones a este proyecto.');

        // Obtenemos los datos validados del Request
        $datosValidados = $request->validated();

        // Añadimos los IDs que faltan (el proyecto y quién la registró)
        $datosCompletos = array_merge($datosValidados, [
            'proyecto_id' => $proyecto->id,
            'user_id' => $request->user()->id, // El ID del usuario autenticado
        ]);

        // Creamos la transacción
        $transaccion = Transaccion::create($datosCompletos);

        // Devolvemos la transacción (cargando sus relaciones)
        return response()->json($transaccion->load('categoria', 'cuenta'), 201);
    }

    /**
     * Muestra una transacción específica.
     * GET /api/proyectos/{proyecto}/transacciones/{transaccion}
     */

    public function show(Request $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // AUTORIZACIÓN
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // VERIFICACIÓN EXTRA
        // Asegurarse que la transacción realmente pertenece a este proyecto
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404); // No encontrada
        }

        // Devolvemos la transacción con sus relaciones
        return response()->json($transaccion->load('categoria', 'cuenta'));
    }

    /**
     * Actualiza una transacción específica.
     * usamos UpdateTransaccionRequest
     */
    public function update(UpdateTransaccionRequest $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Verificación Extra
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // 1. Obtiene los datos validados (del UpdateTransaccionRequest)
        $datosValidados = $request->validated();

        // 2. Actualiza la transacción
        $transaccion->update($datosValidados);

        // 3. Devuelve la transacción actualizada
        return response()->json($transaccion->load('categoria', 'cuenta'));
    }
    /**
     * Elimina una transacción específica.
     */
    public function destroy(Request $request, Proyecto $proyecto, Transaccion $transaccion)
    {
        // Autorización
        abort_if(!$request->user()->esMiembroDe($proyecto), 403, 'No tienes permiso para eliminar en este proyecto.');

        // Verificación Extra
        if ($transaccion->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // 1. Elimina la transacción
        $transaccion->delete();

        // 2. Devuelve una respuesta vacía (204 No Content)
        return response()->noContent();
    }
}
