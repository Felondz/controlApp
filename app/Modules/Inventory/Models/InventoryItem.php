<?php

namespace App\Modules\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $uuid
 * @property string $proyecto_id
 * @property int|null $parent_id
 * @property string $sku
 * @property string $name
 * @property string|null $description
 * @property string $type
 * @property string $unit
 * @property array|null $attributes
 * @property float $min_stock_level
 * @property float $max_stock_level
 * @property float $current_stock
 * @property float $cost_price
 * @property float $sale_price
 * @property bool $is_active
 * @property string|null $image_path
 * @property-read string|null $image_url
 * @property-read \Illuminate\Support\Collection<int, InventoryTransaction> $transactions
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class InventoryItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemFactory> */
    use HasFactory, SoftDeletes, Searchable, HasUuids;

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
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): \Database\Factories\InventoryItemFactory
    {
        return \Database\Factories\InventoryItemFactory::new();
    }

    protected $fillable = [
        'proyecto_id',
        'parent_id', // Null for Simple Product or Parent Variable. Filled for Variants.
        'sku',
        'name',
        'description',
        'type', // 'raw_material', 'finished_good', 'service', 'asset'
        'unit', // 'kg', 'unit', 'liter', 'box'
        'attributes', // JSON: { "size": "L", "color": "Red" }
        'min_stock_level',
        'max_stock_level',
        'current_stock', // Cached value, source of truth is transactions sum
        'cost_price', // Weighted Average Cost
        'sale_price', // Default sale price
        'is_active',
        'image_path',
    ];

    protected $casts = [
        'attributes' => 'array',
        'current_stock' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        // Si ya es una URL absoluta, devolverla tal cual
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        // Usar la ruta protegida para asegurar la privacidad de los activos de la empresa
        return route('inventory.items.image', [
            'proyecto' => $this->proyecto_id,
            'item' => $this->uuid
        ]);
    }

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
    public function parent(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'parent_id');
    }

    /**
     * @return HasMany<InventoryItem, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(InventoryItem::class, 'parent_id');
    }

    /**
     * @return HasMany<InventoryTransaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }
    /**
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'proyecto_id' => $this->proyecto_id,
            'name' => $this->name,
            'sku' => $this->sku,
            'type' => $this->type,
            'unit' => $this->unit,
            'description' => $this->description,
            'cost_price' => (float) $this->cost_price,
            'sale_price' => (float) $this->sale_price,
            'current_stock' => (float) $this->current_stock,
            'min_stock_level' => (float) $this->min_stock_level,
            'is_low_stock' => $this->current_stock <= $this->min_stock_level,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
