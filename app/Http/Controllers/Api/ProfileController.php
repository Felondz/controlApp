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
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user,
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente',
        ]);
    }

    /**
     * Update the user's profile photo.
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072', 'dimensions:max_width=2048,max_height=2048'],
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Store new photo
        $file = $request->file('profile_photo');
        $extension = $file->getClientOriginalExtension();
        $filename = hash('sha256', $user->id . time()) . '.' . $extension;
        
        $path = $file->storeAs('profile-photos', $filename, 'public');
        $user->profile_photo_path = $path;
        $user->save();

        return response()->json([
            'message' => 'Foto de perfil actualizada',
            'profile_photo_url' => Storage::url($path),
        ]);
    }

    /**
     * Delete the user's profile photo.
     */
    public function deletePhoto(Request $request)
    {
        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
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
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Logout logic for API (revoke tokens)
        $user->tokens()->delete();

        $user->delete();

        return response()->json([
            'message' => 'Cuenta eliminada correctamente',
        ]);
    }
}
