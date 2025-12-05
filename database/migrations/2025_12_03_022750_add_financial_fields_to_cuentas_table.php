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
        Schema::table('cuentas', function (Blueprint $table) {
            // Common fields for all account types
            if (!Schema::hasColumn('cuentas', 'moneda')) {
                $table->string('moneda', 3)->default('USD')->after('tipo');
            }
            if (!Schema::hasColumn('cuentas', 'descripcion')) {
                $table->text('descripcion')->nullable()->after('banco');
            }
            if (!Schema::hasColumn('cuentas', 'color')) {
                $table->string('color', 20)->default('#3b82f6')->after('descripcion');
            }
            if (!Schema::hasColumn('cuentas', 'icono')) {
                $table->string('icono', 50)->default('wallet')->after('color');
            }
            
            // Credit card specific fields
            if (!Schema::hasColumn('cuentas', 'tasa_interes_anual')) {
                $table->decimal('tasa_interes_anual', 8, 4)->nullable()->after('balance_inicial');
            }
            if (!Schema::hasColumn('cuentas', 'fecha_vencimiento')) {
                $table->date('fecha_vencimiento')->nullable()->after('tasa_interes_anual');
            }
            if (!Schema::hasColumn('cuentas', 'dia_corte')) {
                $table->tinyInteger('dia_corte')->unsigned()->nullable()->after('fecha_vencimiento');
            }
            if (!Schema::hasColumn('cuentas', 'dia_pago')) {
                $table->tinyInteger('dia_pago')->unsigned()->nullable()->after('dia_corte');
            }
            if (!Schema::hasColumn('cuentas', 'limite_credito')) {
                $table->bigInteger('limite_credito')->default(0)->after('dia_pago');
            }
            
            // Savings/Investment specific fields
            if (!Schema::hasColumn('cuentas', 'tasa_interes')) {
                $table->decimal('tasa_interes', 8, 4)->nullable()->after('limite_credito');
            }
            if (!Schema::hasColumn('cuentas', 'fecha_interes')) {
                $table->date('fecha_interes')->nullable()->after('tasa_interes');
            }
            if (!Schema::hasColumn('cuentas', 'capitalizable')) {
                $table->boolean('capitalizable')->default(false)->after('fecha_interes');
            }
            if (!Schema::hasColumn('cuentas', 'periodo_capitalizacion')) {
                $table->enum('periodo_capitalizacion', ['diario', 'mensual', 'trimestral', 'semestral', 'anual'])
                    ->nullable()
                    ->after('capitalizable');
            }
            
            // Rename balance_inicial to saldo_inicial for consistency if it exists
            if (Schema::hasColumn('cuentas', 'balance_inicial') && !Schema::hasColumn('cuentas', 'saldo_inicial')) {
                $table->renameColumn('balance_inicial', 'saldo_inicial');
            }
            
            // Add current balance field if it doesn't exist
            if (!Schema::hasColumn('cuentas', 'saldo_actual')) {
                $table->bigInteger('saldo_actual')->default(0)->after('saldo_inicial');
            }
            
            // Add status field if it doesn't exist
            if (!Schema::hasColumn('cuentas', 'estado')) {
                $table->enum('estado', ['activa', 'inactiva', 'cerrada'])->default('activa')->after('saldo_actual');
            }
        });
        
        // Set initial saldo_actual to saldo_inicial for existing records
        \DB::statement('UPDATE cuentas SET saldo_actual = saldo_inicial, estado = "activa" WHERE estado IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table) {
            // Drop all added columns
            $table->dropColumn([
                'moneda',
                'descripcion',
                'color',
                'icono',
                'tasa_interes_anual',
                'fecha_vencimiento',
                'dia_corte',
                'dia_pago',
                'limite_credito',
                'tasa_interes',
                'fecha_interes',
                'capitalizable',
                'periodo_capitalizacion',
                'saldo_actual',
                'estado'
            ]);
            
            // Rename back to balance_inicial
            $table->renameColumn('saldo_inicial', 'balance_inicial');
        });
    }
};
