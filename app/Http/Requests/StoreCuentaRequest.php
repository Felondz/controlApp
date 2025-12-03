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
        $tiposPermitidos = ['efectivo', 'banco', 'credito', 'inversion', 'otro', 'prestamo'];
        $monedasPermitidas = ['USD', 'EUR', 'MXN', 'COP', 'PEN', 'CLP', 'ARS', 'BRL'];

        $rules = [
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
            'banco' => [
                'nullable',
                'string',
                'max:255',
            ],
            'saldo_inicial' => [
                'required',
                'numeric',
                'min:0',
            ],
            'moneda' => [
                'required',
                'string',
                'size:3',
                Rule::in($monedasPermitidas),
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'color' => [
                'nullable',
                'string',
                'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            ],
            'icono' => [
                'nullable',
                'string',
                'max:50',
            ],
        ];

        // Credit card specific rules
        if ($this->input('tipo') === 'credito') {
            $rules = array_merge($rules, [
                'tasa_interes_anual' => [
                    'required',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'fecha_vencimiento' => [
                    'required',
                    'date',
                    'after:today',
                ],
                'dia_corte' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'dia_pago' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'limite_credito' => [
                    'required',
                    'numeric',
                    'min:0',
                ],
            ]);
        }

        // Savings/Investment specific rules
        if ($this->input('tipo') === 'inversion') {
            $rules = array_merge($rules, [
                'tasa_interes' => [
                    'required',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'fecha_interes' => [
                    'required',
                    'date',
                    'after_or_equal:today',
                ],
                'capitalizable' => [
                    'required',
                    'boolean',
                ],
                'periodo_capitalizacion' => [
                    Rule::requiredIf($this->input('capitalizable') === true),
                    'nullable',
                    Rule::in(['diario', 'mensual', 'trimestral', 'semestral', 'anual']),
                ],
            ]);
        }

        // Loan specific rules
        if ($this->input('tipo') === 'prestamo') {
            $rules = array_merge($rules, [
                'tasa_interes_anual' => [
                    'required',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'dia_pago' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'fecha_vencimiento' => [
                    'nullable',
                    'date',
                    'after:today',
                ],
            ]);
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $messages = [
            // General fields
            'nombre.required' => 'El nombre de la cuenta es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'tipo.in' => 'El tipo de cuenta seleccionado no es válido.',
            'saldo_inicial.required' => 'El saldo inicial es obligatorio.',
            'saldo_inicial.numeric' => 'El saldo inicial debe ser un número.',
            'saldo_inicial.min' => 'El saldo inicial no puede ser negativo.',
            'moneda.required' => 'La moneda es obligatoria.',
            'moneda.in' => 'La moneda seleccionada no es válida.',
            'color.regex' => 'El color debe ser un código hexadecimal válido (ej: #FF0000 o #f00).',
            'icono.max' => 'El nombre del ícono no puede exceder los 50 caracteres.',

            // Credit card specific
            'tasa_interes_anual.required' => 'La tasa de interés anual es obligatoria para cuentas de crédito.',
            'tasa_interes_anual.numeric' => 'La tasa de interés debe ser un número.',
            'tasa_interes_anual.min' => 'La tasa de interés no puede ser negativa.',
            'tasa_interes_anual.max' => 'La tasa de interés no puede ser mayor a 100%.',
            'fecha_vencimiento.required' => 'La fecha de vencimiento es obligatoria para cuentas de crédito.',
            'fecha_vencimiento.date' => 'La fecha de vencimiento debe ser una fecha válida.',
            'fecha_vencimiento.after' => 'La fecha de vencimiento debe ser posterior a hoy.',
            'dia_corte.required' => 'El día de corte es obligatorio para cuentas de crédito.',
            'dia_corte.integer' => 'El día de corte debe ser un número entero.',
            'dia_corte.min' => 'El día de corte debe ser al menos 1.',
            'dia_corte.max' => 'El día de corte no puede ser mayor a 31.',
            'dia_pago.required' => 'El día de pago es obligatorio para cuentas de crédito.',
            'dia_pago.integer' => 'El día de pago debe ser un número entero.',
            'dia_pago.min' => 'El día de pago debe ser al menos 1.',
            'dia_pago.max' => 'El día de pago no puede ser mayor a 31.',
            'limite_credito.required' => 'El límite de crédito es obligatorio para cuentas de crédito.',
            'limite_credito.numeric' => 'El límite de crédito debe ser un número.',
            'limite_credito.min' => 'El límite de crédito no puede ser negativo.',

            // Savings/Investment specific
            'tasa_interes.required' => 'La tasa de interés es obligatoria para cuentas de inversión.',
            'tasa_interes.numeric' => 'La tasa de interés debe ser un número.',
            'tasa_interes.min' => 'La tasa de interés no puede ser negativa.',
            'tasa_interes.max' => 'La tasa de interés no puede ser mayor a 100%.',
            'fecha_interes.required' => 'La fecha de interés es obligatoria para cuentas de inversión.',
            'fecha_interes.date' => 'La fecha de interés debe ser una fecha válida.',
            'fecha_interes.after_or_equal' => 'La fecha de interés no puede ser anterior a hoy.',
            'capitalizable.required' => 'Debe especificar si la inversión es capitalizable.',
            'periodo_capitalizacion.required_if' => 'El período de capitalización es obligatorio cuando la inversión es capitalizable.',
            'periodo_capitalizacion.in' => 'El período de capitalización seleccionado no es válido.',
        ];

        return $messages;
    }
}
