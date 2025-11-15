<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PasswordReset extends Model
{
    // Solo created_at, sin updated_at
    public const UPDATED_AT = null;

    protected $table = 'password_resets';

    protected $fillable = [
        'user_id',
        'token',
        'created_at',  // Permitir edición de created_at para tests
    ];

    /**
     * Relación: Un reset pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
