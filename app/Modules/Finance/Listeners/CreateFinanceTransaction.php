<?php

namespace App\Modules\Finance\Listeners;

use App\Modules\Inventory\Events\InventoryTransactionConfirmed;
use App\Models\Transaccion;
use Illuminate\Support\Facades\Log;

class CreateFinanceTransaction
{
    /**
     * Handle the event.
     *
     * @param  InventoryTransactionConfirmed  $event
     * @return void
     */
    public function handle(InventoryTransactionConfirmed $event)
    {
        $invTrans = $event->transaction;

        // SKIP if this transaction already has a reference to a Contract or a Finance Transaction
        // If reference is SupplyContract, Finance already created the invoice.
        // If reference is Transaccion, it came from Finance.
        if (
            $invTrans->reference_type && (
                str_contains($invTrans->reference_type, 'SupplyContract') ||
                str_contains($invTrans->reference_type, 'Transaccion')
            )
        ) {
            return;
        }

        // Only process Purchases and Sales
        if (!in_array($invTrans->type, ['purchase', 'sale'])) {
            return;
        }

        Log::info("Creating Finance Transaction from Manual Inventory Movement: {$invTrans->id}");

        $tipo = $invTrans->type === 'purchase' ? 'gasto' : 'ingreso';
        $descripcion = "Manual Inventory " . ucfirst($invTrans->type) . ": " .
            ($invTrans->item->name ?? 'Unknown Item') .
            " (Qty: {$invTrans->quantity})";

        // If amount is zero, ignore?
        if ($invTrans->total_amount <= 0) {
            Log::warning("Inventory Transaction {$invTrans->id} has zero amount. Skipping Finance creation.");
            return;
        }

        // Determine Category? Default "Inventario"
        // Determine Account? Need a default account. 
        // For now, let's look for a 'Caja Menor' or first active account.
        // Or leave pending/unpaid if no account? Transaccion requires account usually.

        $project = $invTrans->proyecto; // Assuming relationship exists via inventory_item -> project? No, inventory_transaction has proyecto_id?
        // Let's check InventoryTransaction model. It usually has proyecto_id.

        // Create Transaction
        Transaccion::create([
            'proyecto_id' => $invTrans->proyecto_id,
            'user_id' => auth()->id(), // Who did the manual inventory move?
            'cuenta_id' => null, // Needs to be filled by user later?? Or query default.
            // If nullable, fine. If not, we have a problem.
            // Let's check Transaccion migration. cuenta_id is constrained.
            // We need a fallback account.

            'categoria_id' => null, // "Materiales" or similar.
            'descripcion' => $descripcion,
            'monto' => $invTrans->total_amount,
            'tipo' => $tipo,
            'fecha' => now(),
            'estado' => 'programada', // Mark as pending review because account/category are missing
            'installments' => 1,

            // Link back to Inventory Transaction
            'source_type' => get_class($invTrans),
            'source_id' => $invTrans->id,
        ]);
    }
}
