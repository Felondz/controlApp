<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Finance\Actions\CreateTransaccionAction;
use App\Modules\Finance\DTOs\CreateTransaccionDTO;

class CreateTransaccionTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Creates a new financial transaction (income or expense).
        Amounts are in cents (e.g. 10000 = $100.00). Positive = income, negative = expense.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        $dto = new CreateTransaccionDTO(
            proyecto: $proyecto,
            userId: 1,
            cuentaId: (int) $request->get('cuenta_id'),
            categoriaId: (int) $request->get('categoria_id'),
            monto: (float) $request->get('monto'),
            fecha: (string) $request->get('fecha'),
            titulo: $request->get('titulo') ? (string) $request->get('titulo') : null,
            descripcion: $request->get('descripcion') ? (string) $request->get('descripcion') : null,
            notas: $request->get('notas') ? (string) $request->get('notas') : null,
        );

        $transaccion = app(CreateTransaccionAction::class)->execute($dto);
        $amount = number_format((float) $transaccion->monto / 100, 2);

        return Response::text("Success: Transaction created with ID {$transaccion->id}. Amount: \${$amount}.");
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'cuenta_id' => $schema->integer()->description('The ID of the account to use.'),
            'categoria_id' => $schema->integer()->description('The ID of the category.'),
            'monto' => $schema->number()->description('Amount in cents. Positive = income, negative = expense.'),
            'fecha' => $schema->string()->description('Transaction date (YYYY-MM-DD).'),
            'titulo' => $schema->string()->description('Optional title.'),
            'descripcion' => $schema->string()->description('Optional description.'),
            'notas' => $schema->string()->description('Optional notes.'),
        ];
        return $properties;
    }
}
