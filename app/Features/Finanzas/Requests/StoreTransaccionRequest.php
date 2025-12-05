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
            'status' => 'nullable|in:pending,completed,cancelled',

            // --- Reglas de Validación Avanzadas ---

            // 1. Validar 'categoria_id'
            'categoria_id' => [
                'nullable', // Now nullable as per user request (required only for expenses via frontend)
                'numeric',
                // La categoría debe existir en la tabla 'categorias'
                Rule::exists('categorias', 'id')
                    // ¡Y ADEMÁS! debe pertenecer al proyecto que estamos viendo
                    ->where('proyecto_id', $proyecto->id),
            ],

            // 2. Validar 'cuenta_id'
            // 2. Validar 'cuenta_id'
            'cuenta_id' => [
                'nullable', // Can be null for pending transactions (bills)
                'numeric',
                // La cuenta debe existir en la tabla 'cuentas'
                Rule::exists('cuentas', 'id'),
                // TODO: Add proper validation for linked accounts.
                // For now, we trust the frontend list, but we should verify the account is either owned OR linked.
            ],

            // 3. Validar 'task_id' (opcional, para vincular transacción con tarea financiera)
            'task_id' => [
                'nullable',
                'numeric',
                Rule::exists('tasks', 'id')
                    ->where('project_id', $proyecto->id),
            ],
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        \Illuminate\Support\Facades\Log::error('Transaction Validation Failed:', $validator->errors()->toArray());
        \Illuminate\Support\Facades\Log::info('Request Data:', $this->all());
        parent::failedValidation($validator);
    }
}
