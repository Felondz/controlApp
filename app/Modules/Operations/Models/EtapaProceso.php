<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;

class EtapaProceso extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\EtapaProcesoFactory::new();
    }

    protected $table = 'etapas_proceso';

    protected $fillable = [
        'proyecto_id',
        'name', // e.g., "Germinación", "Fermentación"
        'order', // Sequence number
        'description',
        'requires_quality_check', // boolean
        'estimated_duration_days',
    ];

    protected $casts = [
        'requires_quality_check' => 'boolean',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function lotes()
    {
        return $this->hasMany(LoteProduccion::class, 'stage_id');
    }

    public function taskTemplates()
    {
        return $this->hasMany(StageTaskTemplate::class, 'etapa_proceso_id');
    }
}
