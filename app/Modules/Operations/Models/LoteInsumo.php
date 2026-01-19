<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Inventory\Models\InventoryItem;

class LoteInsumo extends Model
{
    use HasFactory;

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

    public function lote()
    {
        return $this->belongsTo(LoteProduccion::class, 'lote_produccion_id');
    }

    public function product()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function stage()
    {
        return $this->belongsTo(EtapaProceso::class, 'stage_id');
    }
}
