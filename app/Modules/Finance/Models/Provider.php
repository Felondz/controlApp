<?php

namespace App\Modules\Finance\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Laravel\Scout\Searchable;

class Provider extends Model
{
    use HasFactory, SoftDeletes, Searchable;

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
     * @return array
     */
    public function toSearchableArray()
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

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function contracts()
    {
        return $this->hasMany(SupplyContract::class);
    }
}
