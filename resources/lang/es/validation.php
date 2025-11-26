<?php

return [

    'unique' => 'El campo :attribute ya ha sido registrado.', // Mensaje general de unicidad
    
    'custom' => [
        'nombre' => [
            // Mensaje específico para la regla 'unique' en el campo 'nombre'
            'unique' => 'Ya tienes un proyecto con este nombre.', 
        ],
    ],
    
    // Dejamos las reglas básicas para evitar errores en otros campos
    'required' => 'El campo :attribute es obligatorio.',
    'max' => 'El campo :attribute no debe ser mayor a :max.',
    'min' => 'El campo :attribute debe tener al menos :min.',

];