<?php declare(strict_types=1);

namespace App\Modules\Tasks\DTOs;

use App\Models\Proyecto;
use Illuminate\Http\UploadedFile;

readonly class CreateTaskDTO
{
    /**
     * @param array<int>|null $assignees
     * @param array<\Illuminate\Http\UploadedFile>|null $images
     */
    public function __construct(
        public Proyecto $proyecto,
        public string $title,
        public string $status,
        public string $priority,
        public ?string $description = null,
        public ?string $dueDate = null,
        public ?array $assignees = null,
        public ?string $relatedType = null,
        public ?string $relatedId = null,
        public ?UploadedFile $image = null,
        public ?array $images = null,
    ) {}
}
