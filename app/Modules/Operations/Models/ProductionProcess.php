<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;

class ProductionProcess extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory()
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

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function outputProduct()
    {
        return $this->belongsTo(\App\Modules\Inventory\Models\InventoryItem::class, 'inventory_item_id');
    }

    public function etapas()
    {
        return $this->hasMany(EtapaProceso::class, 'production_process_id')->orderBy('order');
    }

    public function lotes()
    {
        return $this->hasMany(LoteProduccion::class, 'production_process_id');
    }
}
