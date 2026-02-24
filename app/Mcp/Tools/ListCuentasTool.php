<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;

class ListCuentasTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Lists financial accounts for a project. Optionally filter by status (activa, inactiva) or type (efectivo, banco, credito, prestamo, inversion).
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $owned = $proyecto->cuentas();
        $linked = $proyecto->cuentasAsociadas();

        $estado = $request->get('estado') ? (string) $request->get('estado') : 'activa';
        $owned->where('estado', $estado);
        $linked->where('estado', $estado);

        $tipo = $request->get('tipo');
        if ($tipo) {
            $owned->where('tipo', (string) $tipo);
            $linked->where('tipo', (string) $tipo);
        }

        $cuentas = $owned->get()->merge($linked->get());

        if ($cuentas->isEmpty()) {
            return Response::text("No accounts found for project {$proyectoId}.");
        }

        $result = "Accounts:\n";
        foreach ($cuentas as $cuenta) {
            $balance = number_format((float) $cuenta->saldo_actual / 100, 2);
            $result .= "- [{$cuenta->id}] {$cuenta->nombre} | Type: {$cuenta->tipo} | Balance: \${$balance} | Status: {$cuenta->estado}\n";
        }

        return Response::text($result);
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'estado' => $schema->string()->description('Optional: activa (default), inactiva, cerrada.'),
            'tipo' => $schema->string()->description('Optional: efectivo, banco, credito, prestamo, inversion, otro.'),
        ];
        return $properties;
    }
}
