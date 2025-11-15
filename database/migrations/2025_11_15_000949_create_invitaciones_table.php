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
        Schema::create('invitaciones', function (Blueprint $table) {
            $table->id();

            // A qué proyecto se le está invitando
            $table->foreignId('proyecto_id')->constrained()->onDelete('cascade');

            // A quién se invita (guardamos el email)
            $table->string('email')->index();

            // Qué rol tendrá si acepta
            $table->string('rol')->default('miembro');

            // El token secreto para el enlace de invitación
            $table->string('token')->unique();

            // (Opcional, pero buena idea) Cuándo expira la invitación
            $table->timestamp('expires_at')->nullable();

            $table->timestamps(); // Cuándo se creó la invitación
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitaciones');
    }
};
