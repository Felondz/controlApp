<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Inventory\Models\InventoryItem;

class LoteProduccion extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\LoteProduccionFactory::new();
    }

    protected $table = 'lotes_produccion';

    protected $fillable = [
        'proyecto_id',
        'production_process_id',
        'stage_id',
        'inventory_item_id', // Linked product (optional at start)
        'code', // e.g., LOTE-2023-001
        'initial_quantity',
        'current_quantity', // Can decrease due to waste/samples
        'final_quantity',
        'start_date',
        'end_date',
        'status', // 'active', 'finished', 'discarded'
        'discarded_at',
        'discard_reason',
        'notes',
        'assigned_to', // User ID
    ];

    protected $casts = [
        'start_date' => 'date',
        'estimated_end_date' => 'date',
        'actual_end_date' => 'date',
        'discarded_at' => 'datetime',
        'initial_quantity' => 'decimal:2',
        'current_quantity' => 'decimal:2',
        'final_quantity' => 'decimal:2',
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

    public function inputs()
    {
        return $this->hasMany(LoteInsumo::class, 'lote_produccion_id');
    }

    public function productionProcess()
    {
        return $this->belongsTo(ProductionProcess::class, 'production_process_id');
    }

    public function currentStage()
    {
        return $this->belongsTo(EtapaProceso::class, 'stage_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
