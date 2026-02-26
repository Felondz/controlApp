<?php

namespace App\Observers;

use App\Models\Proyecto;
use App\Modules\Finance\Models\Categoria;

class ProyectoObserver
{
    /**
     * Handle the Proyecto "created" event.
     * Automatically create default categories for new projects.
     */
    public function created(Proyecto $proyecto): void
    {
        // Default categories for all projects
        $defaultCategories = [
            // Income
            ['nombre' => 'Ingreso General', 'tipo' => 'ingreso'],
            ['nombre' => 'Salario', 'tipo' => 'ingreso'],

            // Expenses
            ['nombre' => 'Facturas y Servicios', 'tipo' => 'gasto'],
            ['nombre' => 'Alimentación', 'tipo' => 'gasto'],
            ['nombre' => 'Transporte', 'tipo' => 'gasto'],
            ['nombre' => 'Hogar', 'tipo' => 'gasto'],
            ['nombre' => 'Entretenimiento', 'tipo' => 'gasto'],
            ['nombre' => 'Salud', 'tipo' => 'gasto'],
            ['nombre' => 'Educación', 'tipo' => 'gasto'],
            ['nombre' => 'Otros Gastos', 'tipo' => 'gasto'],
        ];

        foreach ($defaultCategories as $category) {
            Categoria::create([
                'proyecto_id' => $proyecto->id,
                'nombre' => $category['nombre'],
                'tipo' => $category['tipo'],
            ]);
        }
    }
}
