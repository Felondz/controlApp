<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;

/**
 * @property int $id
 * @property string $nombre
 * @property string|null $banco
 * @property string $tipo
 * @property int $saldo_inicial
 * @property int $saldo_actual
 * @property int $balance
 * @property int $saldo
 * @property int $propietario_id
 * @property string|null $propietario_type
 * @property string|null $estado
 * @property string|null $moneda
 * @property string|null $descripcion
 * @property string|null $color
 * @property string|null $icono
 * @property bool|null $es_nomina
 * @property int|null $dia_nomina
 * @property int|null $valor_nomina
 * @property float|null $tasa_interes_anual
 * @property \Carbon\Carbon|null $fecha_vencimiento
 * @property int|null $dia_corte
 * @property int|null $dia_pago
 * @property int|null $limite_credito
 * @property float|null $tasa_interes
 * @property string|null $fecha_interes
 * @property bool|null $capitalizable
 * @property string|null $periodo_capitalizacion
 * @property int|null $plazo
 * @property int|null $valor_cuota
 * @property int|null $cuotas_pagadas
 * @property int|null $monto_desembolsado
 * @property int|null $cuenta_destino_id
 * @property int|null $proyecto_id
 * @property-read Proyecto $proyecto
 * @property-read Proyecto $propietario
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Cuenta extends Model
{
    /** @use HasFactory<\Database\Factories\CuentaFactory> */
    use HasFactory;

    protected static function newFactory(): \Database\Factories\CuentaFactory
    {
        return \Database\Factories\CuentaFactory::new();
    }

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
        // Payroll specific
        'es_nomina',
        'dia_nomina',
        'valor_nomina',
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
        // Loan specific
        'plazo',
        'valor_cuota',
        'cuotas_pagadas',
        'monto_desembolsado',
        'cuenta_destino_id',
    ];

    protected $casts = [
        'saldo_inicial' => 'integer', // Almacenado en centavos
        'saldo_actual' => 'integer',  // Almacenado en centavos
        'limite_credito' => 'integer', // Almacenado en centavos
        'valor_nomina' => 'integer', // Almacenado en centavos
        'tasa_interes_anual' => 'decimal:2',
        'tasa_interes' => 'decimal:2',
        'capitalizable' => 'boolean',
        'es_nomina' => 'boolean',
        'dia_nomina' => 'array', // Array of days (e.g., [15, 30] for biweekly)
        'fecha_vencimiento' => 'date',
        'fecha_interes' => 'date',
        'valor_cuota' => 'integer',
        'plazo' => 'integer',
        'cuotas_pagadas' => 'integer',
    ];

    protected $dates = [
        'fecha_vencimiento',
        'fecha_interes',
        'created_at',
        'updated_at',
    ];
    /**
     * Obtiene el modelo propietario (ya sea un User o un Proyecto).
     * @return MorphTo<Model, $this>
     */
    public function propietario(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Obtiene las transacciones asociadas con la cuenta.
     * @return HasMany<Transaccion, $this>
     */
    public function transacciones(): HasMany
    {
        return $this->hasMany(Transaccion::class);
    }

    /**
     * Relación Proyectos Asociados (muchos a muchos)
     * @return BelongsToMany<Proyecto, $this>
     */
    public function proyectosAsociados(): BelongsToMany
    {
        return $this->belongsToMany(Proyecto::class, 'cuenta_proyecto')
            ->withTimestamps();
    }

    /**
     * Destination account for loan disbursement
     * @return BelongsTo<Cuenta, $this>
     */
    public function cuentaDestino(): BelongsTo
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_destino_id');
    }
}
