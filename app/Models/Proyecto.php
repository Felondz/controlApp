<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Importa TODOS los modelos con los que se relaciona
use App\Models\User;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\Transaccion;
use App\Models\Invitacion;
use App\Models\Message;

use Illuminate\Database\Eloquent\SoftDeletes;

use Laravel\Scout\Searchable;

class Proyecto extends Model
{
    use HasFactory, SoftDeletes, Searchable;

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
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['has_messaging_feature'];

    /**
     * Relación Miembros (muchos a muchos)
     */
    public function miembros()
    {
        return $this->belongsToMany(User::class, 'proyecto_user')->withPivot('rol');
    }

    /**
     * Relación Cuentas (polimórfica)
     */
    public function cuentas()
    {
        return $this->morphMany(Cuenta::class, 'propietario');
    }

    /**
     * Relación Categorías (uno a muchos)
     */
    public function categorias()
    {
        return $this->hasMany(Categoria::class);
    }

    /**
     * Relación Transacciones (uno a muchos)
     */
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    /**
     * Obtiene las invitaciones pendientes para este proyecto.
     */
    public function invitaciones()
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
        return $this->image_path
            ? asset('storage/' . $this->image_path)
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
            'nombre' => $this->nombre,
            'user_id' => $this->user_id,
        ];
    }
    /**
     * Relación Mensajes (uno a muchos)
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
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
     * Accessor for has_messaging_feature
     */
    public function getHasMessagingFeatureAttribute(): bool
    {
        return $this->hasMessagingFeature();
    }
}
