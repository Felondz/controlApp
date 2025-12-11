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
}
