<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProfilePhotoController extends Controller
{
    /**
     * Serve a user's profile photo securely.
     */
    public function show(User $user): BinaryFileResponse
    {
        // En una aplicación colaborativa, las fotos de perfil suelen ser visibles
        // para todos los usuarios autenticados.
        
        if (!$user->profile_photo_path || !Storage::disk("local")->exists($user->profile_photo_path)) {
            abort(404);
        }

        // Devolver el archivo desde el almacenamiento privado usando la ruta absoluta del disco
        return response()->file(Storage::disk('local')->path($user->profile_photo_path), [
            'Cache-Control' => 'private, max-age=86400',
        ]);
    }
}
