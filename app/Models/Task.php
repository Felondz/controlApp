<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'assigned_to',
        'is_financial',
        'amount',
        'category_id',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_financial' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(Proyecto::class, 'project_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function category()
    {
        return $this->belongsTo(Categoria::class, 'category_id');
    }
}
