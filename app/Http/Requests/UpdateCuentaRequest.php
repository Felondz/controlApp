<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCuentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $tiposPermitidos = ['efectivo', 'banco', 'credito', 'inversion', 'otro', 'prestamo'];
        $monedasPermitidas = ['USD', 'EUR', 'MXN', 'COP', 'PEN', 'CLP', 'ARS', 'BRL'];

        $rules = [
            'nombre' => [
                'sometimes',
                'string',
                'max:255',
                'min:2',
            ],
            'tipo' => [
                'sometimes',
                'string',
                Rule::in($tiposPermitidos),
            ],
            'banco' => [
                'nullable',
                'string',
                'max:255',
            ],
            'saldo_inicial' => [
                'sometimes',
                'numeric',
                'min:0',
            ],
            'moneda' => [
                'sometimes',
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
            'estado' => [
                'sometimes',
                'string',
                Rule::in(['activa', 'inactiva', 'cerrada']),
            ],
        ];

        // Credit card specific rules (only validate if tipo is credito or if tipo is being updated to credito)
        if ($this->input('tipo') === 'credito' || $this->cuenta?->tipo === 'credito') {
            $creditRules = [
                'tasa_interes_anual' => [
                    'sometimes',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'fecha_vencimiento' => [
                    'sometimes',
                    'date',
                    'after:today',
                ],
                'dia_corte' => [
                    'sometimes',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'dia_pago' => [
                    'sometimes',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'limite_credito' => [
                    'sometimes',
                    'numeric',
                    'min:0',
                ],
            ];

            // Only require these fields if the account is being updated to a credit card
            if ($this->input('tipo') === 'credito') {
                $creditRules = array_map(function ($rule) {
                    $rule[array_search('sometimes', $rule, true)] = 'required';
                    return $rule;
                }, $creditRules);
            }

            $rules = array_merge($rules, $creditRules);
        }

        // Payroll specific rules (only validate if tipo is banco or if tipo is being updated to banco)
        if ($this->input('tipo') === 'banco' || $this->cuenta?->tipo === 'banco') {
            $payrollRules = [
                'es_nomina' => [
                    'sometimes',
                    'boolean',
                ],
            ];

            // Only validate payroll details if es_nomina is effectively true
            // We check the input if present, otherwise fall back to the existing account state
            $esNomina = $this->has('es_nomina') ? $this->boolean('es_nomina') : $this->cuenta?->es_nomina;

            if ($esNomina) {
                $payrollRules['dia_nomina'] = [
                    'required',
                    'array',
                    'min:1',
                    'max:4',
                ];
                $payrollRules['dia_nomina.*'] = [
                    'integer',
                    'min:1',
                    'max:31',
                    'distinct',
                ];
                $payrollRules['valor_nomina'] = [
                    'required',
                    'numeric',
                    'min:0',
                ];
            } else {
                // If es_nomina is false, allow these to be nullable/empty
                $payrollRules['dia_nomina'] = ['nullable', 'array'];
                $payrollRules['valor_nomina'] = ['nullable', 'numeric'];
            }

            $rules = array_merge($rules, $payrollRules);
        }

        // Savings/Investment specific rules (only validate if tipo is inversion or if tipo is being updated to inversion)
        if ($this->input('tipo') === 'inversion' || $this->cuenta?->tipo === 'inversion') {
            $investmentRules = [
                'tasa_interes' => [
                    'sometimes',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'fecha_interes' => [
                    'sometimes',
                    'date',
                    'after_or_equal:today',
                ],
                'capitalizable' => [
                    'sometimes',
                    'boolean',
                ],
                'periodo_capitalizacion' => [
                    Rule::requiredIf(function () {
                        return $this->input('capitalizable') === true ||
                            ($this->cuenta?->capitalizable === true && $this->input('capitalizable') !== false);
                    }),
                    'nullable',
                    Rule::in(['diario', 'mensual', 'trimestral', 'semestral', 'anual']),
                ],
            ];

            // Only require these fields if the account is being updated to an investment account
            if ($this->input('tipo') === 'inversion') {
                $investmentRules = array_map(function ($rule) {
                    $rule[array_search('sometimes', $rule, true)] = 'required';
                    return $rule;
                }, $investmentRules);
            }

            $rules = array_merge($rules, $investmentRules);
        }

        // Loan specific rules (only validate if tipo is prestamo or if tipo is being updated to prestamo)
        if ($this->input('tipo') === 'prestamo' || $this->cuenta?->tipo === 'prestamo') {
            $loanRules = [
                'tasa_interes_anual' => [
                    'sometimes',
                    'numeric',
                    'min:0',
                    'max:100',
                ],
                'dia_pago' => [
                    'sometimes',
                    'integer',
                    'min:1',
                    'max:31',
                ],
                'plazo' => [
                    'nullable',
                    'integer',
                    'min:1',
                ],
                'valor_cuota' => [
                    'nullable',
                    'numeric',
                    'min:0',
                ],
                'cuotas_pagadas' => [
                    'nullable',
                    'integer',
                    'min:0',
                ],
                'fecha_vencimiento' => [
                    'nullable',
                    'date',
                    'after:today',
                ],
            ];

            // Only require these fields if the account is being updated to a loan account
            if ($this->input('tipo') === 'prestamo') {
                $loanRules = array_map(function ($rule) {
                    $rule[array_search('sometimes', $rule, true)] = 'required';
                    return $rule;
                }, $loanRules);
            }

            $rules = array_merge($rules, $loanRules);
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // General fields
            'nombre.string' => 'El nombre debe ser un texto.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres.',
            'tipo.in' => 'El tipo de cuenta seleccionado no es válido.',
            'saldo_inicial.numeric' => 'El saldo inicial debe ser un número.',
            'saldo_inicial.min' => 'El saldo inicial no puede ser negativo.',
            'moneda.in' => 'La moneda seleccionada no es válida.',
            'color.regex' => 'El color debe ser un código hexadecimal válido (ej: #FF0000 o #f00).',
            'icono.max' => 'El nombre del ícono no puede exceder los 50 caracteres.',
            'estado.in' => 'El estado seleccionado no es válido.',

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
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // If the account type is being changed, we need to validate required fields for the new type
            if ($this->has('tipo') && $this->tipo !== $this->cuenta->tipo) {
                $this->validateAccountTypeChange($validator);
            }
        });
    }

    /**
     * Validate account type change.
     */
    protected function validateAccountTypeChange($validator)
    {
        $tipo = $this->input('tipo');

        if ($tipo === 'credito') {
            $requiredFields = [
                'tasa_interes_anual' => 'La tasa de interés anual es obligatoria para cuentas de crédito.',
                'fecha_vencimiento' => 'La fecha de vencimiento es obligatoria para cuentas de crédito.',
                'dia_corte' => 'El día de corte es obligatorio para cuentas de crédito.',
                'dia_pago' => 'El día de pago es obligatorio para cuentas de crédito.',
                'limite_credito' => 'El límite de crédito es obligatorio para cuentas de crédito.',
            ];

            foreach ($requiredFields as $field => $message) {
                if (!$this->filled($field)) {
                    $validator->errors()->add($field, $message);
                }
            }
        } elseif ($tipo === 'inversion') {
            $requiredFields = [
                'tasa_interes' => 'La tasa de interés es obligatoria para cuentas de inversión.',
                'fecha_interes' => 'La fecha de interés es obligatoria para cuentas de inversión.',
                'capitalizable' => 'Debe especificar si la inversión es capitalizable.',
            ];

            foreach ($requiredFields as $field => $message) {
                if (!$this->filled($field)) {
                    $validator->errors()->add($field, $message);
                }
            }

            if ($this->input('capitalizable') === true && !$this->filled('periodo_capitalizacion')) {
                $validator->errors()->add('periodo_capitalizacion', 'El período de capitalización es obligatorio cuando la inversión es capitalizable.');
            }
        }
    }
}
