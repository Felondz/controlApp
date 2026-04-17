<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Models;

use App\Models\User;
use Database\Factories\BugReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bug Report model for PTR environment.
 *
 * @property int $id
 * @property int $user_id
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
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'user_id',
        'category',
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
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): BugReportFactory
    {
        return BugReportFactory::new();
    }
}
