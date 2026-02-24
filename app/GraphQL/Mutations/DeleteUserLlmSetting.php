<?php

namespace App\GraphQL\Mutations;

use App\Services\LlmSettingsService;
use Exception;
use Illuminate\Support\Facades\Auth;

final class DeleteUserLlmSetting
{
    public function __construct(private LlmSettingsService $llmSettingsService) {}

    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args): bool
    {
        $user = Auth::user();

        if (!$user) {
            throw new Exception("Unauthenticated");
        }

        return $this->llmSettingsService->deleteSetting($user, $args['provider']);
    }
}
