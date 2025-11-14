<?php

namespace App\Features\Finanzas\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransaccionRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Más adelante puedes manejar permisos
    }

    public function rules()
    {
        return [
            'descripcion' => 'required|string|max:255',
            'monto'       => 'required|numeric|min:0',
            'tipo'        => 'required|in:gasto,ingreso',
            'categoria'   => 'nullable|string|max:255',
            'fecha'       => 'required|date',
            'notas'       => 'nullable|string',
        ];
    }
}
