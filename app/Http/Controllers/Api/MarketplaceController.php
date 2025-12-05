<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Core\Modules\ModuleRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * MarketplaceController
 * 
 * API for managing modules per project.
 */
class MarketplaceController extends Controller
{
    public function __construct(
        private ModuleRegistry $registry
    ) {
    }

    /**
     * List all modules with their status for the project.
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @return JsonResponse
     */
    public function index(Request $request, Proyecto $proyecto): JsonResponse
    {
        // Authorization check
        if (!$request->user()->esMiembroDe($proyecto)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $availableModules = $this->registry->all();
        $enabledModules = $proyecto->modules ?? [];

        $modules = [];
        foreach ($availableModules as $key => $module) {
            $modules[] = [
                'id' => $key,
                'name' => $module->getName(),
                'version' => $module->getVersion(),
                'enabled' => in_array($key, $enabledModules),
                'dependencies' => $module->getDependencies(),
                'capabilities' => $module->getCapabilities(),
            ];
        }

        return response()->json($modules);
    }

    /**
     * Toggle a module for the project.
     *
     * @param Request $request
     * @param Proyecto $proyecto
     * @param string $moduleKey
     * @return JsonResponse
     */
    public function toggle(Request $request, Proyecto $proyecto, string $moduleKey): JsonResponse
    {
        // Only project owner can manage modules
        if ($proyecto->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$this->registry->has($moduleKey)) {
            return response()->json(['message' => 'Module not found'], 404);
        }

        $enabledModules = $proyecto->modules ?? [];
        $isEnabled = in_array($moduleKey, $enabledModules);

        if ($isEnabled) {
            // Disable
            // Check if other enabled modules depend on this one
            foreach ($enabledModules as $enabledKey) {
                if ($enabledKey === $moduleKey)
                    continue;

                $module = $this->registry->get($enabledKey);
                if ($module && in_array($moduleKey, $module->getDependencies())) {
                    return response()->json([
                        'message' => "Cannot disable module. '{$enabledKey}' depends on it."
                    ], 422);
                }
            }

            $enabledModules = array_values(array_diff($enabledModules, [$moduleKey]));

            // Trigger onUninstall hook (optional, if exposed)
        } else {
            // Enable
            // Check dependencies
            $module = $this->registry->get($moduleKey);
            $dependencies = $module->getDependencies();
            foreach ($dependencies as $dep) {
                if (!in_array($dep, $enabledModules)) {
                    return response()->json(['message' => "Dependency missing: $dep"], 422);
                }
            }

            $enabledModules[] = $moduleKey;

            // Trigger onInstall hook (optional, if exposed)
        }

        $proyecto->modules = array_unique($enabledModules);
        $proyecto->save();

        return response()->json([
            'status' => 'success',
            'enabled' => !$isEnabled,
            'modules' => $proyecto->modules
        ]);
    }
}
