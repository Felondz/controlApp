<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proyecto;
use App\Models\Categoria;

class FixProjectCategoriesSeeder extends Seeder
{
    public function run()
    {
        $proyecto = Proyecto::find(3);

        if (!$proyecto) {
            $this->command->info("Project 3 not found.");
            return;
        }

        $count = Categoria::where('proyecto_id', $proyecto->id)->count();
        $this->command->info("Project 3 has {$count} categories.");

        if ($count === 0) {
            $this->command->info("Creating default categories for Project 3...");

            $categories = [
                ['nombre' => 'Ingreso General', 'tipo' => 'ingreso', 'icono' => 'BanknotesIcon', 'color' => 'text-green-500'],
                ['nombre' => 'Transporte', 'tipo' => 'gasto', 'icono' => 'TruckIcon', 'color' => 'text-blue-500'],
                ['nombre' => 'Alimentación', 'tipo' => 'gasto', 'icono' => 'ShoppingBagIcon', 'color' => 'text-orange-500'],
                ['nombre' => 'Hogar', 'tipo' => 'gasto', 'icono' => 'HomeIcon', 'color' => 'text-purple-500'],
                ['nombre' => 'Facturas y Servicios', 'tipo' => 'gasto', 'icono' => 'BoltIcon', 'color' => 'text-yellow-500'],
                ['nombre' => 'Entretenimiento', 'tipo' => 'gasto', 'icono' => 'TicketIcon', 'color' => 'text-pink-500'],
                ['nombre' => 'Salud', 'tipo' => 'gasto', 'icono' => 'HeartIcon', 'color' => 'text-red-500'],
                ['nombre' => 'Educación', 'tipo' => 'gasto', 'icono' => 'BookOpenIcon', 'color' => 'text-indigo-500'],
                ['nombre' => 'Otros Gastos', 'tipo' => 'gasto', 'icono' => 'EllipsisVerticalIcon', 'color' => 'text-gray-500'],
            ];

            foreach ($categories as $cat) {
                Categoria::create([
                    'proyecto_id' => $proyecto->id,
                    'nombre' => $cat['nombre'],
                    'tipo' => $cat['tipo'],
                    'icono' => $cat['icono'],
                    'color' => $cat['color'],
                ]);
            }

            $this->command->info("Categories created successfully.");
        } else {
            $this->command->info("Categories already exist. No action taken.");
        }
    }
}
