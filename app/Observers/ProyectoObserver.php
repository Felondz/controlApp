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
            ['nombre' => 'Ingreso General', 'tipo' => 'ingreso', 'icono' => 'BanknotesIcon', 'color' => 'text-green-500'],
            ['nombre' => 'Salario', 'tipo' => 'ingreso', 'icono' => 'CurrencyDollarIcon', 'color' => 'text-green-600'],

            // Expenses
            ['nombre' => 'Facturas y Servicios', 'tipo' => 'gasto', 'icono' => 'BoltIcon', 'color' => 'text-yellow-500'],
            ['nombre' => 'Alimentación', 'tipo' => 'gasto', 'icono' => 'ShoppingBagIcon', 'color' => 'text-orange-500'],
            ['nombre' => 'Transporte', 'tipo' => 'gasto', 'icono' => 'TruckIcon', 'color' => 'text-blue-500'],
            ['nombre' => 'Hogar', 'tipo' => 'gasto', 'icono' => 'HomeIcon', 'color' => 'text-purple-500'],
            ['nombre' => 'Entretenimiento', 'tipo' => 'gasto', 'icono' => 'TicketIcon', 'color' => 'text-pink-500'],
            ['nombre' => 'Salud', 'tipo' => 'gasto', 'icono' => 'HeartIcon', 'color' => 'text-red-500'],
            ['nombre' => 'Educación', 'tipo' => 'gasto', 'icono' => 'BookOpenIcon', 'color' => 'text-indigo-500'],
            ['nombre' => 'Otros Gastos', 'tipo' => 'gasto', 'icono' => 'EllipsisVerticalIcon', 'color' => 'text-gray-500'],
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
