<?php

namespace App\Features\Finanzas\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransaccionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'sometimes|required|string|max:255',
            'monto'       => 'sometimes|required|numeric|min:0',
            'tipo'        => 'sometimes|required|in:gasto,ingreso',
            'categoria'   => 'nullable|string|max:255',
            'fecha'       => 'sometimes|required|date',
            'notas'       => 'nullable|string',
        ];
    }
}
