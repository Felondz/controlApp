<?php

namespace App\Modules\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $uuid
 * @property string $content
 * @property string $type
 * @property string|null $proyecto_id
 * @property string $user_id
 * @property string|null $recipient_id
 * @property \Carbon\Carbon|null $read_at
 * @property-read bool $is_read
 * @property-read int|string $receiver_id Alias for recipient_id if used in events
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\Models\Proyecto|null $proyecto
 * @property-read \App\Models\User $user
 * @property-read \App\Models\User|null $recipient
 */
class Message extends Model
{
    /** @use \Illuminate\Database\Eloquent\Factories\HasFactory<\Database\Factories\MessageFactory> */
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    use \Illuminate\Database\Eloquent\SoftDeletes;
    use HasUuids;

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

    protected static function newFactory(): \Database\Factories\MessageFactory
    {
        return \Database\Factories\MessageFactory::new();
    }

    protected $fillable = [
        'content', 
        'type', 
        'proyecto_id', 
        'user_id', 
        'recipient_id', 
        'read_at',
        'parent_id',
        'is_edited',
        'file_path',
        'reactions'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'is_edited' => 'boolean',
        'reactions' => 'array',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
            return $this->file_path;
        }

        // Usar la ruta protegida para asegurar la privacidad de los archivos compartidos
        return route('project.messages.file', [
            'proyecto' => $this->proyecto->uuid ?? $this->proyecto_id,
            'message' => $this->uuid
        ]);
    }

    /**
     * @return BelongsTo<Message, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'parent_id');
    }

    /**
     * @return BelongsTo<Proyecto, $this>
     */
    public function proyecto(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recipient(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
