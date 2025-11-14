<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    /**
     * Obtiene el modelo propietario (ya sea un User o un Proyecto).
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function propietario()
    {
        return $this->morphTo();
    }
}
