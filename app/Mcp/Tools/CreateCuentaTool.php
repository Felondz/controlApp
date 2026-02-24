<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Finance\Actions\CreateCuentaAction;
use App\Modules\Finance\DTOs\CreateCuentaDTO;

class CreateCuentaTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Creates a new financial account. Amounts are in cents (e.g. 10000 = $100.00).
        Type: efectivo, banco, credito, prestamo, inversion, otro.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new CreateCuentaDTO(
            proyecto: $proyecto,
            userId: 1,
            data: [
                'nombre' => (string) $request->get('nombre'),
                'tipo' => (string) $request->get('tipo'),
                'saldo_inicial' => (int) $request->get('saldo_inicial'),
                'banco' => $request->get('banco') ? (string) $request->get('banco') : null,
                'moneda' => $request->get('moneda') ? (string) $request->get('moneda') : 'COP',
                'descripcion' => $request->get('descripcion') ? (string) $request->get('descripcion') : null,
            ],
        );

        $cuenta = app(CreateCuentaAction::class)->execute($dto);
        $balance = number_format((float) $cuenta->saldo_actual / 100, 2);

        return Response::text("Success: Account '{$cuenta->nombre}' created with ID {$cuenta->id}. Balance: \${$balance}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'nombre' => $schema->string()->description('Name of the account.'),
            'tipo' => $schema->string()->description('Type: efectivo, banco, credito, prestamo, inversion, otro.'),
            'saldo_inicial' => $schema->integer()->description('Initial balance in cents (e.g. 10000 = $100.00).'),
            'banco' => $schema->string()->description('Optional bank name.'),
            'moneda' => $schema->string()->description('Optional currency code (default: COP).'),
            'descripcion' => $schema->string()->description('Optional description.'),
        ];
        return $properties;
    }
}
