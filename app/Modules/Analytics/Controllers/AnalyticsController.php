<?php

namespace App\Modules\Analytics\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Analytics\Models\AnalyticsMetric;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

/**
 * AnalyticsController
 * 
 * API endpoints for querying analytics metrics.
 */
class AnalyticsController extends Controller
{
    /**
     * Get overall analytics for a project (used by Dashboard Widget).
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @return JsonResponse
     */
    public function index(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$request->user()->esMiembroDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Calculate totals from daily metrics to avoid double counting
        $totalIncome = AnalyticsMetric::where('proyecto_id', $proyecto->id)
            ->where('metric_type', 'finance')
            ->where('metric_name', 'income.total.daily')
            ->sum('value');

        $totalExpenses = AnalyticsMetric::where('proyecto_id', $proyecto->id)
            ->where('metric_type', 'finance')
            ->where('metric_name', 'expense.total.daily')
            ->sum('value');

        return response()->json([
            'total_income' => (float) $totalIncome,
            'total_expenses' => (float) $totalExpenses,
            'net_balance' => (float) ($totalIncome - $totalExpenses),
        ]);
    }

    /**
     * Get metrics for a project.
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @return JsonResponse
     */
    public function metrics(Request $request, Proyecto $proyecto): JsonResponse
    {
        // Authorization
        if (!$request->user()->esMiembroDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'metric_type' => 'nullable|in:finance,tasks,chat',
            'period' => 'nullable|in:daily,weekly,monthly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $query = AnalyticsMetric::where('proyecto_id', $proyecto->id);

        // Filter by metric type
        if (isset($validated['metric_type'])) {
            $query->where('metric_type', $validated['metric_type']);
        }

        // Filter by date range
        if (isset($validated['start_date'])) {
            $query->where('period_start', '>=', $validated['start_date']);
        }

        if (isset($validated['end_date'])) {
            $query->where('period_end', '<=', $validated['end_date']);
        }

        // Default to last 30 days if no dates specified
        if (!isset($validated['start_date']) && !isset($validated['end_date'])) {
            $query->where('period_start', '>=', Carbon::now()->subDays(30));
        }

        $metrics = $query->orderBy('period_start', 'desc')
            ->limit($validated['limit'] ?? 50)
            ->get();

        return response()->json([
            'metrics' => $metrics,
            'count' => $metrics->count(),
        ]);
    }

    /**
     * Get summary metrics for a project.
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @return JsonResponse
     */
    public function summary(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$request->user()->esMiembroDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        $summary = [
            'finance' => [
                'transactions_today' => $this->getMetricValue($proyecto->id, 'finance', 'transactions.count.daily', $today),
                'income_today' => $this->getMetricValue($proyecto->id, 'finance', 'income.total.daily', $today),
                'expense_today' => $this->getMetricValue($proyecto->id, 'finance', 'expense.total.daily', $today),
            ],
            'tasks' => [
                'created_today' => $this->getMetricValue($proyecto->id, 'tasks', 'created.count.daily', $today),
                'completed_today' => $this->getMetricValue($proyecto->id, 'tasks', 'completed.count.daily', $today),
                'financial_completed_today' => $this->getMetricValue($proyecto->id, 'tasks', 'financial_completed.count.daily', $today),
            ],
            'chat' => [
                'messages_today' => $this->getMetricValue($proyecto->id, 'chat', 'messages.count.daily', $today),
                'private_messages_today' => $this->getMetricValue($proyecto->id, 'chat', 'messages.private.count.daily', $today),
                'public_messages_today' => $this->getMetricValue($proyecto->id, 'chat', 'messages.public.count.daily', $today),
            ],
        ];

        return response()->json($summary);
    }

    /**
     * Get insights for a project.
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @return JsonResponse
     */
    public function insights(Request $request, Proyecto $proyecto): JsonResponse
    {
        if (!$request->user()->esMiembroDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $insights = [];

        // Calculate task completion rate
        $tasksCreated = $this->getMetricSum($proyecto->id, 'tasks', 'created.count.daily', 30);
        $tasksCompleted = $this->getMetricSum($proyecto->id, 'tasks', 'completed.count.daily', 30);

        if ($tasksCreated > 0) {
            $insights['task_completion_rate'] = round(($tasksCompleted / $tasksCreated) * 100, 2);
        }

        // Calculate financial balance trend
        $income = $this->getMetricSum($proyecto->id, 'finance', 'income.total.daily', 30);
        $expense = $this->getMetricSum($proyecto->id, 'finance', 'expense.total.daily', 30);
        $insights['financial_balance_30d'] = $income - $expense;

        // Chat activity
        $messages = $this->getMetricSum($proyecto->id, 'chat', 'messages.count.daily', 30);
        $insights['avg_messages_per_day'] = round($messages / 30, 2);

        return response()->json([
            'insights' => $insights,
            'period' => 'last_30_days',
        ]);
    }

    /**
     * Helper: Get metric value for a specific date.
     */
    private function getMetricValue(int $projectId, string $type, string $name, Carbon $date): float
    {
        $metric = AnalyticsMetric::where('proyecto_id', $projectId)
            ->where('metric_type', $type)
            ->where('metric_name', $name)
            ->whereDate('period_start', $date)
            ->first();

        return $metric ? (float) $metric->value : 0;
    }

    /**
     * Helper: Get sum of metric values over a period.
     */
    private function getMetricSum(int $projectId, string $type, string $name, int $days): float
    {
        $startDate = Carbon::now()->subDays($days);

        return AnalyticsMetric::where('proyecto_id', $projectId)
            ->where('metric_type', $type)
            ->where('metric_name', $name)
            ->where('period_start', '>=', $startDate)
            ->sum('value');
    }
}
