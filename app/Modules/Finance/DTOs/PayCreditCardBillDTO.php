<?php declare(strict_types=1);

namespace App\Modules\Finance\DTOs;

use App\Models\Proyecto;
use App\Modules\Finance\Models\Cuenta;

readonly class PayCreditCardBillDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public Cuenta $creditCard,
        public Cuenta $sourceAccount,
        public int $userId,
        public int $monto,
        public string $tipoPago,
    ) {}
}
