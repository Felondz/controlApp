<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Proyecto;
use App\Models\Cuenta;
use App\Notifications\VerificacionEmailNotification;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property bool $is_super_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @method static find(int $id)
 */
class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_super_admin' => 'boolean',
        ];
    }

    /**
     * Los proyectos en los que este usuario es miembro (a través de la tabla pivote).
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_user')->withPivot('rol');
    }

    /**
     * Los proyectos personales de este usuario (aquellos donde user_id = auth()->user()->id).
     */
    public function proyectosPersonales()
    {
        return $this->hasMany(Proyecto::class);
    }

    /**
     * Las cuentas personales del usuario (tarjetas, efectivo personal, etc.).
     */
    public function cuentas()
    {
        return $this->morphMany(Cuenta::class, 'propietario');
    }

    /**
     * Revisa si el usuario es miembro de un proyecto específico.
     * Incluye:
     * - Ser miembro en la tabla pivote 'proyecto_user'
     * - Ser el propietario de un proyecto personal
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return bool
     */
    public function esMiembroDe(Proyecto $proyecto)
    {
        // Si es propietario de un proyecto personal, puede acceder
        if ($proyecto->esPersonal() && $proyecto->user_id === $this->id) {
            return true;
        }

        // Revisa en la tabla pivote 'proyecto_user' si existe
        return $this->proyectos()->where('proyecto_id', $proyecto->id)->exists();
    }

    /**
     * Revisa si el usuario es 'admin' de un proyecto específico.
     * Incluye:
     * - Ser admin en la tabla pivote 'proyecto_user'
     * - Ser el propietario de un proyecto personal
     *
     * @param  \App\Models\Proyecto  $proyecto
     * @return bool
     */
    public function esAdminDe(Proyecto $proyecto)
    {
        // Si es propietario de un proyecto personal, es admin del mismo
        if ($proyecto->esPersonal() && $proyecto->user_id === $this->id) {
            return true;
        }

        // Si no es miembro, no puede ser admin
        if (!$this->esMiembroDe($proyecto)) {
            return false;
        }

        // Busca el rol en la tabla pivote
        $rol = $this->proyectos()->find($proyecto->id)->pivot->rol;

        return $rol === 'admin';
    }

    /**
     * Envía la notificación de verificación de email con nuestro template personalizado.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerificacionEmailNotification());
    }
}
