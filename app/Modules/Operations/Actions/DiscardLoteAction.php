<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\DTOs\DiscardLoteDTO;
use App\Modules\Operations\Models\LoteProduccion;
use Exception;

class DiscardLoteAction
{
    /**
     * @throws Exception If lote is not active
     */
    public function execute(DiscardLoteDTO $dto): LoteProduccion
    {
        $lote = $dto->lote;

        if ($lote->status !== 'active') {
             throw new Exception('Solo se pueden descartar lotes activos.');
        }

        \App\Modules\Operations\Events\LoteDiscarded::dispatch($lote, $dto->reason);

        return $lote;
    }
}
