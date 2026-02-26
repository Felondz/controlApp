<?php

namespace App\Modules\Inventory\Listeners;

use App\Core\Events\Contracts\ModuleEvent;
use App\Modules\Operations\Events\InputConsumed;
use App\Modules\Operations\Models\LoteInsumo;
use App\Modules\Inventory\Services\InventoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * DeductInventoryUsage Listener
 * 
 * Deducts stock from inventory when an input is indicated as consumed by Operations.
 * Runs asynchronously via Redis queue.
 */
class DeductInventoryUsage implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The name of the connection the job should be sent to.
     *
     * @var string|null
     */
    public $connection = 'redis';

    protected InventoryService $inventoryService;

    /**
     * Create the event listener.
     */
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Handle the event.
     *
     * @param ModuleEvent $event
     * @return void
     */
    public function handle(ModuleEvent $event): void
    {
        // Only handle operations.input.consumed
        if ($event->getName() !== 'operations.input.consumed') {
            return;
        }

        // Get data from event
        if ($event instanceof InputConsumed) {
            $input = $event->input;
        } else {
            // Fallback: load from payload
            $inputId = $event->get('input_id');
            $input = LoteInsumo::with('lote')->find($inputId);
            
            if (!$input) {
                Log::channel('modules')->warning("DeductInventoryUsage: Could not find input", [
                    'input_id' => $inputId,
                ]);
                return;
            }
        }

        if (!$input->inventory_item_id) {
            return; 
        }

        $qty = $input->quantity;

        if ($qty <= 0) {
            return;
        }

        Log::channel('modules')->info("DeductInventoryUsage: Input Consumed [{$input->id}]. Deducting {$qty} from Inventory Item {$input->inventory_item_id}");

        try {
            // Deduct stock via service (transaction type 'production_out')
            $this->inventoryService->registerTransaction(
                $input->lote->proyecto_id,
                $input->inventory_item_id,
                'production_out',
                -$qty, 
                0, // unit price
                get_class($input),
                $input->id,
                "Consumed in Lote: " . ($input->lote->code ?? 'N/A'),
                $input->lote->assigned_to
            );
    
            Log::channel('modules')->info("DeductInventoryUsage: Stock deduction created for Input {$input->id}");
        } catch (\Exception $e) {
            Log::channel('modules')->error("DeductInventoryUsage: Failed to register transaction: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
