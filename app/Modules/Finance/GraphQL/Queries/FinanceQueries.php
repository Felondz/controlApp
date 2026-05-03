<?php declare(strict_types=1);

namespace App\Modules\Finance\GraphQL\Queries;

use App\Models\Proyecto;
use Illuminate\Database\Eloquent\Collection;

class FinanceQueries
{
    /**
     * @param  mixed  $_
     * @param  array<string, mixed>  $args
     * @return Collection<int, \App\Modules\Finance\Models\Cuenta>
     */
    public function cuentas(mixed $_, array $args): Collection
    {
        /** @var Proyecto $proyecto */
        $proyecto = Proyecto::findOrFail($args['proyecto_id']);

        // Load both owned accounts and associated accounts
        $proyecto->load(['cuentas', 'cuentasAsociadas']);

        return $proyecto->cuentas->concat($proyecto->cuentasAsociadas);
    }
}
