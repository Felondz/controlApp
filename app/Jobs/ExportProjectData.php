<?php declare(strict_types=1);

namespace App\Jobs;

use App\Models\Proyecto;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExportProjectData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Proyecto $proyecto,
        public User $user,
        public string $format = 'pdf', // 'pdf' or 'csv'
        public array $filters = []
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fileName = "export-{$this->proyecto->id}-" . Str::random(8) . ".{$this->format}";
        $path = "exports/{$fileName}";

        if ($this->format === 'pdf') {
            $this->generatePdf($path);
        } else {
            $this->generateCsv($path);
        }

        // In a real app, we would notify the user here via Database or Mail
        // For now, we log the completion and the path.
        Log::info("Export created for project {$this->proyecto->id} by user {$this->user->id}: {$path}");
    }

    protected function generatePdf(string $path): void
    {
        $type = $this->filters['type'] ?? 'summary';
        $query = $this->proyecto->transacciones()->with(['categoria', 'cuenta']);

        if (!empty($this->filters['from'])) {
            $query->where('fecha', '>=', $this->filters['from']);
        }
        if (!empty($this->filters['to'])) {
            $query->where('fecha', '<=', $this->filters['to']);
        }

        $transactions = $query->get();
        
        $totalIncome = $transactions->where('monto', '>', 0)->sum('monto') / 100;
        $totalExpenses = abs($transactions->where('monto', '<', 0)->sum('monto')) / 100;
        $balance = $totalIncome - $totalExpenses;

        $pdf = Pdf::loadView('exports.project-pdf', [
            'proyecto' => $this->proyecto,
            'transactions' => $transactions,
            'accounts' => $this->proyecto->cuentas,
            'categories' => $this->proyecto->categorias,
            'type' => $type,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'balance' => $balance,
            'from' => $this->filters['from'] ?? null,
            'to' => $this->filters['to'] ?? null,
        ]);

        Storage::disk('public')->put($path, $pdf->output());
    }

    protected function generateCsv(string $path): void
    {
        $type = $this->filters['type'] ?? 'transactions';
        $content = "";
        
        if ($type === 'transactions') {
            $content .= "Fecha,Descripcion,Monto,Categoria,Cuenta,Tipo\n";
            $query = $this->proyecto->transacciones()->with(['categoria', 'cuenta']);
            
            if (!empty($this->filters['from'])) {
                $query->where('fecha', '>=', $this->filters['from']);
            }
            if (!empty($this->filters['to'])) {
                $query->where('fecha', '<=', $this->filters['to']);
            }

            foreach ($query->get() as $t) {
                $row = [
                    $t->fecha,
                    $t->descripcion,
                    $t->monto / 100,
                    $t->categoria->nombre ?? 'Sin categoría',
                    $t->cuenta->nombre ?? 'Sin cuenta',
                    $t->monto > 0 ? 'Ingreso' : 'Gasto',
                ];
                $content .= implode(',', $row) . "\n";
            }
        }
        // ... (Adding other types if needed, similar to the controller)

        Storage::disk('public')->put($path, $content);
    }
}
