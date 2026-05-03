<?php

namespace App\Modules\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Models\User;

/**
 * @property string $id
 * @property string $proyecto_id
 * @property string $inventory_item_id
 * @property string $user_id
 * @property string $type
 * @property float $quantity
 * @property float $unit_price
 * @property float $total_amount
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property string|null $notes
 * @property string $status
 * @property \Carbon\Carbon $transaction_date
 * @property-read InventoryItem|null $item
 * @property-read Proyecto $proyecto
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'inventory_item_id',
        'user_id',
        'type', // 'purchase', 'sale', 'adjustment', 'production_in', 'production_out', 'transfer'
        'quantity', // Positive for add, Negative for remove
        'unit_price', // Snapshot of price at transaction time
        'total_amount', // quantity * unit_price
        'reference_type', // Morph: SupplyContract, LoteProduccion, Transaccion (Finance)
        'reference_id',
        'notes',
        'status', // 'draft', 'confirmed', 'cancelled'
        'transaction_date',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<InventoryItem, $this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }
}
