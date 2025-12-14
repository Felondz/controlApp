<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;

class StageTaskTemplate extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\StageTaskTemplateFactory::new();
    }

    protected $table = 'stage_task_templates';

    protected $fillable = [
        'proyecto_id',
        'etapa_proceso_id',
        'name',
        'description',
        'priority', // 'low', 'medium', 'high', 'urgent'
        'days_due_offset', // Days after stage start to set due date
        'is_mandatory', // If true, prevents moving to next stage until completed (future logic)
    ];

    protected $casts = [
        'days_due_offset' => 'integer',
        'is_mandatory' => 'boolean',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function etapaProceso()
    {
        return $this->belongsTo(EtapaProceso::class, 'etapa_proceso_id');
    }
}
