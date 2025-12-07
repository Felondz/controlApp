<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'key' => 'finance',
                'name' => 'Finanzas',
                'description' => 'Gestión de ingresos, gastos, presupuestos y cuentas.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'tasks',
                'name' => 'Tareas',
                'description' => 'Gestión de tareas, kanban y seguimiento de progreso.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'chat',
                'name' => 'Chat',
                'description' => 'Comunicación en tiempo real.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'analytics',
                'name' => 'Analíticas',
                'description' => 'Reportes detallados y proyecciones (Próximamente).',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => true,
            ],
        ];

        foreach ($modules as $module) {
            \App\Models\Module::updateOrCreate(['key' => $module['key']], $module);
        }
    }
}
