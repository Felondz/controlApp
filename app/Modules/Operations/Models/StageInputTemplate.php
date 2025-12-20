<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Modules\Inventory\Models\InventoryItem;

class StageInputTemplate extends Model
{
    use HasFactory;

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

    public function etapaProceso()
    {
        return $this->belongsTo(EtapaProceso::class, 'etapa_proceso_id');
    }

    public function item()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
