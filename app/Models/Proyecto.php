<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\Transaccion;
use App\Models\Invitacion;

class Proyecto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'moneda_default',
    ];

    public function miembros()
    {
        return $this->belongsToMany(User::class, 'proyecto_user')->withPivot('rol');
    }

    public function cuentas()
    {
        return $this->morphMany(Cuenta::class, 'propietario');
    }

    public function categorias()
    {
        return $this->hasMany(Categoria::class);
    }

    public function transacciones()
    {

        return $this->hasMany(Transaccion::class);
    }

    public function invitaciones()
    {
        return $this->hasMany(Invitacion::class);
    }
}
