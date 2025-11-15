<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitacion extends Model
{

    use HasFactory;

    /**
     * Los atributos que se pueden asignar.
     */
    protected $fillable = [
        'proyecto_id',
        'email',
        'rol',
        'token',
        'expires_at',
    ];

    /**
     * Define la relación: una invitación pertenece a un proyecto.
     */
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }
}
