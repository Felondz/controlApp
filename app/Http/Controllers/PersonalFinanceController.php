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
               // Crear proyecto personal si no existe con TODOS los módulos necesarios
               $proyectoPersonal = $user->proyectosPersonales()->create([
                    'nombre' => 'Finanzas Personales',
                    'descripcion' => 'Proyecto personal para gestionar tus finanzas',
                    'es_personal' => true,
                    'visible_en_listado' => false,
                    'modules' => ['finance', 'tasks', 'analytics', 'notifications'],
                    'moneda_default' => 'COP',
               ]);
          } else {
               // Asegurar que tiene todos los módulos necesarios
               $requiredModules = ['finance', 'tasks', 'analytics', 'notifications'];
               $currentModules = $proyectoPersonal->modules ?? [];
               $updated = false;

               foreach ($requiredModules as $module) {
                    if (!in_array($module, $currentModules)) {
                         $currentModules[] = $module;
                         $updated = true;
                    }
               }

               if ($updated) {
                    $proyectoPersonal->update(['modules' => $currentModules]);
               }
          }

          // Redirect to standard project overview route
          return redirect()->route('mis-proyectos.show', $proyectoPersonal->id);
     }
}
