<?php declare(strict_types=1);

namespace App\Modules\Finance\Actions;

use App\Modules\Finance\DTOs\CreateCategoriaDTO;
use App\Modules\Finance\Models\Categoria;

class CreateCategoriaAction
{
    public function execute(CreateCategoriaDTO $dto): Categoria
    {
        return Categoria::create([
            'proyecto_id' => $dto->proyecto->id,
            'nombre' => $dto->nombre,
            'tipo' => $dto->tipo,
        ]);
    }
}
