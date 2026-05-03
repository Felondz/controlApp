<?php

namespace App\Modules\Operations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $proyecto_id
 * @property string $production_process_id
 * @property string $name
 * @property int $order
 * @property string|null $description
 * @property bool $requires_quality_check
 * @property float|null $estimated_duration_days
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Operations\Models\StageInputTemplate> $inputTemplates
 * @property \App\Modules\Operations\Models\ProductionProcess $process
 */
class EtapaProceso extends Model
{
    /** @use HasFactory<\Database\Factories\EtapaProcesoFactory> */
    use HasFactory;

    /**
     * @return \Illuminate\Database\Eloquent\Factories\Factory<self>
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
    {
        return \Database\Factories\EtapaProcesoFactory::new();
    }

    protected $table = 'etapas_proceso';

    protected $fillable = [
        'proyecto_id',
        'production_process_id',
        'name', // e.g., "Germinación", "Fermentación"
        'order', // Sequence number
        'description',
        'requires_quality_check', // boolean
        'estimated_duration_days',
    ];

    protected $casts = [
        'requires_quality_check' => 'boolean',
    ];

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return HasMany<LoteProduccion, $this>
     */
    public function lotes(): HasMany
    {
        return $this->hasMany(LoteProduccion::class, 'stage_id');
    }

    /**
     * @return HasMany<StageTaskTemplate, $this>
     */
    public function taskTemplates(): HasMany
    {
        return $this->hasMany(StageTaskTemplate::class, 'etapa_proceso_id');
    }

    /**
     * @return HasMany<StageInputTemplate, $this>
     */
    public function inputTemplates(): HasMany
    {
        return $this->hasMany(StageInputTemplate::class, 'etapa_proceso_id');
    }
}
