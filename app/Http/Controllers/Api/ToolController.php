<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ToolController extends Controller
{
    /**
     * List available tools.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $enabledTools = $user->enabled_tools ?? [];

        $tools = [
            [
                'id' => 'financial-calculator',
                'name_key' => 'dashboard.calculator',
                'description_key' => 'dashboard.calculator_desc',
                'status' => 'active',
                'is_enabled' => in_array('financial-calculator', $enabledTools),
            ],
            [
                'id' => 'calendar',
                'name_key' => 'dashboard.calendar',
                'description_key' => 'dashboard.calendar_desc',
                'status' => 'coming_soon',
                'is_enabled' => in_array('calendar', $enabledTools),
            ]
        ];

        return response()->json($tools);
    }

    /**
     * Toggle the status of a tool for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tool' => 'required|string',
            'enable' => 'required|boolean',
        ]);

        $user = $request->user();
        $tool = $validated['tool'];
        $enable = $validated['enable'];

        $enabledTools = $user->enabled_tools ?? [];

        if ($enable) {
            if (!in_array($tool, $enabledTools)) {
                $enabledTools[] = $tool;
            }
        } else {
            $enabledTools = array_values(array_diff($enabledTools, [$tool]));
        }

        $user->enabled_tools = $enabledTools;
        $user->save();

        return response()->json([
            'message' => 'Tool status updated successfully.',
            'enabled_tools' => $enabledTools,
        ]);
    }
}
