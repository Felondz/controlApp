<?php declare(strict_types=1);

namespace App\Modules\Tasks\DTOs;

use App\Modules\Tasks\Models\Task;
use Illuminate\Http\UploadedFile;

readonly class UpdateTaskDTO
{
    /**
     * @param array<string, mixed> $data
     * @param array<int>|null $assignees
     * @param array<\Illuminate\Http\UploadedFile>|null $images
     */
    public function __construct(
        public Task $task,
        public array $data,
        public ?array $assignees = null,
        public ?UploadedFile $image = null,
        public ?array $images = null,
    ) {}
}
