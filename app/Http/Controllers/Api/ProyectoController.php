<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Http\Requests\StoreProyectoRequest;
use App\Http\Requests\UpdateProyectoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\JsonResponse;

/**
 * @tags Projects
 * 
 * APIs for managing Projects (Proyectos).
 */
class ProyectoController extends Controller
{
    /**
     * Muestra los proyectos del usuario autenticado.
     */
    /**
     * List Projects
     * 
     * Get a list of all projects the authenticated user belongs to.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $proyectos = $user->proyectos;
        return response()->json($proyectos);
    }

    /**
     * Almacena un nuevo proyecto.
     */
    /**
     * Create Project
     * 
     * Create a new project and assign the authenticated user as Admin.
     */
    public function store(StoreProyectoRequest $request): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validatedData = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = $request->file('image');
            $imagePath = $file->store('project-images', 'public');
        }

        $proyecto = Proyecto::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'] ?? null,
            'moneda_default' => $validatedData['moneda_default'] ?? 'COP',
            'user_id' => $user->id,
            'es_personal' => false,
            'visible_en_listado' => true,
            'modules' => $validatedData['modules'],
            'color' => $validatedData['color'] ?? null,
            'icon' => $validatedData['icon'] ?? null,
            'image_path' => $imagePath ?: null,
            'theme' => $validatedData['theme'] ?? 'purple-modern',
            'typography' => $validatedData['typography'] ?? 'sans',
        ]);

        $proyecto->miembros()->attach($user->id, ['rol' => 'admin']);

        return response()->json($proyecto->load('miembros'), 201);
    }

    /**
     * Muestra un proyecto específico.
     */
    /**
     * Show Project
     * 
     * Get details of a specific project.
     * Requires the user to be a member.
     */
    public function show(Request $request, Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Para 'ver', solo necesita ser miembro
        abort_if(!$user->esMiembroDe($proyecto), 403, 'No tienes permiso para ver este proyecto.');

        // Cargar relaciones base
        $relations = ['miembros', 'categorias'];

        // Solo cargar cuentas (finanzas) si es admin
        if ($user->esAdminDe($proyecto)) {
            $relations[] = 'cuentas';
        }

        return response()->json($proyecto->load($relations));
    }

    /**
     * Actualiza un proyecto específico.
     */
    /**
     * Update Project
     * 
     * Update project details like name, description, and theme.
     * accessible only by Project Admins.
     */
    public function update(UpdateProyectoRequest $request, Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // solo un 'admin' puede editar.
        abort_if(!$user->esAdminDe($proyecto), 403, 'Solo los administradores pueden editar este proyecto.');

        $validatedData = $request->validated();
        $dataToUpdate = [];

        $fields = ['nombre', 'descripcion', 'moneda_default', 'color', 'icon', 'theme', 'typography', 'settings', 'modules'];
        foreach ($fields as $field) {
            if (isset($validatedData[$field])) {
                $dataToUpdate[$field] = $validatedData[$field];
            }
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists (optional but recommended)
            if ($proyecto->image_path) {
                Storage::disk('public')->delete($proyecto->image_path);
            }
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = $request->file('image');
            $imagePath = $file->store('project-images', 'public');
            if ($imagePath) {
                $dataToUpdate['image_path'] = $imagePath;
            }
        }

        $proyecto->update($dataToUpdate);
        return response()->json($proyecto);
    }

    /**
     * Elimina un proyecto.
     */
    /**
     * Delete Project
     * 
     * Permanently delete a project and all its resources.
     * Accessible only by Project Admins.
     */
    public function destroy(Request $request, Proyecto $proyecto): JsonResponse|\Illuminate\Http\Response
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // solo un 'admin' puede eliminar.
        abort_if(!$user->esAdminDe($proyecto), 403, 'Solo los administradores pueden eliminar este proyecto.');

        $proyecto->delete();
        return response()->noContent();
    }

    /**
     * Actualiza la configuración del proyecto (ej: widgets).
     * API endpoint for mobile apps.
     */
    /**
     * Update Project Settings
     * 
     * Update JSON-based settings for the project (e.g. enabled widgets).
     */
    public function updateSettings(Request $request, Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        abort_if(!$user->esAdminDe($proyecto), 403, 'Solo los administradores pueden modificar la configuración.');

        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        // Merge existing settings with new ones
        $currentSettings = $proyecto->settings ?? [];
        $newSettings = array_merge((array)$currentSettings, (array)$validated['settings']);

        $proyecto->settings = $newSettings;
        $proyecto->save();

        return response()->json([
            'success' => true,
            'message' => 'Configuración actualizada correctamente',
            'settings' => $proyecto->settings,
        ]);
    }

    /**
     * Transfer project ownership to another member.
     * API endpoint for mobile apps.
     */
    /**
     * Transfer Ownership
     * 
     * Transfer the ownership of the project to another Admin member.
     * Requires password confirmation.
     */
    public function transferOwnership(Request $request, Proyecto $proyecto): JsonResponse
    {
        /** @var \App\Models\User|null $user */
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Only the current Owner can transfer ownership
        if ($user->id !== $proyecto->user_id) {
            return response()->json([
                'message' => 'Solo el Dueño del proyecto puede transferir la propiedad.'
            ], 403);
        }

        $validated = $request->validate([
            'new_owner_id' => 'required|exists:users,id',
            'password' => 'required|current_password',
        ]);

        /** @var \App\Models\User $newOwner */
        $newOwner = \App\Models\User::findOrFail($validated['new_owner_id']);

        // Ensure the new owner is a member of the project
        if (!$newOwner->esMiembroDe($proyecto)) {
            return response()->json([
                'message' => 'El nuevo dueño debe ser miembro del proyecto.'
            ], 422);
        }

        // Ensure the new owner is ALREADY an Admin
        if (!$newOwner->esAdminDe($proyecto)) {
            return response()->json([
                'message' => 'El usuario debe ser Administrador para recibir la propiedad.'
            ], 422);
        }

        // Update project owner
        $proyecto->user_id = (int)$newOwner->id;
        $proyecto->save();

        // Ensure the old owner remains as admin
        if (!$user->esAdminDe($proyecto)) {
            $proyecto->miembros()->updateExistingPivot($user->id, ['rol' => 'admin']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Propiedad del proyecto transferida exitosamente.',
            'new_owner' => $newOwner->only(['id', 'name', 'email']),
        ]);
    }
}
