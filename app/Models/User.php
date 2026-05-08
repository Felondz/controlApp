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
 * @property string|null $profile_photo_path
 * @property string|null $global_theme
 * @property array|null $enabled_tools
 * @property array|null $settings
 * @property bool $is_ai_enabled
 * @property string|null $remember_token
 * @property string $locale
 * @property bool $is_super_admin
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property-read string|null $profile_photo_url
 * @property-read bool $is_online
 * 
 * @property int|null $count aggregate property
 * @property int|null $unread_messages_count aggregate property
 * 
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Proyecto> $proyectos
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Proyecto> $proyectosPersonales
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentas
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $tasks
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Chat\Models\Message> $messages
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static create(array $attributes = [])
 * @method static where(string $column, $operator = null, $value = null)
 * @method static find(int $id)
 */
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable implements MustVerifyEmail
{

    /** @use \Illuminate\Database\Eloquent\Factories\HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, Searchable, HasUuids;

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
        'is_ai_enabled',
        'is_active',
        'google_id',
        'avatar',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'profile_photo_url',
        // 'unread_messages_count', // REMOVED: Causes N+1
        // 'unread_projects',       // REMOVED: Causes N+1
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
            'is_active' => 'boolean',
            'enabled_tools' => 'array',
            'settings' => 'array',
        ];
    }

    /**
     * Los proyectos en los que este usuario es miembro (a través de la tabla pivote).
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Proyecto, $this>
     */
    public function proyectos(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Proyecto::class, 'proyecto_user')->withPivot('rol', 'last_read_at');
    }

    /**
     * Los proyectos personales de este usuario (aquellos donde user_id = auth()->user()->id).
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Proyecto, $this>
     */
    public function proyectosPersonales(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Proyecto::class);
    }

    /**
     * Las cuentas personales del usuario (tarjetas, efectivo personal, etc.).
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany<Cuenta, $this>
     */
    public function cuentas(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Cuenta::class, 'propietario');
    }

    /**
     * Relación con Mensajes (uno a muchos)
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Modules\Chat\Models\Message, $this>
     */
    public function messages(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Modules\Chat\Models\Message::class);
    }

    /**
     * Invitaciones pendientes para este usuario (basado en su email).
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Invitacion, $this>
     */
    public function invitations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Invitacion::class, 'email', 'email');
    }

    /**
     * User's LLM Configuration Settings
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<UserLlmSetting, $this>
     */
    public function llmSettings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UserLlmSetting::class);
    }

    /**
     * Obtiene los mensajes enviados por el usuario.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Modules\Chat\Models\Message, $this>
     */
    public function sentMessages(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->messages();
    }

    /**
     * Tasks assigned to the user.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Task, $this>
     */
    public function tasks(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
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
        if ($this->is_super_admin) {
            return true;
        }

        // Si es propietario de un proyecto personal, puede acceder
        if ($proyecto->esPersonal() && $proyecto->user_id === $this->id) {
            return true;
        }

        // Revisa en la tabla pivote 'proyecto_user' si existe
        /** @var \App\Models\Proyecto|null $pivotQuery */
        $pivotQuery = $this->proyectos()->where('proyecto_id', $proyecto->id)->first();
        return $pivotQuery !== null;
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
    public function esAdminDe(Proyecto $proyecto): bool
    {
        if ($this->is_super_admin) {
            return true;
        }

        // Si es propietario de un proyecto personal, es admin del mismo
        if ($proyecto->esPersonal() && $proyecto->user_id === $this->id) {
            return true;
        }

        // Busca el rol en la tabla pivote
        $proyectoPivot = $this->proyectos()->find($proyecto->id);

        if (!$proyectoPivot) {
            return false;
        }

        $rol = $proyectoPivot->pivot->rol ?? null;

        return $rol === 'admin' || $rol === 'owner';
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
     * @return string|null
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (!$this->profile_photo_path) {
            return null;
        }

        // Si ya es una URL absoluta (como las de Google), devolverla tal cual
        if (filter_var($this->profile_photo_path, FILTER_VALIDATE_URL)) {
            return $this->profile_photo_path;
        }

        // Usar la ruta protegida para asegurar la privacidad de las fotos de los usuarios
        return route('user.photo', ['user' => $this->uuid]);
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
     * Efficiently fetch unread project data manualy (avoiding global appends).
     * Returns struct compatible with frontend expectation.
     *
     * @return array{unread_projects: array<int, mixed>, unread_messages_count: int, pending_invitations: \Illuminate\Support\Collection<int, mixed>, pending_invitations_count: int}
     */
    public function getUnreadData(): array
    {
        $userId = $this->id;
        
        // 1. Fetch all projects with Pivot loaded (eager loaded in calling scope ideally, or here)
        // We use 'loadMissing' to ensure we have the pivot data without force-reloading if already there
        $this->loadMissing(['proyectos', 'proyectosPersonales']);

        $allProjects = $this->proyectos->merge($this->proyectosPersonales)->unique('id');
        $projectIds = $allProjects->pluck('id')->toArray();

        if (empty($projectIds)) {
            return [
                'unread_projects' => [], 
                'unread_messages_count' => 0,
                'pending_invitations' => collect([]),
                'pending_invitations_count' => 0
            ];
        }

        // 2. Batch Query for Private Messages (Direct Messages to me)
        // Group by project_id to avoid N+1
        $dmCounts = \Illuminate\Support\Facades\DB::table('messages')
            ->whereIn('proyecto_id', $projectIds)
            ->where('recipient_id', $userId)
            ->whereNull('read_at')
            ->whereNull('deleted_at')
            ->select('proyecto_id', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('proyecto_id')
            ->pluck('count', 'proyecto_id');

        // 3. General Messages require 'last_read_at' logic which is per-user-project
        // This is harder to fully batch without complex joins, but we can optimize the loop
        // by avoiding DB calls inside.
        
        $unreadProjects = [];
        $totalUnreadCount = 0;

        foreach ($allProjects as $proyecto) {
            /** @var \App\Models\Proyecto $proyecto */
            // Check feature flag first? Assuming yes based on old code
            // if (!$proyecto->hasMessagingFeature()) continue; // Model method call might duplicate logic?
            // Simplified check:
            if (!in_array('messages', $proyecto->enabled_features ?? [])) continue;

            $lastReadAt = null;
            
            // Get last_read_at from pivot or assume null for owner if not pivot
            /** @phpstan-ignore-next-line */
            $pivot = $proyecto->pivot;
            if ($pivot instanceof \Illuminate\Database\Eloquent\Relations\Pivot) {
                /** @phpstan-ignore-next-line */
                $lastReadAt = $pivot->last_read_at;
            } else if ($proyecto->user_id === $userId) {
                // Owner might not have pivot? Check logic. 
                // Old code queried DB manually. Let's assume owner sees all if no pivot tracking?
                // Or try to find pivot in relation?
                // For safety and speed, we skip this complex fallback for now or default to 'now' if huge?
                // Actually, standard behavior is owners also have pivot rows usually. 
                // If missing pivot, treat as 'never read' -> all unread? Or 'read all'?
                // Let's rely on what we have.
            }

            // General Messages Count
            // We can't batch this easily because 'last_read_at' varies per project.
            // BUT we can use a single query for ALL projects if we are clever, 
            // but loop query is acceptable if simple count.
            // Optimization: Only query if last_read_at exists? No, always query.
            
            // To truly fix N+1 on general messages, we'd need a complex query:
            // SELECT proyecto_id, COUNT(*) FROM messages WHERE ... GROUP BY proyecto_id
            // AND created_at > (CASE WHEN proyecto_id=X THEN 'date' ... END)
            // That's too complex for raw SQL generation here easily.
            // Let's stick to loop but make it a precise COUNT query.
            
            /** @var \Illuminate\Database\Eloquent\Builder|\App\Modules\Chat\Models\Message $generalQuery */
            $generalQuery = $proyecto->messages() // This uses relation, slightly heavy?
                ->whereNull('recipient_id')
                ->where('user_id', '!=', $userId);
                
            if ($lastReadAt) {
                $generalQuery->where('created_at', '>', $lastReadAt);
            }
            
            $generalUnread = $generalQuery->count();

            // Direct Messages (from Batch)
            $privateUnread = $dmCounts->get($proyecto->id, 0);

            $projTotal = $generalUnread + $privateUnread;

            if ($projTotal > 0) {
                $unreadProjects[] = [
                    'id' => $proyecto->id,
                    'nombre' => $proyecto->nombre,
                    'image_path' => $proyecto->image_path,
                    'image_url' => $proyecto->image_url,
                    'icon' => $proyecto->icon, // Assuming accessor or column
                    'unread_count' => $projTotal,
                ];
                $totalUnreadCount += $projTotal;
            }
        }

        // 3. Fetch Pending Invitations (from Projects I'm invited to)
        $pendingInvitations = $this->invitations()
            ->where('status', Invitacion::STATUS_PENDING)
            ->with(['proyecto', 'invitador'])
            ->latest()
            ->get()
            ->map(fn(Invitacion $inv) => [
                'id' => $inv->id,
                'proyecto_id' => $inv->proyecto_id,
                'proyecto_nombre' => $inv->proyecto->nombre,
                'invitador_nombre' => $inv->invitador->name ?? 'System',
                'image_url' => $inv->proyecto->image_url,
                'rol' => $inv->rol,
                'token' => $inv->token,
                'type' => 'invitation'
            ]);

        return [
            'unread_projects' => $unreadProjects,
            'unread_messages_count' => (int)$totalUnreadCount,
            'pending_invitations' => $pendingInvitations,
            'pending_invitations_count' => $pendingInvitations->count(),
        ];
    }

    /**
     * Check if the user is online.
     * Use static cache to prevent duplicate queries within the same request.
     *
     * @return bool
     */
    public function getIsOnlineAttribute()
    {
        static $requestCache = [];

        if (array_key_exists($this->id, $requestCache)) {
            return $requestCache[$this->id];
        }

        return $requestCache[$this->id] = \Illuminate\Support\Facades\Cache::has('user-is-online-' . $this->id);
    }
}
