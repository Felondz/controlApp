<?php declare(strict_types=1);

namespace App\Modules\Tasks\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;

class TaskImage extends Model
{
    use HasUuids;

    protected $fillable = [
        'task_id',
        'image_path',
    ];

    protected $appends = ['image_url'];

    /**
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

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        /** @var Task|null $task */
        $task = $this->task;
        if (!$task) {
            return Storage::url($this->image_path);
        }

        // Load the proyecto relationship to get its UUID for route binding
        $task->loadMissing('proyecto');
        /** @var \App\Models\Proyecto|null $proyecto */
        $proyecto = $task->proyecto;
        if (!$proyecto) {
            return Storage::url($this->image_path);
        }

        return route('mis-proyectos.tasks.gallery', [
            'proyecto' => $proyecto->uuid,
            'task' => $task->uuid,
            'image' => $this->uuid
        ]);
    }

    /**
     * @return BelongsTo<Task, $this>
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
