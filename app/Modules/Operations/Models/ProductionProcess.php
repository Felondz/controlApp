<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $uuid
 * @property string $proyecto_id
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property string|null $inventory_item_id
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\EtapaProceso> $etapas
 * @property \App\Modules\Inventory\Models\InventoryItem|null $outputProduct
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\LoteProduccion> $lotes
 */
class ProductionProcess extends Model
{
    /** @use HasFactory<\Database\Factories\ProductionProcessFactory> */
    use HasFactory, SoftDeletes, HasUuids;

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Factories\Factory<self>
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
    {
        return \Database\Factories\ProductionProcessFactory::new();
    }

    protected $table = 'production_processes';

    protected $fillable = [
        'proyecto_id',
        'name', // e.g., "Proceso Café Lavado", "Proceso Cacao Fermentado"
        'description',
        'is_active',
        'inventory_item_id', // Default Output Product
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<\App\Modules\Inventory\Models\InventoryItem, $this>
     */
    public function outputProduct(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Inventory\Models\InventoryItem::class, 'inventory_item_id');
    }

    /**
     * @return HasMany<EtapaProceso, $this>
     */
    public function etapas(): HasMany
    {
        return $this->hasMany(EtapaProceso::class, 'production_process_id')->orderBy('order');
    }

    /**
     * @return HasMany<LoteProduccion, $this>
     */
    public function lotes(): HasMany
    {
        return $this->hasMany(LoteProduccion::class, 'production_process_id');
    }
}
