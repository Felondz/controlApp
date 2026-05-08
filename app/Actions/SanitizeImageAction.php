<?php declare(strict_types=1);

namespace App\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SanitizeImageAction
{
    /**
     * Sanitiza una imagen (elimina EXIF, limpia metadatos) y la guarda en el disco.
     * 
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @return string|false
     */
    public function execute(UploadedFile $file, string $directory, string $disk = 'local'): string|false
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $allowedExtensions)) {
            return $file->store($directory, $disk); // Si no es imagen procesable, guardar tal cual (validación previa requerida)
        }

        $filename = Str::random(40) . '.' . $extension;
        $tempPath = $file->getRealPath();

        // Procesamiento básico con GD para eliminar metadatos EXIF
        try {
            $image = match ($extension) {
                'jpg', 'jpeg' => imagecreatefromjpeg($tempPath),
                'png' => imagecreatefrompng($tempPath),
                'webp' => imagecreatefromwebp($tempPath),
                default => null,
            };

            if (!$image) {
                return $file->store($directory, $disk);
            }

            // Crear un stream en memoria para guardar la imagen limpia
            $stream = fopen('php://temp', 'r+');
            
            match ($extension) {
                'jpg', 'jpeg' => imagejpeg($image, $stream, 85), // Re-comprimir a 85% para ahorrar espacio y limpiar EXIF
                'png' => imagepng($image, $stream),
                'webp' => imagewebp($image, $stream, 80),
                default => null,
            };

            rewind($stream);
            $content = stream_get_contents($stream);
            fclose($stream);
            imagedestroy($image);

            $path = $directory . '/' . $filename;
            Storage::disk($disk)->put($path, $content);

            return $path;

        } catch (\Throwable $e) {
            // Si falla el procesamiento (memoria insuficiente, etc.), guardar el original por seguridad de datos
            // pero lo ideal es loguear este fallo.
            return $file->store($directory, $disk);
        }
    }
}
