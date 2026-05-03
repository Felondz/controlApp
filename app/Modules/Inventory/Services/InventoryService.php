<?php

namespace App\Modules\Inventory\Services;

use App\Modules\Inventory\Models\InventoryTransaction;
use App\Modules\Inventory\Events\InventoryTransactionConfirmed;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryService
{
    /**
     * Register a new inventory transaction.
     */
    public function registerTransaction(
        string $proyectoId,
        int $itemId,
        string $type,
        float $quantity,
        float $unitPrice,
        ?string $referenceType,
        ?string $referenceId,
        ?string $notes,
        ?string $userId
    ): InventoryTransaction {
        // Validate type
        $validTypes = ['purchase', 'sale', 'adjustment', 'production_in', 'production_out', 'transfer'];
        if (!in_array($type, $validTypes)) {
            throw new Exception("Invalid transaction type: $type");
        }

        return DB::transaction(function () use ($proyectoId, $itemId, $type, $quantity, $unitPrice, $referenceType, $referenceId, $notes, $userId) {
            $transaction = InventoryTransaction::create([
                'proyecto_id' => $proyectoId,
                'inventory_item_id' => $itemId,
                'user_id' => $userId,
                'type' => $type,
                'quantity' => $quantity, // Should be signed correctly by caller or logic? Let's assume caller sends signed or we enforce sign based on type.
                // For now, let's assume signed quantity is passed, OR we enforce sign.
                // Best practice: Store absolute quantity in 'quantity' field IF we had 'direction', but model has single 'quantity'.
                // Convention: + add, - remove.
                'unit_price' => $unitPrice,
                'total_amount' => $quantity * $unitPrice,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'notes' => $notes,
                'status' => 'confirmed',
                'transaction_date' => now(),
            ]);

            // Dispatch event confirmed via Observer
            // InventoryTransactionConfirmed::dispatch($transaction);

            return $transaction;
        });
    }
}
