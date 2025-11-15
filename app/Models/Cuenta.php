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
        'tipo', // 'efectivo', 'banco', 'credito', 'otro'
        'balance_inicial',
        'propietario_id',
        'propietario_type',
        'estado', // 'activa' o 'inactiva'
        'balance',
    ];
    protected $casts = [
        'balance_inicial' => 'integer', // Asumiendo que guardamos en centavos
        'balance' => 'integer',
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
}
