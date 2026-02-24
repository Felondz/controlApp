<?php

namespace App\Modules\Finance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Modules\Finance\Models\Transaccion;

class UpdateTransaccionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {

        //  obtener $transaccion.
        /** @var \App\Modules\Finance\Models\Transaccion $transaccion */
        $transaccion = $this->route('transaccion');

        // obtenemos el proyecto.
        $proyecto = $transaccion?->proyecto;

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
                    ->where('proyecto_id', $proyecto?->id),
            ],
            'cuenta_id' => [
                'nullable',
                'numeric',
                Rule::exists('cuentas', 'id'),
            ],
        ];
    }
}
