<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProyectoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Authorization is handled by policy in controller
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
                'sometimes',
                'string',
                'max:255',
                'min:3',
                Rule::unique('proyectos')->ignore($this->route('proyecto') ?? $this->route('mis_proyecto')),
            ],
            'moneda_default' => 'sometimes|required|in:COP,USD,EUR',
            'descripcion' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'theme' => 'nullable|string|max:50',
            'typography' => 'nullable|string|in:sans,serif,mono,roboto,opensans,lato,montserrat,nunito,raleway,playfair,merriweather',
            'image' => 'nullable|image|max:4096', // 4MB max
            'modules' => 'nullable|array',
            'modules.*' => 'string|in:finance,tasks,chat',
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
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres.',
            'nombre.unique' => 'Ya existe un proyecto con ese nombre.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no puede exceder 1000 caracteres.',
            'moneda.in' => 'La moneda seleccionada no es válida.',
        ];
    }
}
