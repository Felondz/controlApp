<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\UpdateCategoriaDTO;
use App\Modules\Finance\Models\Categoria;

class UpdateCategoriaAction
{
    public function execute(UpdateCategoriaDTO $dto): Categoria
    {
        $dto->categoria->update([
            'nombre' => $dto->nombre,
            'tipo' => $dto->tipo,
        ]);

        return $dto->categoria;
    }
}
