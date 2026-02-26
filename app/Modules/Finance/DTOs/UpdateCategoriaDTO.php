<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Modules\Finance\Models\Categoria;

readonly class UpdateCategoriaDTO
{
    public function __construct(
        public Categoria $categoria,
        public string $nombre,
        public string $tipo,
    ) {}
}
