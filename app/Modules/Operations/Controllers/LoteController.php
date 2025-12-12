<?php

namespace App\Modules\Operations\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Proyecto;

class LoteController extends Controller
{
    public function index(Request $request, Proyecto $proyecto)
    {
        return Inertia::render('Operations/Lotes/Index', [
            'proyecto' => $proyecto,
        ]);
    }
}
