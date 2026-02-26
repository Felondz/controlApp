<?php declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tasks Module
        Schema::table('tasks', function (Blueprint $table) {
            $indexes = collect(Schema::getIndexes('tasks'))->pluck('name')->toArray();
            
            if (!in_array('idx_tasks_project_status', $indexes)) {
                $table->index(['project_id', 'status'], 'idx_tasks_project_status');
            }
            if (!in_array('idx_tasks_assigned_status', $indexes)) {
                $table->index(['assigned_to', 'status'], 'idx_tasks_assigned_status');
            }
        });

        // Chat Module
        Schema::table('messages', function (Blueprint $table) {
            $indexes = collect(Schema::getIndexes('messages'))->pluck('name')->toArray();
            if (!in_array('idx_messages_proyecto_date', $indexes)) {
                $table->index(['proyecto_id', 'created_at'], 'idx_messages_proyecto_date');
            }
        });

        // Inventory Module
        Schema::table('inventory_items', function (Blueprint $table) {
            $indexes = collect(Schema::getIndexes('inventory_items'))->pluck('name')->toArray();
            if (!in_array('idx_inv_items_project_type_active', $indexes)) {
                $table->index(['proyecto_id', 'type', 'is_active'], 'idx_inv_items_project_type_active');
            }
        });

        Schema::table('inventory_transactions', function (Blueprint $table) {
            $indexes = collect(Schema::getIndexes('inventory_transactions'))->pluck('name')->toArray();
            if (!in_array('idx_inv_trans_item_status_date', $indexes)) {
                $table->index(['inventory_item_id', 'status', 'transaction_date'], 'idx_inv_trans_item_status_date');
            }
        });

        // Operations Module
        Schema::table('lotes_produccion', function (Blueprint $table) {
            $indexes = collect(Schema::getIndexes('lotes_produccion'))->pluck('name')->toArray();
            if (!in_array('idx_lotes_project_stage_status', $indexes)) {
                $table->index(['proyecto_id', 'stage_id', 'status'], 'idx_lotes_project_stage_status');
            }
        });

        // Bug Reports
        if (Schema::hasTable('bug_reports')) {
            Schema::table('bug_reports', function (Blueprint $table) {
                $indexes = collect(Schema::getIndexes('bug_reports'))->pluck('name')->toArray();
                if (!in_array('idx_bug_reports_status', $indexes)) {
                    $table->index(['status'], 'idx_bug_reports_status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex('idx_tasks_project_status');
            $table->dropIndex('idx_tasks_assigned_status');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex('idx_messages_proyecto_date');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropIndex('idx_inv_items_project_type_active');
        });

        Schema::table('inventory_transactions', function (Blueprint $table) {
            $table->dropIndex('idx_inv_trans_item_status_date');
        });

        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->dropIndex('idx_lotes_project_stage_status');
        });

        if (Schema::hasTable('bug_reports')) {
            Schema::table('bug_reports', function (Blueprint $table) {
                $table->dropIndex('idx_bug_reports_status');
            });
        }
    }
};
