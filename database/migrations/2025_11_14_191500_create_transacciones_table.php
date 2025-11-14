<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransaccionesTable extends Migration
{
    public function up()
    {
        Schema::create('transacciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proyecto_id')->constrained()->onDelete('cascade');
            $table->foreignId('cuenta_id')->constrained()->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Quién la registró

            $table->bigInteger('monto'); // Positivo (ingreso) o Negativo (gasto)
            $table->string('descripcion')->nullable();
            $table->timestamp('fecha'); // Cuándo ocurrió
            $table->text('notas')->nullable();
            $table->timestamps(); // Cuándo se registró
        });
    }

    public function down()
    {
        Schema::dropIfExists('transacciones');
    }
}

return new CreateTransaccionesTable();
