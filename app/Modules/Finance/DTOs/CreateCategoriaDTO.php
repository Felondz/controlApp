<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Models\Proyecto;

readonly class CreateCategoriaDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public string $nombre,
        public string $tipo,
    ) {}
}
