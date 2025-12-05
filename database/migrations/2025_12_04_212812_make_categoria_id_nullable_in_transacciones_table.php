<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('transacciones', function (Blueprint $table) {
            $table->foreignId('categoria_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('transacciones', function (Blueprint $table) {
            // Reverting is tricky if there are nulls, but for now we assume we can revert to non-nullable
            // Ideally we would fill nulls with a default before reverting
            $table->foreignId('categoria_id')->nullable(false)->change();
        });
    }
};
