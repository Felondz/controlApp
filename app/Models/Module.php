<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'key',
        'name',
        'description',
        'price',
        'is_free',
        'is_active',
        'coming_soon',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_active' => 'boolean',
        'coming_soon' => 'boolean',
        'price' => 'decimal:2',
    ];
}
