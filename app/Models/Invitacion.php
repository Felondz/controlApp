<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $proyecto_id
 * @property int|null $user_id
 * @property string $email
 * @property string $rol
 * @property string $token
 * @property \Carbon\Carbon|null $expires_at
 * @property-read Proyecto $proyecto
 * @property-read User|null $invitador
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Invitacion extends Model
{
    use HasFactory;

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
