<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCuentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $tiposPermitidos = ['efectivo', 'transferencia bancaria', 'crédito', 'inversion'];

        return [
            'nombre' => [
                'required',
                'string',
                'max:255',
                'min:2',
            ],
            'tipo' => [
                'required',
                'string',
                Rule::in($tiposPermitidos),
            ],
            'saldo_inicial' => [
                'required',
                'numeric',
                'min:0',
            ],
            'notas' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la cuenta es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'tipo.required' => 'El tipo de cuenta es obligatorio.',
            'tipo.in' => 'El tipo debe ser "efectivo", "transferencia bancaria", "crédito" o "inversion".',
            'saldo_inicial.required' => 'El saldo inicial es obligatorio.',
            'saldo_inicial.numeric' => 'El saldo inicial debe ser un número.',
            'saldo_inicial.min' => 'El saldo inicial no puede ser negativo.',
            'notas.string' => 'Las notas deben ser texto.',
            'notas.max' => 'Las notas no pueden exceder 500 caracteres.',
        ];
    }
}
