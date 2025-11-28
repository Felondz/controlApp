<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Support\Facades\Auth;

class StoreProyectoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // All authenticated users can create projects
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'min:3',
                'max:255',   
                Rule::unique('proyectos')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'descripcion' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'moneda_default' => [
                'required',
                'string',
                'in:COP,USD,EUR',
            ],
            'modules' => [
                'required',
                'array',
                'min:1',
            ],
            'modules.*' => [
                'string',
                'in:finance,tasks',
            ],
            'image' => [
                'nullable',
                'image',
                'max:3072', // 3MB
            ],
            'theme' => [
                'nullable',
                'string',
                'max:50',
            ],
            'typography' => [
                'nullable',
                'string',
                'max:50',
            ],
            'color' => [
                'nullable',
                'string',
                'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
            ],
            // Icon kept for backward compatibility or emoji usage if image is not provided
            'icon' => [
                'nullable',
                'string',
                'max:5',
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
            'nombre.required' => 'El nombre del proyecto es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'moneda_default.required' => 'La moneda es obligatoria.',
            'moneda_default.in' => 'La moneda debe ser una de las siguientes: COP, USD, EUR.',
            'moneda_default.uppercase' => 'El código de moneda debe estar en mayúsculas.',
            'nombre.unique' => 'Ya tienes un proyecto con este nombre.',
            'modules.required' => 'Debes seleccionar al menos un módulo.',
            'modules.min' => 'Debes seleccionar al menos un módulo.',
            'color.regex' => 'El color debe ser un código hexadecimal válido.',
            'icon.max' => 'El icono no puede exceder 5 caracteres.',
        ];
    }
}
