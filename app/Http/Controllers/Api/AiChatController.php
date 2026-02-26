<?php declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Proyecto;
use App\Services\AiAgentService;

class AiChatController extends Controller
{
    public function __construct(
        protected AiAgentService $agentService,
        protected \App\Http\Controllers\LlmModelsController $llmModelsController
    ) {}

    /**
     * Handle incoming chat prompts for the AI.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string'],
            'history' => ['array', 'nullable'],
            'override_provider' => ['string', 'nullable'],
            'override_model' => ['string', 'nullable'],
        ]);

        $user = $request->user();
        
        $providerToFind = $validated['override_provider'] ?? null;

        if ($providerToFind) {
            // Find the specific provider requested by the dropdown
            $setting = $user->llmSettings()->where('provider', $providerToFind)->first();
        } else {
            // Find the global active LLM setting
            $setting = $user->llmSettings()->where('is_active', true)->first();
        }

        if (!$setting || empty($setting->api_key)) {
            $msg = $providerToFind 
                ? "No se encontró una API Key válida para el proveedor " . ucfirst($providerToFind) . "."
                : "No hay ningún proveedor de Inteligencia Artificial activo configurado con una API Key válida en tu perfil.";
            return response()->json([
                'success' => false,
                'message' => $msg,
            ], 400);
        }

        $provider = $setting->provider;
        $apiKey = $setting->api_key;
        $model = $validated['override_model'] ?? $setting->default_model;

        if (empty($model)) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor, selecciona un modelo predeterminado para el proveedor ' . ucfirst($provider) . ' en tu perfil.',
            ], 400);
        }

        $prompt = $validated['prompt'];

        // Inject Context Information
        $systemPrompt = "Eres un asistente integral de la plataforma 'ControlApp'. El nombre de usuario es: {$user->name}. \n\n";
        $systemPrompt .= "Tienes a tu disposición diversas herramientas (tools/functions) para consultar información financiera, transacciones, tareas, procesos de producción e inventario.\n";
        
        // Fetch ALL projects for the user to inject their IDs and names
        $userProjects = $user->proyectos()->select('proyectos.id', 'proyectos.nombre', 'proyectos.es_personal')->get();
        if ($userProjects->isNotEmpty()) {
            $systemPrompt .= "Aquí tienes el listado de los proyectos (proyecto_id) a los que el usuario tiene acceso. MUCHAS de tus herramientas requieren proveer el 'proyecto_id'. Utiliza estos IDs según el contexto de lo que el usuario pregunte:\n";
            foreach ($userProjects as $p) {
                $tipo = $p->es_personal ? '(Finanzas Personales)' : '';
                $systemPrompt .= "- ID {$p->id}: {$p->nombre} {$tipo}\n";
            }
        } else {
             $systemPrompt .= "Advertencia: El usuario no tiene ningún proyecto configurado actualmente.";
        }

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        // Append historical messages
        if (!empty($validated['history']) && is_array($validated['history'])) {
            foreach ($validated['history'] as $historicMsg) {
                // Ensure valid roles and structure
                if (isset($historicMsg['role'], $historicMsg['content']) && in_array($historicMsg['role'], ['user', 'assistant'])) {
                    $messages[] = [
                        'role' => $historicMsg['role'],
                        'content' => $historicMsg['content']
                    ];
                }
            }
        }

        // Append the new prompt
        $messages[] = ['role' => 'user', 'content' => $prompt];

        try {
            // Get all models for the active provider to allow fallback
            $availableModels = $this->llmModelsController->fetchModelsSilently($provider, $apiKey);

            $reply = $this->agentService->runLoop($provider, $apiKey, $model, $messages, $availableModels);

            return response()->json([
                'success' => true,
                'reply' => $reply,
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to query API ($provider): " . $e->getMessage());
            $statusCode = str_contains($e->getMessage(), '429') ? 429 : 500;
            $msg = $statusCode === 429 
                ? 'Límite de peticiones alcanzado (Error 429). Note: El rate limit de Google AI Studio (15 RPM) es administrado por API Key globalmente, agotando la cuota de todos los modelos (Flash y Pro) simultáneamente. Revisa tu consola de Google.'
                : 'Error al procesar la respuesta con el modelo de lenguaje. (Verifica si excediste el límite de tu API).';
            
            return response()->json([
                'success' => false,
                'message' => $msg,
            ], $statusCode);
        }
    }
}
