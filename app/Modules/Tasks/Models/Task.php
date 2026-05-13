<?php

namespace App\Modules\Tasks\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Proyecto;
use App\Models\User;
use App\Modules\Finance\Models\Categoria;

/**
 * @property int $id
 * @property string $uuid
 * @property int $project_id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property string|null $image_path
 * @property \Carbon\Carbon|null $due_date
 * @property \Carbon\Carbon|null $completed_at
 * 
 * @property int $pending Aggregate property
 * @property int $due_today Aggregate property
 * 
 * @property int|null $assigned_to
 * @property int|null $assignee_id
 * @property string|null $related_type
 * @property int|null $related_id
 * @property bool|null $is_financial
 * @property float|null $amount
 * @property int|null $category_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property-read string|null $image_url
 */
class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function newFactory(): \Database\Factories\TaskFactory
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
        'image_path',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        // Si ya es una URL absoluta, devolverla tal cual
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        // Usar la ruta protegida para asegurar la privacidad de los activos de la empresa
        return route('api.proyectos.tasks.image', [
            'proyecto' => $this->project_id,
            'task' => $this->uuid
        ]);
    }

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'project_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user')->withPivot('assigned_at')->withTimestamps();
    }

    /**
     * @return BelongsTo<Categoria, $this>
     */
    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }
    /**
     * Get the parent related model (LoteProduccion, SafetyIssue, etc).
     * @return MorphTo<Model, $this>
     */
    public function related(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }
}
