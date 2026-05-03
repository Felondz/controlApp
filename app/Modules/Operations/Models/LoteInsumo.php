<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Inventory\Models\InventoryItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $lote_produccion_id
 * @property string $inventory_item_id
 * @property string|null $stage_id
 * @property float $quantity
 * @property float $unit_cost
 * @property float $total_cost
 * @property string $status
 * @property \Carbon\Carbon|null $consumed_at
 * @property string|null $notes
 * @property-read LoteProduccion $lote
 * @property-read InventoryItem $product
 * @property-read EtapaProceso|null $stage
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class LoteInsumo extends Model
{
    protected $table = 'lote_insumos';

    protected $fillable = [
        'lote_produccion_id',
        'inventory_item_id',
        'stage_id',
        'quantity',
        'unit_cost',
        'total_cost',
        'status', // 'pending', 'consumed'
        'consumed_at',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<LoteProduccion, $this>
     */
    public function lote(): BelongsTo
    {
        return $this->belongsTo(LoteProduccion::class, 'lote_produccion_id');
    }

    /**
     * @return BelongsTo<InventoryItem, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    /**
     * @return BelongsTo<EtapaProceso, $this>
     */
    public function stage(): BelongsTo
    {
        return $this->belongsTo(EtapaProceso::class, 'stage_id');
    }
}
