<?php

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Models\InventoryItem;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index(Request $request, Proyecto $proyecto)
    {
        try {
            // Attempt to use Scout/Meilisearch
            // Note: If Meilisearch is not running or Index does not exist, this might throw an exception depending on driver
            // However, Scout basic search usually returns a Builder. The exception happens at execution (paginate).
            
            $query = InventoryItem::search($request->input('search', ''));
            
            // Scope to Project
            $query->where('proyecto_id', $proyecto->id);

            // Column Filters
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }
            
            // Stock Status Filter (requires is_low_stock in searchable array)
            if ($request->filled('stock_status')) {
                 if ($request->stock_status === 'low') {
                     $query->where('is_low_stock', true);
                 } elseif ($request->stock_status === 'normal') {
                     $query->where('is_low_stock', false);
                 }
            }

            $items = $query->paginate(10)->withQueryString();

        } catch (\Exception $e) {
            // Fallback to Standard SQL if Search Engine fails (e.g. Index not found, Connection Refused)
            // This ensures the page is always usable.
            
            $query = InventoryItem::where('proyecto_id', $proyecto->id);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('stock_status')) {
                 if ($request->stock_status === 'low') {
                     $query->whereColumn('current_stock', '<=', 'min_stock_level');
                 } elseif ($request->stock_status === 'normal') {
                     $query->whereColumn('current_stock', '>', 'min_stock_level');
                 }
            }

            $items = $query->paginate(10)->withQueryString();
        }

        return Inertia::render('Inventory/Items/Index', [
            'proyecto' => $proyecto,
            'items' => $items,
            'filters' => $request->only(['search', 'type', 'stock_status']),
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
            'initial_quantity' => 'nullable|numeric|min:0',
            'initial_cost' => 'nullable|numeric|min:0',
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
            $filename = Str::random(40) . '.' . $extension;
            $imagePath = $file->storeAs('inventory/' . $proyecto->id, $filename, 'public');
        }

        // Determine initial cost for the item master
        $costPrice = $validated['initial_cost'] ?? 0;

        $item = InventoryItem::create([
            'proyecto_id' => $proyecto->id,
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'type' => $validated['type'],
            'unit' => $validated['unit'],
            'min_stock_level' => $validated['min_stock_level'] ?? 0,
            'sale_price' => $validated['sale_price'] ?? 0,
            'cost_price' => $costPrice, // Set initial average cost
            'image_path' => $imagePath,
            'is_active' => true,
        ]);

        // Handle Initial Stock Transaction
        if (!empty($validated['initial_quantity']) && $validated['initial_quantity'] > 0) {
            \App\Modules\Inventory\Models\InventoryTransaction::create([
                'proyecto_id' => $proyecto->id,
                'inventory_item_id' => $item->id,
                'user_id' => auth()->id(), // Assuming auth context
                'type' => 'adjustment', // or 'initial_stock' if added to enum
                'quantity' => $validated['initial_quantity'],
                'unit_price' => $costPrice,
                'total_amount' => $validated['initial_quantity'] * $costPrice,
                'transaction_date' => now(),
                'status' => 'confirmed',
                'notes' => 'Stock Inicial al crear Item',
                'reference_type' => null, // No external reference for initial manual stock
                'reference_id' => null,
            ]);
            
            // Note: The Observer or Listener should update the Item's current_stock cache.
            // If not implemented, we might need to manually update it here.
            // Assuming for now the system handles it or we force update:
            $item->increment('current_stock', $validated['initial_quantity']);
        }

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

        // Handle Manual Stock Adjustment
        if ($request->filled('stock_adjustment') && $request->stock_adjustment != 0) {
            $adjustment = (float) $request->stock_adjustment;
            \App\Modules\Inventory\Models\InventoryTransaction::create([
                'proyecto_id' => $proyecto->id,
                'inventory_item_id' => $item->id,
                'user_id' => auth()->id(),
                'type' => 'adjustment',
                'quantity' => $adjustment,
                'unit_price' => $item->cost_price, // Use current average cost
                'total_amount' => $adjustment * $item->cost_price,
                'transaction_date' => now(),
                'status' => 'confirmed',
                'notes' => 'Ajuste manual desde edición de item',
                'reference_type' => null,
                'reference_id' => null,
            ]);
            
            // Update stock cache
            if ($adjustment > 0) {
                $item->increment('current_stock', $adjustment);
            } else {
                $item->decrement('current_stock', abs($adjustment));
            }
        }

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
