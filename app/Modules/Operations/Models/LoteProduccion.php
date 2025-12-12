<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Inventory\Models\InventoryItem;
use Laravel\Scout\Searchable;

class LoteProduccion extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $table = 'lotes_produccion';

    protected $fillable = [
        'proyecto_id',
        'production_process_id',
        'current_stage_id',
        'inventory_item_id', // Linked product (optional at start)
        'code', // e.g., LOTE-2023-001
        'initial_quantity',
        'current_quantity', // Can decrease due to waste/samples
        'start_date',
        'end_date',
        'status', // 'active', 'finished', 'discarded'
        'notes',
        'assigned_to', // User ID
    ];

    protected $casts = [
        'start_date' => 'date',
        'estimated_end_date' => 'date',
        'actual_end_date' => 'date',
        'initial_quantity' => 'decimal:2',
        'current_quantity' => 'decimal:2',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function product()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function stage()
    {
        return $this->belongsTo(EtapaProceso::class, 'stage_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Tasks related to this batch
    public function tasks()
    {
        return $this->morphMany(\App\Modules\Tasks\Models\Task::class, 'related');
    }
}
