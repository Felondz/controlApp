<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Proyecto;
use App\Models\User; // Added for the new @property-read User $user

/**
 * @property string $id
 * @property string|null $proyecto_id
 * @property string $nombre
 * @property string $tipo
 * @property string|null $image_path
 * @property-read Proyecto|null $proyecto
 * @property-read User $user
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Categoria extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriaFactory> */
    use HasFactory, SoftDeletes;

    protected static function newFactory(): \Database\Factories\CategoriaFactory
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
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Obtiene las transacciones asociadas con la categoría.
     * @return HasMany<Transaccion, $this>
     */
    public function transacciones(): HasMany
    {
        return $this->hasMany(Transaccion::class);
    }
}
