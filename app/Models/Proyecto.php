<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Importa TODOS los modelos con los que se relaciona
use App\Models\User;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Transaccion;
use App\Models\Invitacion;
use App\Modules\Chat\Models\Message;
use App\Modules\Tasks\Models\Task;

use Illuminate\Database\Eloquent\SoftDeletes;

use Laravel\Scout\Searchable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @property int $id
 * @property string $uuid
 * @property string $nombre
 * @property string|null $descripcion
 * @property string|null $description Alias for descripcion
 * @property string $moneda_default
 * @property string $user_id
 * @property bool $es_personal
 * @property bool $visible_en_listado
 * @property array|null $modules
 * @property string|null $color
 * @property string|null $icon
 * @property string|null $image_path
 * @property string|null $theme
 * @property string|null $typography
 * @property array|null $settings
 * @property-read bool $has_messaging_feature
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $miembros
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentas
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Cuenta> $cuentasAsociadas
 * @property string|null $proyecto_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Finance\Models\Categoria> $categorias
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaccion> $transacciones
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Invitacion> $invitaciones
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Task> $tasks
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Message> $messages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Modules\Inventory\Models\InventoryItem> $inventoryItems
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property bool $isAdmin Flag for UI
 * @property int $unread_messages_count Flag for UI
 * @property int $pending_tasks_count Flag for UI
 * @property int $due_today_count Flag for UI
 * @property mixed $pivot
 */
class Proyecto extends Model
{
    /** @use HasFactory<\Database\Factories\ProyectoFactory> */
    use HasFactory, SoftDeletes, Searchable, Notifiable, HasUuids;

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
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'moneda_default',
        'user_id',
        'es_personal',
        'visible_en_listado',
        'modules',
        'color',
        'icon',
        'image_path',
        'theme',
        'typography',
        'settings',
    ];

    /**
     * Siempre cargar estas relaciones.
     * (Eliminado por seguridad: las finanzas solo deben cargarse si es admin)
     */
    // protected $with = ['cuentas', 'categorias', 'transacciones'];

    /**
     * Los atributos que deben castearse a tipos nativos.
     */
    protected $casts = [
        'es_personal' => 'boolean',
        'visible_en_listado' => 'boolean',
        'modules' => 'array',
        'settings' => 'array',
    ];

    /** @phpstan-ignore-next-line */
    protected $appends = ['has_messaging_feature', 'image_url'];

    /**
     * Determina si el proyecto tiene habilitada la mensajería.
     * Requerido por $appends.
     */
    public function getHasMessagingFeatureAttribute(): bool
    {
        return in_array('chat', $this->modules ?? []);
    }

    /**
     * Relación Miembros (muchos a muchos)
     */
    public function miembros(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'proyecto_user')->withPivot('rol', 'last_read_at');
    }

    /**
     * Relación Cuentas (polimórfica)
     */
    public function cuentas(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Cuenta::class, 'propietario');
    }

    /**
     * Relación Cuentas Asociadas (muchos a muchos)
     * Cuentas personales vinculadas al proyecto.
     */
    public function cuentasAsociadas(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Cuenta::class, 'cuenta_proyecto')
            ->withTimestamps();
    }

    /**
     * Relación Categorías (uno a muchos)
     */
    public function categorias(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Categoria::class);
    }

    /**
     * Relación Transacciones (uno a muchos)
     */
    public function transacciones(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaccion::class);
    }

    /**
     * Obtiene las invitaciones pendientes para este proyecto.
     */
    public function invitaciones(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Invitacion::class);
    }

    /**
     * Verifica si este es un proyecto de finanzas personales.
     */
    public function esPersonal(): bool
    {
        return $this->es_personal === true;
    }

    /**
     * Obtiene el propietario del proyecto personal.
     */
    public function propietarioPersonal()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the URL to the project's image.
     *
     * @return string|null
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // Si ya es una URL absoluta, devolverla tal cual
        if (filter_var($this->image_path, FILTER_VALIDATE_URL)) {
            return $this->image_path;
        }

        // Usar la ruta protegida del controlador para máxima seguridad.
        // Esto garantiza que solo los miembros con permiso puedan ver la imagen.
        return route('projects.image', $this->uuid);
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
            'nombre' => $this->nombre,
            'user_id' => $this->user_id,
        ];
    }
    /**
     * Relación Mensajes (uno a muchos)
     */
    public function messages(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Relación Tareas (uno a muchos)
     */
    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Task::class, 'project_id');
    }

    /**
     * Verifica si el proyecto tiene habilitada la mensajería.
     * (Requiere que el módulo 'chat' esté activo)
     */
    public function hasMessagingFeature(): bool
    {
        $modules = $this->modules ?? [];
        return in_array('chat', $modules);
    }

    /**
     * Relationship with Inventory Items
     */
    public function inventoryItems()
    {
        return $this->hasMany(\App\Modules\Inventory\Models\InventoryItem::class);
    }
}
