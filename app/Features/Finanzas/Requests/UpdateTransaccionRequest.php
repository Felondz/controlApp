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
            ],
        ];
    }
}
