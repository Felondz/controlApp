<?php declare(strict_types=1);

namespace App\Modules\Finance\GraphQL\Mutations;

use App\Models\Proyecto;
use App\Modules\Finance\Actions\CreateCategoriaAction;
use App\Modules\Finance\Actions\CreateCuentaAction;
use App\Modules\Finance\Actions\CreateTransaccionAction;
use App\Modules\Finance\Actions\DeleteCategoriaAction;
use App\Modules\Finance\Actions\DeleteCuentaAction;
use App\Modules\Finance\Actions\DeleteTransaccionAction;
use App\Modules\Finance\Actions\PayBillDirectlyAction;
use App\Modules\Finance\Actions\PayCreditCardBillAction;
use App\Modules\Finance\Actions\UpdateCategoriaAction;
use App\Modules\Finance\Actions\UpdateCuentaAction;
use App\Modules\Finance\Actions\UpdateCuentaEstadoAction;
use App\Modules\Finance\Actions\UpdateTransaccionAction;
use App\Modules\Finance\DTOs\CreateCategoriaDTO;
use App\Modules\Finance\DTOs\CreateCuentaDTO;
use App\Modules\Finance\DTOs\CreateTransaccionDTO;
use App\Modules\Finance\DTOs\PayCreditCardBillDTO;
use App\Modules\Finance\DTOs\UpdateCategoriaDTO;
use App\Modules\Finance\DTOs\UpdateCuentaDTO;
use App\Modules\Finance\DTOs\UpdateCuentaEstadoDTO;
use App\Modules\Finance\DTOs\UpdateTransaccionDTO;
use App\Modules\Finance\Models\Categoria;
use App\Modules\Finance\Models\Cuenta;
use App\Modules\Finance\Models\Transaccion;

class FinanceMutations
{
    // ──── Transacciones ────

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function createTransaccion(mixed $_, array $args): Transaccion
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        $dto = new CreateTransaccionDTO(
            proyecto: $proyecto,
            userId: (string) auth()->id(),
            cuentaId: (string) $args['cuenta_id'],
            categoriaId: (int) $args['categoria_id'],
            monto: (float) $args['monto'],
            fecha: (string) $args['fecha'],
            titulo: $args['titulo'] ?? null,
            descripcion: $args['descripcion'] ?? null,
            notas: $args['notas'] ?? null,
            status: $args['status'] ?? 'completed',
            cuentaPredeterminadaId: isset($args['cuenta_predeterminada_id']) ? (int) $args['cuenta_predeterminada_id'] : null,
            debitoAutomatico: (bool) ($args['debito_automatico'] ?? false),
            isRecurring: (bool) ($args['is_recurring'] ?? false),
            recurrenceDay: isset($args['recurrence_day']) ? (int) $args['recurrence_day'] : null,
            cuotas: isset($args['cuotas']) ? (int) $args['cuotas'] : null,
            taskId: isset($args['task_id']) ? (int) $args['task_id'] : null,
        );

        return app(CreateTransaccionAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function updateTransaccion(mixed $_, array $args): Transaccion
    {
        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::findOrFail($args['id']);

        $data = collect($args)->except('id')->toArray();

        $dto = new UpdateTransaccionDTO(
            transaccion: $transaccion,
            data: $data,
        );

        return app(UpdateTransaccionAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function deleteTransaccion(mixed $_, array $args): bool
    {
        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::findOrFail($args['id']);

        app(DeleteTransaccionAction::class)->execute($transaccion);

        return true;
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function payBillDirectly(mixed $_, array $args): Transaccion
    {
        /** @var Transaccion $transaccion */
        $transaccion = Transaccion::findOrFail($args['id']);

        return app(PayBillDirectlyAction::class)->execute($transaccion);
    }

    // ──── Cuentas ────

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function createCuenta(mixed $_, array $args): Cuenta
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        $data = collect($args)->except('proyecto_id')->toArray();

        $dto = new CreateCuentaDTO(
            proyecto: $proyecto,
            userId: (string) auth()->id(),
            data: $data,
        );

        return app(CreateCuentaAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function updateCuenta(mixed $_, array $args): Cuenta
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::findOrFail($args['id']);

        $data = collect($args)->except('id', 'proyecto_id')->toArray();

        $dto = new UpdateCuentaDTO(
            cuenta: $cuenta,
            data: $data,
        );

        return app(UpdateCuentaAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function deleteCuenta(mixed $_, array $args): bool
    {
        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::findOrFail($args['id']);

        app(DeleteCuentaAction::class)->execute($cuenta);

        return true;
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function updateCuentaEstado(mixed $_, array $args): Cuenta
    {
        /** @var Cuenta $cuenta */
        $cuenta = Cuenta::findOrFail($args['id']);

        $dto = new UpdateCuentaEstadoDTO(
            cuenta: $cuenta,
            estado: (string) $args['estado'],
        );

        return app(UpdateCuentaEstadoAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     * @return array{transaccion: Transaccion, nuevo_saldo_origen: int, nuevo_saldo_tc: int}
     */
    public function payCreditCardBill(mixed $_, array $args): array
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        /** @var Cuenta $creditCard */
        $creditCard = Cuenta::findOrFail($args['cuenta_id']);

        /** @var Cuenta $sourceAccount */
        $sourceAccount = Cuenta::findOrFail($args['cuenta_origen_id']);

        $dto = new PayCreditCardBillDTO(
            proyecto: $proyecto,
            creditCard: $creditCard,
            sourceAccount: $sourceAccount,
            userId: (string) auth()->id(),
            monto: $args['monto'],
            tipoPago: (string) $args['tipo_pago'],
        );

        return app(PayCreditCardBillAction::class)->execute($dto);
    }

    // ──── Categorías ────

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function createCategoria(mixed $_, array $args): Categoria
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        $dto = new CreateCategoriaDTO(
            proyecto: $proyecto,
            nombre: (string) $args['nombre'],
            tipo: (string) $args['tipo'],
        );

        return app(CreateCategoriaAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function updateCategoria(mixed $_, array $args): Categoria
    {
        /** @var Categoria $categoria */
        $categoria = Categoria::findOrFail($args['id']);

        $dto = new UpdateCategoriaDTO(
            categoria: $categoria,
            nombre: (string) $args['nombre'],
            tipo: (string) $args['tipo'],
        );

        return app(UpdateCategoriaAction::class)->execute($dto);
    }

    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     */
    public function deleteCategoria(mixed $_, array $args): bool
    {
        /** @var Categoria $categoria */
        $categoria = Categoria::findOrFail($args['id']);

        app(DeleteCategoriaAction::class)->execute($categoria);

        return true;
    }
}
