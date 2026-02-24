<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property int $id
 * @property int $proyecto_id
 * @property int $production_process_id
 * @property int $stage_id
 * @property int|null $inventory_item_id
 * @property string $code
 * @property float|null $initial_quantity
 * @property float|null $current_quantity
 * @property float|null $final_quantity
 * @property \Illuminate\Support\Carbon|null $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $discarded_at
 * @property string|null $discard_reason
 * @property string|null $notes
 * @property int|null $assigned_to
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\LoteInsumo> $inputs
 * @property \App\Models\User|null $assignee
 * @property \App\Modules\Operations\Models\ProductionProcess $productionProcess
 * @property \App\Modules\Operations\Models\EtapaProceso $stage
 */
class LoteProduccion extends Model
{
    /** @use HasFactory<\Database\Factories\LoteProduccionFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return \Illuminate\Database\Eloquent\Factories\Factory<self>
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
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

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Tasks related to this batch
     * @return MorphMany<\App\Modules\Tasks\Models\Task, $this>
     */
    public function tasks(): MorphMany
    {
        return $this->morphMany(\App\Modules\Tasks\Models\Task::class, 'related');
    }

    /**
     * @return HasMany<LoteInsumo, $this>
     */
    public function inputs(): HasMany
    {
        return $this->hasMany(LoteInsumo::class, 'lote_produccion_id');
    }

    /**
     * @return BelongsTo<ProductionProcess, $this>
     */
    public function productionProcess(): BelongsTo
    {
        return $this->belongsTo(ProductionProcess::class, 'production_process_id');
    }

    /**
     * @return BelongsTo<EtapaProceso, $this>
     */
    public function currentStage(): BelongsTo
    {
        return $this->belongsTo(EtapaProceso::class, 'stage_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
