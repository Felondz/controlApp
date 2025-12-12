<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Tasks\Models\Task;
use App\Notifications\VerificacionEmailNotification;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string $locale
 * @property bool $is_super_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @method static find(int $id)
 */
use Laravel\Scout\Searchable;

class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens, HasFactory, Notifiable, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'locale',
        'profile_photo_path',
        'global_theme',
        'enabled_tools',
        'settings',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
        'unread_messages_count',
        'unread_projects',
        'is_online',
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
            'enabled_tools' => 'array',
            'settings' => 'array',
        ];
    }

    /**
     * Los proyectos en los que este usuario es miembro (a través de la tabla pivote).
     */
    public function proyectos()
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_user')->withPivot('rol', 'last_read_at');
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
     * Tasks assigned to the user.
     */
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_user')->withPivot('assigned_at')->withTimestamps();
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
        $proyectoPivot = $this->proyectos()->find($proyecto->id);

        file_put_contents(storage_path('logs/custom_debug.log'), "User::esAdminDe - Project ID: {$proyecto->id}, User ID: {$this->id}\n", FILE_APPEND);

        if (!$proyectoPivot) {
            file_put_contents(storage_path('logs/custom_debug.log'), "User::esAdminDe - Project NOT FOUND in pivot\n", FILE_APPEND);
            return false;
        }

        $rol = $proyectoPivot->pivot->rol;
        file_put_contents(storage_path('logs/custom_debug.log'), "User::esAdminDe - Role: {$rol}\n", FILE_APPEND);

        return $rol === 'admin';
    }

    /**
     * Envía la notificación de verificación de email con nuestro template personalizado.
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerificacionEmailNotification());
    }

    /**
     * Envía la notificación de reset de password con nuestro template personalizado.
     *
     * @param  string  $token
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\PasswordResetNotification($token, $this->email));
    }

    /**
     * Get the URL to the user's profile photo.
     *
     * @return string
     */
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path
            ? asset('storage/' . $this->profile_photo_path)
            : null;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    /**
     * Get the total number of unread messages across all projects.
     *
     * @return int
     */
    /**
     * Get the total number of unread messages across all projects.
     *
     * @return int
     */
    public function getUnreadMessagesCountAttribute()
    {
        $count = 0;
        // Merge projects where user is member (pivot) and owner (personal)
        $allProjects = $this->proyectos->merge($this->proyectosPersonales)->unique('id');

        foreach ($allProjects as $proyecto) {
            if ($proyecto->hasMessagingFeature()) {
                // Robustly get last_read_at from DB to avoid issues with missing pivot on owned projects
                $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
                    ->where('proyecto_id', $proyecto->id)
                    ->where('user_id', $this->id)
                    ->first();

                $lastReadAt = $pivot ? $pivot->last_read_at : null;

                // General Messages
                $generalUnread = $proyecto->messages()
                    ->whereNull('recipient_id')
                    ->where('user_id', '!=', $this->id)
                    ->when($lastReadAt, function ($q) use ($lastReadAt) {
                        $q->where('created_at', '>', $lastReadAt);
                    })
                    ->count();

                // Direct Messages (where I am recipient and read_at is null)
                $dmUnread = $proyecto->messages()
                    ->where('recipient_id', $this->id)
                    ->whereNull('read_at')
                    ->count();

                $count += $generalUnread + $dmUnread;
            }
        }

        return $count;
    }

    /**
     * Get the projects with unread messages.
     *
     * @return array
     */
    public function getUnreadProjectsAttribute()
    {
        $unreadProjects = [];
        // Merge projects where user is member (pivot) and owner (personal)
        $allProjects = $this->proyectos->merge($this->proyectosPersonales)->unique('id');

        foreach ($allProjects as $proyecto) {
            if ($proyecto->hasMessagingFeature()) {
                // Robustly get last_read_at from DB
                $pivot = \Illuminate\Support\Facades\DB::table('proyecto_user')
                    ->where('proyecto_id', $proyecto->id)
                    ->where('user_id', $this->id)
                    ->first();

                $lastReadAt = $pivot ? $pivot->last_read_at : null;

                $generalUnread = $proyecto->messages()
                    ->whereNull('recipient_id')
                    ->where('user_id', '!=', $this->id)
                    ->when($lastReadAt, function ($q) use ($lastReadAt) {
                        $q->where('created_at', '>', $lastReadAt);
                    })
                    ->count();

                $privateUnread = $proyecto->messages()
                    ->where('recipient_id', $this->id)
                    ->whereNull('read_at')
                    ->count();

                $totalUnread = $generalUnread + $privateUnread;

                if ($totalUnread > 0) {
                    $unreadProjects[] = [
                        'id' => $proyecto->id,
                        'nombre' => $proyecto->nombre,
                        'image_path' => $proyecto->image_path,
                        'icon' => $proyecto->icon,
                        'unread_count' => $totalUnread,
                    ];
                }
            }
        }
        return $unreadProjects;
    }

    /**
     * Check if the user is online.
     *
     * @return bool
     */
    public function getIsOnlineAttribute()
    {
        return \Illuminate\Support\Facades\Cache::has('user-is-online-' . $this->id);
    }
}
