<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Laravel\Scout\Searchable;

class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory, SoftDeletes, Searchable;

    protected static function newFactory(): \Database\Factories\ProviderFactory
    {
        return \Database\Factories\ProviderFactory::new();
    }

    protected $fillable = [
        'proyecto_id',
        'name',
        'tax_id', // NIT/RUT
        'contact_name',
        'email',
        'phone',
        'address',
        'payment_terms', // 'net30', 'immediate', etc
        'category', // 'services', 'goods', 'raw_materials'
        'notes',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'proyecto_id' => $this->proyecto_id,
            'name' => $this->name,
            'tax_id' => $this->tax_id,
            'contact_name' => $this->contact_name,
            'email' => $this->email,
        ];
    }

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return HasMany<SupplyContract, $this>
     */
    public function contracts(): HasMany
    {
        return $this->hasMany(SupplyContract::class);
    }
}
