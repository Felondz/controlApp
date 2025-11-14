<?php

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
        Schema::create('cuentas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Ej: "Visa Personal", "Cuenta Empresa"
            $table->string('banco')->nullable(); // Ej: "Bancolombia"
            $table->enum('tipo', ['efectivo', 'banco', 'credito', 'otro']);
            $table->bigInteger('balance_inicial')->default(0); // En centavos

            // 'propietario_id' y 'propietario_type'
            $table->morphs('propietario');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuentas');
    }
};
