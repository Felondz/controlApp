<?php

namespace App\Modules\Analytics\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Proyecto;

/**
 * AnalyticsMetric Model
 * 
 * Stores aggregated metrics from module events.
 */
class AnalyticsMetric extends Model
{
    protected $fillable = [
        'proyecto_id',
        'metric_type',
        'metric_name',
        'value',
        'metadata',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'metadata' => 'array',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
    ];

    /**
     * Get the project that owns this metric.
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Scope to filter by metric type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('metric_type', $type);
    }

    /**
     * Scope to filter by period.
     */
    public function scopeInPeriod($query, $start, $end)
    {
        return $query->where('period_start', '>=', $start)
            ->where('period_end', '<=', $end);
    }
}
