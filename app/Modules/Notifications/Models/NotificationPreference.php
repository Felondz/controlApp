<?php

namespace App\Modules\Notifications\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

/**
 * NotificationPreference Model
 * 
 * Stores user preferences for notification channels and event types.
 */
class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'event_type',
        'channel',
        'enabled',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Get the user that owns this preference.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by event type.
     */
    public function scopeForEvent($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }

    /**
     * Scope to filter by channel.
     */
    public function scopeForChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }
}
