<?php

namespace App\Features\Finanzas\Models;

use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    protected $fillable = [
        'descripcion',
        'monto',
        'tipo',
        'categoria',
        'fecha',
        'notas',
    ];
}
