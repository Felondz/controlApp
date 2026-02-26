<?php declare(strict_types=1);

namespace App\Modules\BugReporter\DTOs;

use Illuminate\Http\UploadedFile;

readonly class CreateBugReportDTO
{
    public function __construct(
        public int $userId,
        public string $category,
        public string $description,
        public string $pageUrl,
        public string $severity = 'medium',
        public ?UploadedFile $screenshot = null,
    ) {}
}
