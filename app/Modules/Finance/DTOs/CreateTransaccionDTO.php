<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Models\Proyecto;

readonly class CreateTransaccionDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public string $userId,
        public string $cuentaId,
        public int $categoriaId,
        public float $monto,
        public string $fecha,
        public ?string $titulo,
        public ?string $descripcion,
        public ?string $notas,
        public string $status = 'completed',
        public ?int $cuentaPredeterminadaId = null,
        public bool $debitoAutomatico = false,
        public ?string $fechaAutopago = null,
        public bool $isRecurring = false,
        public ?string $recurrenceInterval = null,
        public ?int $recurrenceDay = null,
        public ?int $cuotas = null,
        public ?int $taskId = null,
        public ?string $numeroFactura = null,
        public ?string $fechaEmision = null,
        public ?string $fechaVencimiento = null,
    ) {}
}
