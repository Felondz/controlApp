<?php

// 1. ¡Este es el cambio más importante!
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// 2. Los 'use' ahora son más simples porque todos están en App\Models
use App\Models\Proyecto;
use App\Models\Cuenta;
use App\Models\Categoria;
use App\Models\User;

class Transaccion extends Model
{
    use HasFactory;

    protected $table = 'transacciones';

    protected $fillable = [
        'proyecto_id',
        'cuenta_id',
        'categoria_id',
        'user_id',
        'monto',
        'descripcion',
        'fecha',
        'notas',
    ];

    // 3. Las relaciones siguen igual
    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
