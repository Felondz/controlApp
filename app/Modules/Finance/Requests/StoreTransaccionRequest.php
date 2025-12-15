<?php

namespace App\Modules\Finance\Requests;

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
                'required',
                'numeric',
                Rule::exists('categorias', 'id')->where('proyecto_id', $proyecto->id),
            ],
            'monto' => 'required|numeric',
            'descripcion' => 'nullable|string|max:255',
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

            // Recurrence fields
            'is_recurring' => 'boolean',
            'recurrence_day' => 'nullable|integer|min:1|max:30',

            // Credit card installments (deferred purchases)
            'cuotas' => 'nullable|integer|min:1|max:48',
            'source_type' => 'nullable|string|max:255',
            'source_id' => 'nullable|string|max:255',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validation for Investment/CDT accounts
            if ($this->has('cuenta_id') && $this->cuenta_id) {
                $cuenta = \App\Modules\Finance\Models\Cuenta::find($this->cuenta_id);

                // If account is INVESTMENT/CDT AND has a future expiration date
                if ($cuenta && $cuenta->tipo === 'inversion' && $cuenta->fecha_vencimiento && now()->lt($cuenta->fecha_vencimiento)) {
                    // Block withdrawals (negative amount)
                    if ($this->monto < 0) {
                        $validator->errors()->add(
                            'cuenta_id',
                            'Esta cuenta de inversión (CDT) está bloqueada para retiros hasta el ' . $cuenta->fecha_vencimiento->format('d/m/Y')
                        );
                    }
                }
            }
        });
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        \Illuminate\Support\Facades\Log::error('Transaction Validation Failed:', $validator->errors()->toArray());
        \Illuminate\Support\Facades\Log::info('Request Data:', $this->all());
        parent::failedValidation($validator);
    }
}
