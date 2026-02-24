<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Inventory\Models\InventoryItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
