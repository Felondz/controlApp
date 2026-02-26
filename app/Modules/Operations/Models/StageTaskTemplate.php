<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StageTaskTemplate extends Model
{
    /** @use HasFactory<\Database\Factories\StageTaskTemplateFactory> */
    use HasFactory;

    /**
     * @return \Illuminate\Database\Eloquent\Factories\Factory<self>
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
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

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<EtapaProceso, $this>
     */
    public function etapaProceso(): BelongsTo
    {
        return $this->belongsTo(EtapaProceso::class, 'etapa_proceso_id');
    }
}
