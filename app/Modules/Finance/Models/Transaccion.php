<?php

// 1. ¡Este es el cambio más importante!
namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// 2. Los 'use' ahora son más simples porque todos están en App\Models
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
 * @property string $descripcion
 * @property string $fecha
 * @property string|null $notas
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 */
class Transaccion extends Model
{
    use HasFactory;

    protected static function newFactory()
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

    // 3. Las relaciones siguen igual
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function cuentaPredeterminada()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_predeterminada_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Parent transaction (for installment tracking)
     */
    public function transaccionOrigen()
    {
        return $this->belongsTo(Transaccion::class, 'transaccion_origen_id');
    }

    /**
     * Child installment transactions
     */
    public function cuotasHijas()
    {
        return $this->hasMany(Transaccion::class, 'transaccion_origen_id');
    }
    /**
     * Get the source model that generated this transaction (InventarioMovement, PayrollRun, etc).
     */
    public function source()
    {
        return $this->morphTo();
    }
}
