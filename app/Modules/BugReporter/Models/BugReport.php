<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Models;

use App\Models\User;
use Database\Factories\BugReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Bug Report model for PTR environment.
 *
 * @property string $id
 * @property string $uuid
 * @property string $user_id
 * @property string $category
 * @property string $description
 * @property string $page_url
 * @property string|null $screenshot_path
 * @property string $severity
 * @property string $status
 * @property string|null $developer_notes
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static BugReportFactory factory(...$parameters)
 */
class BugReport extends Model
{
    /** @use HasFactory<BugReportFactory> */
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

    /** @var list<string> */
    protected $fillable = [
        'user_id',
        'category',
        'module',
        'view',
        'description',
        'page_url',
        'screenshot_path',
        'severity',
        'status',
        'developer_notes',
        'resolved_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'description' => 'encrypted',
            'developer_notes' => 'encrypted',
            'page_url' => 'encrypted',
        ];
    }

    public const CATEGORIES = [
        'translation',
        'functionality',
        'unclear_info',
        'ui_visual',
        'performance',
        'other',
    ];

    public const SEVERITIES = ['low', 'medium', 'high'];

    public const STATUSES = ['open', 'in_progress', 'resolved', 'dismissed'];

    /**
     * The user who reported this bug.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<BugReportImage, $this>
     */
    public function images(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BugReportImage::class);
    }

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): BugReportFactory
    {
        return BugReportFactory::new();
    }
}
