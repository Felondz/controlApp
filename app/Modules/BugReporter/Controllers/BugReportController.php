<?php declare(strict_types=1);

namespace App\Modules\BugReporter\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\BugReporter\Actions\CreateBugReportAction;
use App\Modules\BugReporter\Actions\UpdateBugReportAction;
use App\Modules\BugReporter\DTOs\CreateBugReportDTO;
use App\Modules\BugReporter\DTOs\UpdateBugReportDTO;
use App\Modules\BugReporter\Models\BugReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Controller for PTR Bug Reports.
 * All routes are gated by RequirePtrEnvironment middleware.
 */
class BugReportController extends Controller
{
    /**
     * Developer dashboard — list all bug reports.
     * Restricted to super admins.
     */
    public function index(Request $request): InertiaResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$user->is_super_admin) {
            abort(403);
        }

        $query = BugReport::with('user')->orderByDesc('created_at');

        // Apply filters
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('severity')) {
            $query->where('severity', $request->input('severity'));
        }

        $reports = $query->paginate(20);

        // Stats
        $stats = [
            'open' => BugReport::where('status', 'open')->count(),
            'in_progress' => BugReport::where('status', 'in_progress')->count(),
            'resolved_today' => BugReport::where('status', 'resolved')
                ->whereDate('resolved_at', today())
                ->count(),
            'total' => BugReport::count(),
        ];

        return Inertia::render('Ptr/BugReportsDashboard', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['category', 'status', 'severity']),
        ]);
    }

    /**
     * Submit a new bug report — available to any authenticated user.
     */
    public function store(Request $request, CreateBugReportAction $action): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|in:' . implode(',', BugReport::CATEGORIES),
            'description' => 'required|string|max:5000',
            'page_url' => 'required|string|max:2048',
            'severity' => 'sometimes|string|in:' . implode(',', BugReport::SEVERITIES),
            'screenshot' => 'nullable|image|max:5120', // 5MB max
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $dto = new CreateBugReportDTO(
            userId: $user->id,
            category: $validated['category'],
            description: $validated['description'],
            pageUrl: $validated['page_url'],
            severity: $validated['severity'] ?? 'medium',
            screenshot: $request->file('screenshot'),
        );

        $bugReport = $action->execute($dto);

        return response()->json($bugReport, 201);
    }

    /**
     * Update a bug report status/notes — restricted to super admins.
     */
    public function update(Request $request, BugReport $bugReport, UpdateBugReportAction $action)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (!$user->is_super_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', BugReport::STATUSES),
            'developer_notes' => 'nullable|string|max:5000',
        ]);

        $dto = new UpdateBugReportDTO(
            status: $validated['status'],
            developerNotes: $validated['developer_notes'] ?? null,
        );

        $updatedReport = $action->execute($bugReport, $dto);

        if ($request->wantsJson()) {
            return response()->json($updatedReport);
        }

        return redirect()->back()->with('success', 'Reporte de bug actualizado exitosamente.');
    }

    /**
     * Get bug report stats — for badge count in widget.
     */
    public function stats(Request $request): JsonResponse
    {
        $openCount = BugReport::where('status', 'open')->count();

        return response()->json([
            'open_count' => $openCount,
        ]);
    }
}
