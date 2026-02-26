<?php declare(strict_types=1);

namespace App\Modules\Chat\Actions;

use App\Modules\Chat\DTOs\SendMessageDTO;
use App\Modules\Chat\Events\MessageSent;
use App\Modules\Chat\Models\Message;

class SendMessageAction
{
    public function execute(SendMessageDTO $dto): Message
    {
        $message = Message::create([
            'proyecto_id' => $dto->proyecto->id,
            'user_id' => $dto->userId,
            'recipient_id' => $dto->recipientId,
            'content' => $dto->content,
            'type' => $dto->type,
            'read_at' => null,
        ]);

        MessageSent::dispatch($message);

        return $message;
    }
}
