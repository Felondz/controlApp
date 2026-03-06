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
        // 5. Lotes Producción Table
        Schema::table('lotes_produccion', function (Blueprint $table) {
            // idx_lotes_project_stage_status [proyecto_id, stage_id, status] 
            // covers the prefix of lotes_produccion_proyecto_id_status_index [proyecto_id, status]
            // We can drop the latter if we consider the third column (status) in the prefix-search acceptable 
            // or if we optimize further. For now, let's remove the redundancy.
            $table->dropIndex('lotes_produccion_proyecto_id_status_index');
        });

        // 6. Transacciones Table - Review
        // No obvious redundant composites found in the inspection, but we should be careful with 9 indexes.
        // However, they all seem to serve different functional purposes (FKs, polymorphic, etc.)
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lotes_produccion', function (Blueprint $table) {
            $table->index(['proyecto_id', 'status'], 'lotes_produccion_proyecto_id_status_index');
        });
    }
};
