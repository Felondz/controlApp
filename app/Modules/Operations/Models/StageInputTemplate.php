<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $etapa_proceso_id
 * @property string $inventory_item_id
 * @property float $quantity
 * @property string|null $notes
 * @property \App\Modules\Inventory\Models\InventoryItem $item
 * @property \App\Modules\Operations\Models\EtapaProceso $etapaProceso
 */
class StageInputTemplate extends Model
{
    protected $table = 'stage_input_templates';

    protected $fillable = [
        'etapa_proceso_id',
        'inventory_item_id',
        'quantity',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<EtapaProceso, $this>
     */
    public function etapaProceso(): BelongsTo
    {
        return $this->belongsTo(EtapaProceso::class, 'etapa_proceso_id');
    }

    /**
     * @return BelongsTo<InventoryItem, $this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
