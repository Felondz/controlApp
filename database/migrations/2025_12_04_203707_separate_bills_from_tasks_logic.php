<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        // 1. Make cuenta_id nullable in transacciones
        Schema::table('transacciones', function (Blueprint $table) {
            $table->foreignId('cuenta_id')->nullable()->change();
        });

        // 2. Migrate Financial Tasks to Transacciones
        $financialTasks = DB::table('tasks')
            ->where('is_financial', true)
            ->get();

        foreach ($financialTasks as $task) {
            if ($task->category_id) {
                DB::table('transacciones')->insert([
                    'proyecto_id' => $task->project_id,
                    'cuenta_id' => null,
                    'categoria_id' => $task->category_id,
                    'user_id' => $task->assigned_to ?? DB::table('users')->first()->id,
                    'monto' => -abs($task->amount * 100),
                    'descripcion' => $task->title,
                    'fecha' => $task->due_date ?? now(),
                    'notas' => $task->description,
                    'status' => 'pending',
                    'created_at' => $task->created_at,
                    'updated_at' => $task->updated_at,
                ]);
            }
        }

        // 3. Remove Financial Fields from Tasks
        DB::table('tasks')->where('is_financial', true)->delete();

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['is_financial', 'amount', 'category_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Restore Tasks Fields
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('is_financial')->default(false)->after('assigned_to');
            $table->decimal('amount', 15, 2)->nullable()->after('is_financial');
            $table->unsignedBigInteger('category_id')->nullable()->after('amount');

            $table->foreign('category_id')
                ->references('id')
                ->on('categorias')
                ->onDelete('set null');
        });

        // 2. Restore Data (Optional/Complex - skipped for now as this is a forward-only refactor)
        // Ideally we would move pending transactions back to tasks, but that's tricky.

        // 3. Revert cuenta_id to required (This will fail if there are nulls, so we'd need to clean up first)
        // Schema::table('transacciones', function (Blueprint $table) {
        //     $table->foreignId('cuenta_id')->nullable(false)->change();
        // });
    }
};
