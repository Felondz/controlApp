<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): \Illuminate\Http\JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $validatedData = $request->validated();
        
        // Handle basic information and theme
        $user->fill($validatedData);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle profile photo if provided in the same request
        $imageFile = $request->file('image') ?? $request->file('profile_photo');
        
        if ($imageFile instanceof \Illuminate\Http\UploadedFile) {
            // Delete old photo if exists
            if ($user->profile_photo_path) {
                Storage::disk('local')->delete($user->profile_photo_path);
            }

            $path = (new \App\Actions\SanitizeImageAction())->execute($imageFile, 'profile-photos', 'local');
            if ($path) {
                $user->profile_photo_path = $path;
            }
        }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente',
        ]);
    }

    /**
     * Update the user's profile photo.
     */
    public function uploadPhoto(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'profile_photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096', 'dimensions:max_width=2048,max_height=2048'],
        ]);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Delete old photo if exists
        if ($user->profile_photo_path) {
            Storage::disk('local')->delete($user->profile_photo_path);
        }

        $file = $request->file('profile_photo');
        $path = (new \App\Actions\SanitizeImageAction())->execute($file, 'profile-photos', 'local');
        if (!$path) {
            return response()->json(['message' => 'Error al guardar la imagen'], 500);
        }

        $user->forceFill([
            'profile_photo_path' => $path,
        ])->save();

        return response()->json([
            'message' => 'Foto de perfil actualizada correctamente.',
            'profile_photo_url' => $user->profile_photo_url,
        ]);
    }

    /**
     * Delete the user's profile photo.
     */
    public function deletePhoto(Request $request): \Illuminate\Http\JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        if ($user->profile_photo_path) {
            Storage::disk('local')->delete($user->profile_photo_path);
            $user->profile_photo_path = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Foto de perfil eliminada',
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Logout logic for API (revoke tokens)
        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'message' => 'Cuenta eliminada correctamente',
        ]);
    }
}
