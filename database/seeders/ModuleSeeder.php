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
                'description' => 'Control de presupuestos, facturas, gastos e ingresos.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'tasks',
                'name' => 'Tareas y Proyectos',
                'description' => 'Kanban, listas y gestión de colaboradores.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'chat',
                'name' => 'Chat de Equipo',
                'description' => 'Comunicación en tiempo real integrada.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'analytics',
                'name' => 'Analítica Avanzada',
                'description' => 'Reportes detallados y proyecciones IA.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => true, // Coming Soon
            ],
            [
                'key' => 'inventory',
                'name' => 'Inventario',
                'description' => 'Control de stock, productos y almacenes.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'operations',
                'name' => 'Operaciones',
                'description' => 'Gestión de procesos operativos y manufactura.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true,
                'coming_soon' => false,
            ],
            [
                'key' => 'crm',
                'name' => 'Ventas (CRM)',
                'description' => 'Gestión de clientes y oportunidades de venta.',
                'price' => 0.00,
                'is_free' => true,
                'is_active' => true, // Active in DB but coming_soon flag true
                'coming_soon' => true,
            ],
        ];

        foreach ($modules as $module) {
            \App\Models\Module::updateOrCreate(['key' => $module['key']], $module);
        }
    }
}
