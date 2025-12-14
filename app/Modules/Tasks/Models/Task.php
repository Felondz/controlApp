<?php

namespace App\Modules\Tasks\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Finance\Models\Categoria;

class Task extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\TaskFactory::new();
    }

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'assigned_to',
        'related_type',
        'related_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Proyecto::class, 'project_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps()->withPivot('assigned_at');
    }

    public function category()
    {
        return $this->belongsTo(Categoria::class, 'category_id');
    }
    /**
     * Get the parent related model (LoteProduccion, SafetyIssue, etc).
     */
    public function related()
    {
        return $this->morphTo();
    }
}
