<?php

namespace App\Features\Finanzas\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransaccionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * (La autorización real la haremos en el controlador por ahora,
     * pero este método debe devolver 'true' para que la validación se ejecute)
     */
    public function authorize(): bool
    {
        // Devolvemos true porque la autorización la haremos en el controlador
        // (revisando si $request->user()->esMiembroDe($proyecto))
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtenemos el proyecto desde la ruta (ej: /proyectos/1/...)
        $proyecto = $this->route('proyecto');

        return [
            // El 'monto' debe ser numérico (no puede ser 'abc')
            'monto' => 'required|numeric',

            // La 'fecha' debe ser una fecha válida
            'fecha' => 'required|date',

            'descripcion' => 'nullable|string|max:255',
            'notas' => 'nullable|string',

            // --- Reglas de Validación Avanzadas ---

            // 1. Validar 'categoria_id'
            'categoria_id' => [
                'required',
                'numeric',
                // La categoría debe existir en la tabla 'categorias'
                Rule::exists('categorias', 'id')
                    // ¡Y ADEMÁS! debe pertenecer al proyecto que estamos viendo
                    ->where('proyecto_id', $proyecto->id),
            ],

            // 2. Validar 'cuenta_id'
            'cuenta_id' => [
                'required',
                'numeric',
                // La cuenta debe existir en la tabla 'cuentas'
                Rule::exists('cuentas', 'id')
                    // ¡Y ADEMÁS! debe pertenecer al proyecto que estamos viendo
                    // (Esto es para las cuentas del proyecto)
                    ->where('propietario_type', 'App\Models\Proyecto')
                    ->where('propietario_id', $proyecto->id),

                // TODO: También debemos permitir cuentas PERSONALES del usuario.
                // Esta regla se volverá más compleja, pero por ahora
                // solo permitiremos cuentas del proyecto.
            ],
        ];
    }
}
