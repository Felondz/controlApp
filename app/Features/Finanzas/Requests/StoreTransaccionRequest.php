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
        $proyecto = $this->route('proyecto');

        return [
            'cuenta_id' => 'nullable|exists:cuentas,id',
            'categoria_id' => [
                'nullable',
                'numeric',
                Rule::exists('categorias', 'id')->where('proyecto_id', $proyecto->id),
            ],
            'monto' => 'required|numeric',
            'descripcion' => 'required|string|max:255',
            'fecha' => 'required|date',
            'notas' => 'nullable|string',
            'status' => 'nullable|in:pending,completed,cancelled',
            'task_id' => [
                'nullable',
                'numeric',
                Rule::exists('tasks', 'id')->where('project_id', $proyecto->id),
            ],
            // Payment automation fields
            'cuenta_predeterminada_id' => 'nullable|exists:cuentas,id',
            'debito_automatico' => 'boolean',
            'debito_automatico' => 'boolean',
            // Recurrence fields
            'is_recurring' => 'boolean',
            'recurrence_day' => 'nullable|integer|min:1|max:30',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        \Illuminate\Support\Facades\Log::error('Transaction Validation Failed:', $validator->errors()->toArray());
        \Illuminate\Support\Facades\Log::info('Request Data:', $this->all());
        parent::failedValidation($validator);
    }
}
