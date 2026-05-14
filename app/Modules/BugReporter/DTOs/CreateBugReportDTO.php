<?php declare(strict_types=1);

namespace App\Modules\BugReporter\DTOs;

use Illuminate\Http\UploadedFile;

readonly class CreateBugReportDTO
{
    /**
     * @param array<\Illuminate\Http\UploadedFile>|null $images
     */
    public function __construct(
        public string $userId,
        public string $category,
        public string $description,
        public string $pageUrl,
        public ?string $module = null,
        public ?string $view = null,
        public string $platform = 'web',
        public string $severity = 'medium',
        public ?UploadedFile $screenshot = null,
        public ?array $images = null,
    ) {}
}
