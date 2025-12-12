<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Proyecto;

class Categoria extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\CategoriaFactory::new();
    }

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
