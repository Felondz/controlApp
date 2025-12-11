<?php

namespace App\Modules\Finance\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\Finance\Models\SupplyContract;
use App\Modules\Finance\Jobs\ExecuteContract;
use Carbon\Carbon;

class ProcessDueContracts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'finance:process-contracts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process all due supply contracts and generate transactions/inventory entries';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for due supply contracts...');

        // Find active contracts where next_run_at is today or in the past
        $contracts = SupplyContract::where('status', 'active')
            ->whereDate('next_run_at', '<=', Carbon::now())
            ->get();

        $count = $contracts->count();

        if ($count === 0) {
            $this->info('No due contracts found.');
            return;
        }

        $this->info("Found {$count} contracts due. dispatching jobs...");

        foreach ($contracts as $contract) {
            ExecuteContract::dispatch($contract);
            $this->info("Dispatched: {$contract->name} (ID: {$contract->id})");
        }

        $this->info('All jobs dispatched.');
    }
}
