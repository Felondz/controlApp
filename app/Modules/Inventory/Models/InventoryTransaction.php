<?php

namespace App\Modules\Inventory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Models\User;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_id',
        'inventory_item_id',
        'user_id',
        'type', // 'purchase', 'sale', 'adjustment', 'production_in', 'production_out', 'transfer'
        'quantity', // Positive for add, Negative for remove
        'unit_price', // Snapshot of price at transaction time
        'total_amount', // quantity * unit_price
        'reference_type', // Morph: SupplyContract, LoteProduccion, Transaccion (Finance)
        'reference_id',
        'notes',
        'status', // 'draft', 'confirmed', 'cancelled'
        'transaction_date',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function item()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
