<?php

namespace App\Modules\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Laravel\Scout\Searchable;

class InventoryItem extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory()
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

    public function getImageUrlAttribute()
    {
        return $this->image_path
            ? asset('storage/' . $this->image_path)
            : null;
    }

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function parent()
    {
        return $this->belongsTo(InventoryItem::class, 'parent_id');
    }

    public function variants()
    {
        return $this->hasMany(InventoryItem::class, 'parent_id');
    }

    public function transactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }
    public function toSearchableArray()
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
