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
            $table->string('descripcion');
            $table->decimal('monto', 10, 2);
            $table->enum('tipo', ['gasto', 'ingreso'])->default('gasto');
            $table->string('categoria')->nullable();
            $table->date('fecha');
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transacciones');
    }
}

return new CreateTransaccionesTable();
