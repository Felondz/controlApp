<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Actions;

use App\Modules\BugReporter\DTOs\UpdateBugReportDTO;
use App\Modules\BugReporter\Models\BugReport;

class UpdateBugReportAction
{
    public function execute(BugReport $bugReport, UpdateBugReportDTO $dto): BugReport
    {
        $data = [
            'status' => $dto->status,
        ];

        if ($dto->developerNotes !== null) {
            $data['developer_notes'] = $dto->developerNotes;
        }

        // Auto-set resolved_at when status changes to resolved
        if ($dto->status === 'resolved' && $bugReport->status !== 'resolved') {
            $data['resolved_at'] = now();
        }

        // Clear resolved_at if re-opening
        if ($dto->status !== 'resolved' && $bugReport->status === 'resolved') {
            $data['resolved_at'] = null;
        }

        $bugReport->update($data);

        return $bugReport;
    }
}
