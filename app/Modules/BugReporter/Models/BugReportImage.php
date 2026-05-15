<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;

class BugReportImage extends Model
{
    use HasUuids;

    protected $fillable = [
        'bug_report_id',
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

        return route('ptr.bug-reports.gallery.image', ['image' => $this->uuid]);
    }

    /**
     * @return BelongsTo<BugReport, $this>
     */
    public function bugReport(): BelongsTo
    {
        return $this->belongsTo(BugReport::class);
    }
}
