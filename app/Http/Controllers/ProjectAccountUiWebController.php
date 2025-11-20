<?php
namespace App\Http\Controllers;

use App\Models\Proyecto;
use App\Models\Cuenta; 
use App\Http\Requests\StoreCuentaRequest; 
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ProjectAccountUiWebController extends Controller 
{
    /**
     * Muestra el formulario para crear una nueva cuenta.
     */
    // Route Model Binding: Inyectamos el modelo Proyecto (mis_proyecto)
    public function create(Proyecto $mis_proyecto) 
    {
        if (!auth()->user()->esMiembroDe($mis_proyecto)) {
            abort(403);
        }

        return Inertia::render('Projects/Finance/CreateAccount', [
            'proyecto' => [
                'id' => $mis_proyecto->id,
                'nombre' => $mis_proyecto->nombre,
                'moneda_default' => $mis_proyecto->moneda_default,
            ],
            'tipos_cuenta' => ['bancaria', 'efectivo', 'inversion', 'credito'], 
        ]);
    }
    
    /**
     * Almacena una nueva cuenta asociada al proyecto.
     */
    public function store(StoreCuentaRequest $request, Proyecto $mis_proyecto)
    {
        if (!auth()->user()->esMiembroDe($mis_proyecto)) {
            abort(403);
        }

        // 1. Crear la cuenta (Los datos vienen validados).
        $cuenta = new Cuenta($request->validated());
        $cuenta->saldo_actual = $request->saldo_inicial; 

        // 2. Persistir usando la relación polimórfica del proyecto.
        // La relación 'cuentas()' en el modelo Proyecto asocia esto.
        $mis_proyecto->cuentas()->save($cuenta); 

        // 3. Redirigir al dashboard del proyecto.
        return redirect()->route('mis-proyectos.show', [
            'mis_proyecto' => $mis_proyecto->id
        ])->with('success', 'Cuenta creada exitosamente.');
    }
}