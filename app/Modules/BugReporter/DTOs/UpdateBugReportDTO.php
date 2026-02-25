<?php declare(strict_types=1);

namespace App\Modules\BugReporter\DTOs;

readonly class UpdateBugReportDTO
{
    public function __construct(
        public string $status,
        public ?string $developerNotes = null,
    ) {}
}
