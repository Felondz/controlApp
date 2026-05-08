<?php declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ServerAdminController extends Controller
{
    /**
     * Dashboard principal del servidor.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Admin/Server/Index', [
            'stats' => $this->getServerStats(),
            'pulseUrl' => url('/pulse'),
        ]);
    }

    /**
     * Listado de logs disponibles.
     */
    public function logs(): \Inertia\Response
    {
        $logPath = storage_path('logs');
        $files = File::files($logPath);
        
        $logs = collect($files)->map(function ($file) {
            return [
                'name' => $file->getFilename(),
                'size' => $this->formatBytes($file->getSize()),
                'modified' => date('Y-m-d H:i:s', $file->getMTime()),
            ];
        })->sortByDesc('modified')->values();

        return Inertia::render('Admin/Server/Logs', [
            'logs' => $logs
        ]);
    }

    /**
     * Descargar log en formato original o JSON para IA.
     */
    public function downloadLog(Request $request, string $filename)
    {
        $path = storage_path("logs/{$filename}");
        if (!File::exists($path)) {
            abort(404);
        }

        if ($request->query('format') === 'json') {
            return $this->downloadAsJson($path, $filename);
        }

        return response()->download($path);
    }

    /**
     * Borrar un log.
     */
    public function deleteLog(string $filename): \Illuminate\Http\RedirectResponse
    {
        $path = storage_path("logs/{$filename}");
        if (File::exists($path)) {
            File::delete($path);
            return back()->with('success', "Log {$filename} eliminado correctamente.");
        }
        return back()->with('error', "No se encontró el archivo.");
    }

    /**
     * Listado de backups.
     */
    public function backups(): \Inertia\Response
    {
        $disk = config('backup.backup.destination.disks')[0] ?? 'local';
        $appName = config('app.name', 'Laravel');
        
        // Spatie guarda en app-name/nombre-archivo.zip
        $files = Storage::disk($disk)->allFiles($appName);
        
        $backups = collect($files)->map(function ($path) use ($disk) {
            return [
                'name' => basename($path),
                'path' => $path,
                'size' => $this->formatBytes(Storage::disk($disk)->size($path)),
                'created' => date('Y-m-d H:i:s', Storage::disk($disk)->lastModified($path)),
            ];
        })->sortByDesc('created')->values();

        return Inertia::render('Admin/Server/Backups', [
            'backups' => $backups
        ]);
    }

    /**
     * Ejecutar backup manualmente.
     */
    public function runBackup(): \Illuminate\Http\RedirectResponse
    {
        // Ejecutamos en segundo plano para no bloquear la UI
        Artisan::call('backup:run', ['--only-db' => true]);
        
        return back()->with('success', 'Backup de base de datos iniciado.');
    }

    /**
     * Descargar backup.
     */
    public function downloadBackup(string $filename): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $disk = config('backup.backup.destination.disks')[0] ?? 'local';
        $appName = config('app.name', 'Laravel');
        $path = "{$appName}/{$filename}";

        if (!Storage::disk($disk)->exists($path)) {
            abort(404);
        }

        return Storage::disk($disk)->download($path);
    }

    /**
     * Borrar backup.
     */
    public function deleteBackup(string $filename): \Illuminate\Http\RedirectResponse
    {
        $disk = config('backup.backup.destination.disks')[0] ?? 'local';
        $appName = config('app.name', 'Laravel');
        $path = "{$appName}/{$filename}";

        if (Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
            return back()->with('success', "Backup eliminado.");
        }
        return back()->with('error', "No se encontró el archivo.");
    }

    /**
     * Obtener estadísticas básicas del servidor (Linux).
     * 
     * @return array<string, string>
     */
    private function getServerStats(): array
    {
        $stats = [
            'cpu' => 'N/A',
            'memory' => 'N/A',
            'disk' => 'N/A',
            'os' => PHP_OS,
        ];

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            return $stats;
        }

        try {
            // Memoria
            $free = shell_exec('free -m');
            if ($free) {
                $free = (string)trim($free);
                $free_arr = explode("\n", $free);
                $mem = explode(" ", (string)preg_replace('/\s+/', ' ', $free_arr[1]));
                $stats['memory'] = "{$mem[2]}MB / {$mem[1]}MB";
            }

            // Disco
            $disk = shell_exec('df -h /');
            if ($disk) {
                $disk_arr = explode("\n", (string)trim($disk));
                $usage = explode(" ", (string)preg_replace('/\s+/', ' ', $disk_arr[1]));
                $stats['disk'] = "{$usage[2]} / {$usage[1]} ({$usage[4]})";
            }

            // CPU Load
            $load = sys_getloadavg();
            if ($load) {
                $stats['cpu'] = "{$load[0]} (1m), {$load[1]} (5m), {$load[2]} (15m)";
            }
        } catch (\Throwable $e) {
            // Ignorar fallos de shell_exec
        }

        return $stats;
    }

    /**
     * Formatear bytes a readable.
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = (int)floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));
        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * Convertir log plano a JSON estructurado para IA.
     */
    private function downloadAsJson(string $path, string $filename): StreamedResponse
    {
        $newFilename = str_replace('.log', '.json', $filename);
        
        return response()->streamDownload(function () use ($path) {
            $handle = fopen($path, 'r');
            if ($handle === false) {
                return;
            }
            
            $logs = [];
            
            while (($line = fgets($handle)) !== false) {
                // Regex básica para logs de Laravel: [YYYY-MM-DD HH:MM:SS] env.LEVEL: message
                if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (.*?)\.(.*?): (.*)/', $line, $matches)) {
                    $logs[] = [
                        'timestamp' => $matches[1],
                        'env' => $matches[2],
                        'level' => $matches[3],
                        'message' => trim($matches[4]),
                    ];
                } else if (!empty($logs)) {
                    // Si la línea no coincide, probablemente es parte del stack trace anterior
                    $logs[count($logs) - 1]['message'] .= "\n" . trim($line);
                }
            }
            fclose($handle);
            echo json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $newFilename, ['Content-Type' => 'application/json']);
    }
}
