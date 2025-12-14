<?php

namespace App\Modules\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Proyecto;
use App\Models\User;

class Message extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\MessageFactory::new();
    }

    protected $fillable = ['content', 'type', 'proyecto_id', 'user_id', 'recipient_id', 'read_at'];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
