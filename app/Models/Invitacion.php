<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property string $id
 * @property string $uuid
 * @property string $proyecto_id
 * @property string|null $user_id
 * @property string $email
 * @property string $rol
 * @property string $token
 * @property \Carbon\Carbon|null $expires_at
 * @property string $status
 * @property \Carbon\Carbon|null $accepted_at
 * @property \Carbon\Carbon|null $cancelled_at
 * @property-read Proyecto $proyecto
 * @property-read User|null $invitador
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Invitacion extends Model
{
    use HasFactory, HasUuids;

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EXPIRED = 'expired';

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

    /**
     * El nombre de la tabla asociada con el modelo.
     */
    protected $table = 'invitaciones';

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'proyecto_id',
        'user_id',
        'email',
        'rol',
        'token',
        'expires_at',
        'status',
        'accepted_at',
        'cancelled_at',
    ];

    /**
     * Define la relación: una invitación pertenece a un proyecto.
     */
    public function proyecto(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Proyecto::class);
    }

    /**
     * Define la relación: una invitación fue creada por un usuario (el invitador).
     */
    public function invitador(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
