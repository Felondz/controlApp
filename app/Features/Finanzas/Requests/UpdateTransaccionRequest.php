<?php

namespace App\Features\Finanzas\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransaccionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // La autorización la hacemos en el controlador
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
            // 'sometimes' significa: si el campo viene en el request, valídalo.
            // Si no viene, ignóralo.
            'monto' => 'sometimes|numeric',
            'fecha' => 'sometimes|date',
            'descripcion' => 'nullable|string|max:255',
            'notas' => 'nullable|string',

            'categoria_id' => [
                'sometimes',
                'numeric',
                Rule::exists('categorias', 'id')
                    ->where('proyecto_id', $proyecto->id),
            ],

            'cuenta_id' => [
                'sometimes',
                'numeric',
                Rule::exists('cuentas', 'id')
                    ->where('propietario_type', 'App\Models\Proyecto')
                    ->where('propietario_id', $proyecto->id),
                // TODO: Añadir lógica para cuentas personales
            ],
        ];
    }
}
