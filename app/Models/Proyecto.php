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

class Proyecto extends Model
{
    use HasFactory;

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'nombre',
        'moneda_default',
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
}
