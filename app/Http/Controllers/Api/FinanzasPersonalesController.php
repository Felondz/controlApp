<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FinanzasPersonalesController extends Controller
{
    /**
     * Obtiene el proyecto de finanzas personales del usuario autenticado.
     */
    public function show(Request $request)
    {
        $usuario = $request->user();

        /** @var \App\Models\Proyecto|null $financierPersonal */
        $financierPersonal = $usuario->proyectosPersonales()
            ->where('es_personal', true)
            ->first();

        if (!$financierPersonal) {
            return response()->json([
                'message' => 'No se encontró tu proyecto de finanzas personales.'
            ], 404);
        }

        return response()->json($financierPersonal->load('cuentas', 'categorias', 'transacciones'));
    }

    /**
     * Obtiene las transacciones del proyecto personal.
     */
    public function transacciones(Request $request)
    {
        $usuario = $request->user();

        /** @var \App\Models\Proyecto|null $proyectoPersonal */
        $proyectoPersonal = $usuario->proyectosPersonales()
            ->where('es_personal', true)
            ->first();

        if (!$proyectoPersonal) {
            return response()->json([
                'message' => 'No se encontró tu proyecto de finanzas personales.'
            ], 404);
        }

        $transacciones = $proyectoPersonal->transacciones()->get();
        return response()->json($transacciones);
    }

    /**
     * Obtiene las cuentas del proyecto personal.
     */
    public function cuentas(Request $request)
    {
        $usuario = $request->user();

        /** @var \App\Models\Proyecto|null $proyectoPersonal */
        $proyectoPersonal = $usuario->proyectosPersonales()
            ->where('es_personal', true)
            ->first();

        if (!$proyectoPersonal) {
            return response()->json([
                'message' => 'No se encontró tu proyecto de finanzas personales.'
            ], 404);
        }

        // Return both owned accounts and linked accounts
        $owned = $proyectoPersonal->cuentas()->get();
        $linked = $proyectoPersonal->cuentasAsociadas()->get();
        $cuentas = $owned->merge($linked);

        return response()->json($cuentas);
    }
    /**
     * Obtiene las categorías del proyecto personal.
     */
    public function categorias(Request $request)
    {
        $usuario = $request->user();

        /** @var \App\Models\Proyecto|null $proyectoPersonal */
        $proyectoPersonal = $usuario->proyectosPersonales()
            ->where('es_personal', true)
            ->first();

        if (!$proyectoPersonal) {
            return response()->json([
                'message' => 'No se encontró tu proyecto de finanzas personales.'
            ], 404);
        }

        $categorias = $proyectoPersonal->categorias()->get();
        return response()->json($categorias);
    }
}
