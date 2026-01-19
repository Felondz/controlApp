<?php

namespace App\Services;

use App\Modules\Operations\Models\LoteProduccion;
use Carbon\Carbon;
use Illuminate\Support\Str;

class LoteCodeService
{
    /**
     * Generate a unique sequential code for a new Lote.
     * Format: MM/YY-{SEQ} (e.g., 12/24-A01 or 12/24-001)
     * Using simple numeric sequence for readability: 12/24-001
     */
    public function generate(int $proyectoId): string
    {
        $now = Carbon::now();
        $prefix = $now->format('m/y'); // 12/24

        // Find the last code with this prefix for this project
        $lastLote = LoteProduccion::where('proyecto_id', $proyectoId)
            ->where('code', 'LIKE', "$prefix-%")
            ->orderByRaw('LENGTH(code) DESC') // Ensure we get 100 before 99
            ->orderBy('code', 'desc')
            ->first();

        if (!$lastLote) {
            return "$prefix-001";
        }

        // Extract sequence part
        // 12/24-001 -> 001
        $parts = explode('-', $lastLote->code);
        $lastSeq = end($parts);
        
        if (!is_numeric($lastSeq)) {
            // Fallback if format is different
            return "$prefix-" . Str::random(4);
        }

        $nextSeq = intval($lastSeq) + 1;
        
        // Pad with zeros to at least 3 digits
        return "$prefix-" . str_pad($nextSeq, 3, '0', STR_PAD_LEFT);
    }
}
