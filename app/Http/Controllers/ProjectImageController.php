<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ProjectImageController extends Controller
{
    public function show(Proyecto $proyecto)
    {
        Gate::authorize("view", $proyecto);
        if (!$proyecto->image_path || !Storage::disk("local")->exists($proyecto->image_path)) {
            abort(404);
        }
        return response()->file(storage_path("app/private/" . $proyecto->image_path));
    }
}
