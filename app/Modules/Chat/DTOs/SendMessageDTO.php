<?php declare(strict_types=1);

namespace App\Modules\Chat\DTOs;

use App\Models\Proyecto;

readonly class SendMessageDTO
{
    public function __construct(
        public Proyecto $proyecto,
        public int $userId,
        public string $content,
        public string $type = 'text',
        public ?int $recipientId = null,
    ) {}
}
