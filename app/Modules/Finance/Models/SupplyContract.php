<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Categoria;

class SupplyContract extends Model
{
    /** @use HasFactory<\Database\Factories\SupplyContractFactory> */
    use HasFactory, SoftDeletes;

    protected static function newFactory(): \Database\Factories\SupplyContractFactory
    {
        return \Database\Factories\SupplyContractFactory::new();
    }

    protected $fillable = [
        'proyecto_id',
        'provider_id',
        'name', // "Suministro semanal Café"
        'frequency', // 'weekly', 'monthly', 'on_demand'
        'recurrence_day', // Day of week (1-7) or Day of month (1-31)
        'items', // JSON: [{ "sku": "CAFE01", "name": "Grano", "price": 100, "qty": 10 }]
        'total_amount',
        'currency_code',
        'auto_generate_invoice', // bool
        'billing_category_id', // Linked to core Categories
        'target_account_id', // Account to pay from (optional)
        'last_run_at',
        'next_run_at',
        'status', // 'active', 'paused'
    ];

    protected $casts = [
        'items' => 'array',
        'last_run_at' => 'datetime',
        'next_run_at' => 'datetime',
        'auto_generate_invoice' => 'boolean',
    ];

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<Provider, $this>
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * @return BelongsTo<Categoria, $this>
     */
    public function billingCategory(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'billing_category_id');
    }

    /**
     * @return BelongsTo<Cuenta, $this>
     */
    public function targetAccount(): BelongsTo
    {
        return $this->belongsTo(Cuenta::class, 'target_account_id');
    }
}
