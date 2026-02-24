<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\Models\Categoria;
use Exception;

class DeleteCategoriaAction
{
    /**
     * @throws Exception
     */
    public function execute(Categoria $categoria): void
    {
        if ($categoria->transacciones()->exists()) {
            throw new Exception('No se puede eliminar una categoría con transacciones asociadas.');
        }

        $categoria->delete();
    }
}
