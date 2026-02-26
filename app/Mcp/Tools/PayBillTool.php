<?php declare(strict_types=1);

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;
use App\Models\Proyecto;
use App\Modules\Finance\Models\Transaccion;
use App\Modules\Finance\Actions\PayBillDirectlyAction;

class PayBillTool extends Tool
{
    protected string $description = <<<'MARKDOWN'
        Pays a pending bill using its default account. Only works on pending transactions with a cuenta_predeterminada_id.
    MARKDOWN;

    public function handle(Request $request): Response
    {
        if ($request->get('confirm_action') !== true) {
            return Response::text("Error: This is a destructive action. You must explicitly ask the user for confirmation. If they agree, retry this tool call with confirm_action set to true.");
        }

        $proyectoId = (int) $request->get('proyecto_id');

        /** @var Proyecto|null $proyecto */
        $proyecto = Proyecto::find($proyectoId);
        if (!$proyecto) {
            return Response::text("Project with ID {$proyectoId} not found.");
        }

        /** @var Transaccion|null $transaccion */
        $transaccion = Transaccion::where('proyecto_id', $proyecto->id)->find((int) $request->get('transaccion_id'));
        if (!$transaccion) {
            return Response::text("Transaction not found.");
        }

        try {
            $paid = app(PayBillDirectlyAction::class)->execute($transaccion);
            $amount = number_format((float) $paid->monto / 100, 2);
            return Response::text("Success: Bill paid. Transaction {$paid->id}, amount \${$amount}.");
        } catch (\Exception $e) {
            return Response::text("Error: {$e->getMessage()}");
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        /** @var array<string, \Illuminate\Contracts\JsonSchema\JsonSchema> $properties */
        $properties = [
            'proyecto_id' => $schema->integer()->description('The ID of the project/hacienda.'),
            'transaccion_id' => $schema->integer()->description('The ID of the pending bill to pay.'),
            'confirm_action' => $schema->boolean()->description('REQUIRED: Set to true ONLY if the user has explicitly confirmed they want to pay this bill.'),
        ];
        return $properties;
    }
}
