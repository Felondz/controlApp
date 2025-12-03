<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonalFinanceController extends Controller
{
     /**
      * Muestra el dashboard de finanzas personales.
      */
     public function index(Request $request)
     {
          $user = $request->user();

          // Obtener proyecto personal
          $proyectoPersonal = $user->proyectosPersonales()
               ->where('es_personal', true)
               ->first();

          if (!$proyectoPersonal) {
               // Crear proyecto personal si no existe
               $proyectoPersonal = $user->proyectosPersonales()->create([
                    'nombre' => 'Finanzas Personales',
                    'descripcion' => 'Proyecto personal para gestionar tus finanzas',
                    'es_personal' => true,
                    'visible_en_listado' => false,
                    'modules' => ['finance'],
                    'moneda_default' => 'COP',
               ]);
          }

          // Redireccionar al dashboard financiero del proyecto
          return redirect()->route('mis-proyectos.finance', $proyectoPersonal->id);
     }
}
