<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Importa TODOS los modelos con los que se relaciona
use App\Models\User;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\Transaccion;
use App\Models\Invitacion; // <-- ¡La importación!

use Illuminate\Database\Eloquent\SoftDeletes;

class Proyecto extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'nombre',
        'moneda_default',
        'user_id',
        'es_personal',
        'visible_en_listado',
    ];

    /**
     * Siempre cargar estas relaciones.
     */
    protected $with = ['cuentas', 'categorias', 'transacciones'];

    /**
     * Los atributos que deben castearse a tipos nativos.
     */
    protected $casts = [
        'es_personal' => 'boolean',
        'visible_en_listado' => 'boolean',
    ];

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
}
