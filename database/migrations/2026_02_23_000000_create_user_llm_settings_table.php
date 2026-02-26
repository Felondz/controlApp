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
        Schema::create('user_llm_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider'); // openai, anthropic, gemini
            $table->text('api_key')->nullable(); // encrypted, optional if is_active is false
            $table->string('default_model')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Un usuario solo debe tener un API key activa por proveedor usualmente
            $table->unique(['user_id', 'provider'], 'user_provider_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_llm_settings');
    }
};
