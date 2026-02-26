<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Categoria;
use App\Models\User;

/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $cuenta_id
 * @property int $categoria_id
 * @property int $user_id
 * @property float $monto
 * @property string $tipo
 * @property string $status
 * @property string $descripcion
 * @property string $titulo
 * @property string $fecha
 * @property int|null $task_id
 * @property string|null $notas
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion query()
 * @method static Transaccion create(array<string, mixed> $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Transaccion where(string $column, $operator = null, $value = null)
 */
class Transaccion extends Model
{
    /** @use HasFactory<\Database\Factories\TransaccionFactory> */
    use HasFactory;

    protected static function newFactory(): \Database\Factories\TransaccionFactory
    {
        return \Database\Factories\TransaccionFactory::new();
    }

    protected $table = 'transacciones';

    protected $fillable = [
        'proyecto_id',
        'cuenta_id',
        'categoria_id',
        'user_id',
        'monto',
        'titulo',
        'descripcion',
        'fecha',
        'notas',
        'status',
        'cuenta_predeterminada_id',
        'debito_automatico',
        'fecha_autopago',

        // Recurrence fields
        'is_recurring',
        'recurrence_interval',
        'recurrence_day',
        'next_occurrence',

        // Credit card installment fields
        'cuotas',
        'cuota_actual',
        'ciclo_facturacion',
        'transaccion_origen_id',
        'source_type',
        'source_id',
    ];

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<Cuenta, $this>
     */
    public function cuenta(): BelongsTo
    {
        return $this->belongsTo(Cuenta::class);
    }

    /**
     * @return BelongsTo<Categoria, $this>
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    /**
     * @return BelongsTo<Cuenta, $this>
     */
    public function cuentaPredeterminada(): BelongsTo
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_predeterminada_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Parent transaction (for installment tracking)
     * @return BelongsTo<Transaccion, $this>
     */
    public function transaccionOrigen(): BelongsTo
    {
        return $this->belongsTo(Transaccion::class, 'transaccion_origen_id');
    }

    /**
     * Child installment transactions
     * @return HasMany<Transaccion, $this>
     */
    public function cuotasHijas(): HasMany
    {
        return $this->hasMany(Transaccion::class, 'transaccion_origen_id');
    }
    /**
     * Get the source model that generated this transaction.
     * @return MorphTo<Model, $this>
     */
    public function source(): MorphTo
    {
        return $this->morphTo();
    }
}
