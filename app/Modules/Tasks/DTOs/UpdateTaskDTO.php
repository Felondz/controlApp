<?php declare(strict_types=1);

namespace App\Modules\Tasks\DTOs;

use App\Modules\Tasks\Models\Task;

readonly class UpdateTaskDTO
{
    /**
     * @param array<string, mixed> $data
     * @param array<int>|null $assignees
     */
    public function __construct(
        public Task $task,
        public array $data,
        public ?array $assignees = null,
    ) {}
}
