<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('project_id')->constrained('users')->onDelete('cascade');
        });

        // Seed existing tasks with project owner
        $projects = DB::table('proyectos')->get();
        foreach ($projects as $project) {
            DB::table('tasks')
                ->where('project_id', $project->id)
                ->whereNull('user_id')
                ->update(['user_id' => $project->user_id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
