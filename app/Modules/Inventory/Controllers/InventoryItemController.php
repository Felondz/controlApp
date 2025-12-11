<?php

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Models\InventoryItem;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InventoryItemController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        $query = InventoryItem::where('proyecto_id', $proyecto->id);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        $items = $query->paginate(10)->withQueryString();

        return \Inertia\Inertia::render('Inventory/Items/Index', [
            'proyecto' => $proyecto,
            'items' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a new inventory item.
     */
    public function store(Request $request, Proyecto $proyecto)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'type' => 'required|in:raw_material,finished_good,service,asset',
            'unit' => 'required|string|max:20',
            'min_stock_level' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:3072', // 3MB
                'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000',
            ],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            // Secure hashing of filename
            $filename = Str::random(40) . '.' . $extension;
            $imagePath = $file->storeAs('inventory/' . $proyecto->id, $filename, 'public');
        }

        InventoryItem::create([
            'proyecto_id' => $proyecto->id,
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'type' => $validated['type'],
            'unit' => $validated['unit'],
            'min_stock_level' => $validated['min_stock_level'] ?? 0,
            'sale_price' => $validated['sale_price'] ?? 0,
            'image_path' => $imagePath,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Item creado correctamente.');
    }

    /**
     * Update an existing inventory item.
     */
    public function update(Request $request, Proyecto $proyecto, InventoryItem $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'type' => 'required|in:raw_material,finished_good,service,asset',
            'unit' => 'required|string|max:20',
            'min_stock_level' => 'nullable|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:3072', // 3MB
                'dimensions:min_width=100,min_height=100,max_width=4000,max_height=4000',
            ],
        ]);

        $dataToUpdate = [
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'type' => $validated['type'],
            'unit' => $validated['unit'],
            'min_stock_level' => $validated['min_stock_level'] ?? 0,
            'sale_price' => $validated['sale_price'] ?? 0,
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($item->image_path) {
                Storage::disk('public')->delete($item->image_path);
            }

            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(40) . '.' . $extension;
            $path = $file->storeAs('inventory/' . $proyecto->id, $filename, 'public');
            $dataToUpdate['image_path'] = $path;
        }

        $item->update($dataToUpdate);

        return redirect()->back()->with('success', 'Item actualizado correctamente.');
    }

    /**
     * Remove the specified item and its image.
     */
    public function destroy(Proyecto $proyecto, InventoryItem $item)
    {
        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        $item->delete();

        return redirect()->back()->with('success', 'Item eliminado.');
    }
}
