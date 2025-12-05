<?php

namespace App\Features\Finanzas\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Transaccion;

class UpdateTransaccionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        //  obtener $transaccion.
        $transaccion = $this->route('transaccion');

        // obtenemos el proyecto.
        $proyecto = $transaccion->proyecto;

        return [
            'monto' => 'sometimes|numeric',
            'fecha' => 'sometimes|date',
            'descripcion' => 'nullable|string|max:255',
            'notas' => 'nullable|string',

            'status' => 'sometimes|in:pending,completed,cancelled',
            'categoria_id' => [
                'sometimes',
                'numeric',
                Rule::exists('categorias', 'id')
                    ->where('proyecto_id', $proyecto->id),
            ],
            'cuenta_id' => [
                'nullable',
                'numeric',
                Rule::exists('cuentas', 'id'),
            ],
        ];
    }
}
