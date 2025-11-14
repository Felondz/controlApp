<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriaFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'proyecto_id',
        'nombre',
        'tipo', // 'ingreso' o 'gasto'
    ];

    /**
     * El proyecto al que pertenece esta categoría.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }
}
