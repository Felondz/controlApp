<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Transaccion;

class Cuenta extends Model
{
    /** @use HasFactory<\Database\Factories\CuentaFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'banco',
        'tipo', // 'efectivo', 'banco', 'credito', 'inversion', 'otro'
        'saldo_inicial',
        'saldo_actual',
        'propietario_id',
        'propietario_type',
        'estado', // 'activa', 'inactiva', 'cerrada'
        'moneda',
        'descripcion',
        'color',
        'icono',
        // Credit card specific
        'tasa_interes_anual',
        'fecha_vencimiento',
        'dia_corte',
        'dia_pago',
        'limite_credito',
        // Savings/Investment specific
        'tasa_interes',
        'fecha_interes',
        'capitalizable',
        'periodo_capitalizacion',
    ];

    protected $casts = [
        'saldo_inicial' => 'integer', // Almacenado en centavos
        'saldo_actual' => 'integer',  // Almacenado en centavos
        'limite_credito' => 'integer', // Almacenado en centavos
        'tasa_interes_anual' => 'decimal:4',
        'tasa_interes' => 'decimal:4',
        'capitalizable' => 'boolean',
        'fecha_vencimiento' => 'date',
        'fecha_interes' => 'date',
    ];

    protected $dates = [
        'fecha_vencimiento',
        'fecha_interes',
        'created_at',
        'updated_at',
    ];
    /**
     * Obtiene el modelo propietario (ya sea un User o un Proyecto).
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function propietario()
    {
        return $this->morphTo();
    }

    /**
     * Obtiene las transacciones asociadas con la cuenta.
     */
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    /**
     * Relación Proyectos Asociados (muchos a muchos)
     * Proyectos donde esta cuenta está vinculada.
     */
    public function proyectosAsociados()
    {
        return $this->belongsToMany(Proyecto::class, 'cuenta_proyecto')
            ->withTimestamps();
    }
}
