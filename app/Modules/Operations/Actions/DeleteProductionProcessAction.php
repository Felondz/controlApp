<?php

declare(strict_types=1);

namespace App\Modules\Operations\Actions;

use App\Modules\Operations\Models\ProductionProcess;
use Exception;

class DeleteProductionProcessAction
{
    /**
     * @throws Exception If the process has active lotes
     */
    public function execute(ProductionProcess $process): void
    {
        // Check for active lotes
        if ($process->lotes()->where('status', 'active')->exists()) {
            throw new Exception('No se puede eliminar el proceso porque tiene lotes activos. Finalízalos o descártalos primero.');
        }

        // Delete related data (stages, recipes) handled by DB cascade
        $process->delete();
    }
}
