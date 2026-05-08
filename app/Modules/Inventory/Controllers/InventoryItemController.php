<?php

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Proyecto;
use App\Modules\Inventory\Actions\CreateInventoryItemAction;
use App\Modules\Inventory\Actions\DeleteInventoryItemAction;
use App\Modules\Inventory\Actions\UpdateInventoryItemAction;
use App\Modules\Inventory\DTOs\CreateInventoryItemDTO;
use App\Modules\Inventory\DTOs\UpdateInventoryItemDTO;
use App\Modules\Inventory\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index(Request $request, Proyecto $proyecto): \Inertia\Response|\Illuminate\Http\JsonResponse
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

        // Calculate Inventory Stats for Widgets
        $inventoryStats = [
            'totalItems' => $proyecto->inventoryItems()->count(),
            'totalValue' => $proyecto->inventoryItems()->selectRaw('SUM(current_stock * cost_price) as total')->value('total') ?? 0,
            'lowStockCount' => $proyecto->inventoryItems()->whereColumn('current_stock', '<=', 'min_stock_level')->count(),
            'activeItems' => $proyecto->inventoryItems()->where('is_active', true)->count(),
        ];

        // Fetch Low Stock Items for Widget
        $lowStockItems = $proyecto->inventoryItems()
            ->whereColumn('current_stock', '<=', 'min_stock_level')
            ->orderBy('current_stock', 'asc')
            ->limit(10)
            ->get();

        if ($request->wantsJson()) {
            return response()->json($items);
        }

        return Inertia::render('Inventory/Items/Index', [
            'proyecto' => $proyecto,
            'items' => $items,
            'filters' => $request->only(['search', 'type', 'stock_status']),
            'inventoryStats' => $inventoryStats,
            'lowStockItems' => ['data' => $lowStockItems], // Wrap in data to match expected structure if needed, or just array
        ]);
    }

    /**
     * Store a new inventory item.
     */
    public function store(Request $request, Proyecto $proyecto, CreateInventoryItemAction $action): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('inventory_items')->where(fn ($query) => $query->where('proyecto_id', $proyecto->id))
            ],
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

        $dto = new CreateInventoryItemDTO(
            proyecto: $proyecto,
            name: $validated['name'],
            type: $validated['type'],
            unit: $validated['unit'],
            userId: Auth::id() ? (string) Auth::id() : '1', // Fallback to system user if no auth (testing/MCP)
            sku: $validated['sku'] ?? null,
            minStockLevel: (float) ($validated['min_stock_level'] ?? 0),
            initialQuantity: (float) ($validated['initial_quantity'] ?? 0),
            initialCost: (float) ($validated['initial_cost'] ?? 0),
            salePrice: (float) ($validated['sale_price'] ?? 0),
            image: $request->file('image')
        );

        $item = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($item, 201);
        }

        return redirect()->back()->with('success', 'Item creado correctamente.');
    }

    /**
     * Update an existing inventory item.
     */
    public function update(Request $request, Proyecto $proyecto, InventoryItem $item, UpdateInventoryItemAction $action): \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('inventory_items')->where(fn ($query) => $query->where('proyecto_id', $proyecto->id))->ignore($item->id)
            ],
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

        $dto = new UpdateInventoryItemDTO(
            proyecto: $proyecto,
            item: $item,
            name: $validated['name'],
            type: $validated['type'],
            unit: $validated['unit'],
            userId: Auth::id() ? (string) Auth::id() : '1', // Fallback to system user if no auth
            sku: $validated['sku'] ?? null,
            minStockLevel: (float) ($validated['min_stock_level'] ?? 0),
            salePrice: (float) ($validated['sale_price'] ?? 0),
            stockAdjustment: (float) ($request->stock_adjustment ?? 0),
            image: $request->file('image')
        );

        $item = $action->execute($dto);

        if ($request->wantsJson()) {
            return response()->json($item, 200);
        }

        return redirect()->back()->with('success', 'Item actualizado correctamente.');
    }

    /**
     * Serve the item's image securely.
     */
    public function image(Proyecto $proyecto, InventoryItem $item)
    {
        // Security check: item must belong to the project
        if ($item->proyecto_id !== $proyecto->id) {
            abort(404);
        }

        // Authorization check: user must be a member of the project
        if (!auth()->user()->esMiembroDe($proyecto)) {
            abort(403);
        }

        if (!$item->image_path || !\Illuminate\Support\Facades\Storage::disk("local")->exists($item->image_path)) {
            abort(404);
        }

        return response()->file(storage_path("app/private/" . $item->image_path));
    }

    /**
     * Remove the specified item and its image.
     */
    public function destroy(Proyecto $proyecto, InventoryItem $item, DeleteInventoryItemAction $action): \Illuminate\Http\RedirectResponse
    {
        $action->execute($item);

        return redirect()->back()->with('success', 'Item eliminado.');
    }
}
