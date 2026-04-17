<?php

declare(strict_types=1);

namespace App\Modules\BugReporter\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\BugReporter\Models\BugReport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Controller to serve bug report screenshots.
 * Restricted to super admins only.
 */
class BugReportScreenshotController extends Controller
{
    /**
     * Serve a bug report screenshot.
     * Only accessible by super admins.
     */
    public function show(Request $request, BugReport $bugReport): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->is_super_admin) {
            abort(403);
        }

        if (! $bugReport->screenshot_path) {
            abort(404);
        }

        $disk = Storage::disk('local');

        if (! $disk->exists($bugReport->screenshot_path)) {
            abort(404);
        }

        $contents = $disk->get($bugReport->screenshot_path);
        $mimeType = $disk->mimeType($bugReport->screenshot_path);

        return response($contents, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="'.basename($bugReport->screenshot_path).'"',
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }
}
