<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

final readonly class CompleteTour
{
    /**
     * @param  null  $_
     * @param  array{tour: string}  $args
     */
    public function __invoke($_, array $args): \App\Models\User
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        
        if (!$user) {
            throw new \Exception('Unauthenticated.');
        }

        $settings = $user->settings ?? [];
        /** @var array<int, string> $completedTours */
        $completedTours = $settings['completed_tours'] ?? [];
        
        $tour = $args['tour'];

        if (!in_array($tour, $completedTours)) {
            $completedTours[] = $tour;
            $settings['completed_tours'] = $completedTours;
            $user->settings = $settings;
            $user->save();
        }

        return $user;
    }
}
