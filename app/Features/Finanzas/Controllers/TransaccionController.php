<?php

namespace App\Features\Finanzas\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Finanzas\Models\Transaccion;
use App\Features\Finanzas\Requests\StoreTransaccionRequest;
use App\Features\Finanzas\Requests\UpdateTransaccionRequest;

class TransaccionController extends Controller
{
    public function index()
    {
        return Transaccion::all();
    }

    public function store(StoreTransaccionRequest $request)
    {
        $transaccion = Transaccion::create($request->validated());
        return response()->json($transaccion, 201);
    }

    public function show(Transaccion $transaccion)
    {
        return $transaccion;
    }

    public function update(UpdateTransaccionRequest $request, Transaccion $transaccion)
    {
        $transaccion->update($request->validated());
        return $transaccion;
    }

    public function destroy(Transaccion $transaccion)
    {
        $transaccion->delete();
        return response()->noContent();
    }
}
