<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Actions;

use App\Modules\BugReporter\DTOs\CreateBugReportDTO;
use App\Modules\BugReporter\Models\BugReport;

class CreateBugReportAction
{
    public function execute(CreateBugReportDTO $dto): BugReport
    {
        $screenshotPath = null;

        if ($dto->screenshot !== null) {
            $screenshotPath = $dto->screenshot->store('bug-reports', 'local');
        }

        /** @var BugReport $bugReport */
        $bugReport = BugReport::create([
            'user_id' => $dto->userId,
            'category' => $dto->category,
            'module' => $dto->module,
            'view' => $dto->view,
            'description' => $dto->description,
            'page_url' => $dto->pageUrl,
            'platform' => $dto->platform,
            'screenshot_path' => $screenshotPath,
            'severity' => $dto->severity,
            'status' => 'open',
        ]);

        return $bugReport;
    }
}
