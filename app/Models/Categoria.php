<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'proyecto_id',
        'nombre',
        'tipo',
    ];

    /**
     * El proyecto al que pertenece esta categoría.
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Obtiene las transacciones asociadas con la categoría.
     */
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }
}
