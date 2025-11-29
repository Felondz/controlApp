# Authorization & Validation Guide - ControlApp

**Last Updated**: November 16, 2025  
**Topic**: Laravel Policies, FormRequest Validation, Rate Limiting

## 📋 Table of Contents

1. [Authorization with Policies](#authorization-with-policies)
2. [Input Validation with FormRequest](#input-validation-with-formrequest)
3. [Rate Limiting](#rate-limiting)
4. [Usage Examples](#usage-examples)
5. [Common Patterns](#common-patterns)

---

## 🔐 Authorization with Policies

### What are Policies?

Laravel Policies are classes that organize authorization logic for your application. Instead of scattered authorization checks throughout controllers, policies centralize the logic.

### Policy Classes

Located in `app/Policies/`:

| Policy | Modelo | Actions |
|--------|--------|---------|
| `ProyectoPolicy` | Proyecto | view, create, update, delete, manageMembersAndInvitations |
| `CategoriaPolicy` | Categoria | view, create, update, delete |
| `CuentaPolicy` | Cuenta | view, create, update, delete |
| `TransaccionPolicy` | Transaccion | view, create, update, delete |
| `InvitacionPolicy` | Invitacion | view, create, delete |

### How It Works

```php
// In Controller
if (!Gate::allows('update', $proyecto)) {
    abort(403, 'Unauthorized');
}

// Gate checks: Does current user have permission to 'update' this $proyecto?
// It calls ProyectoPolicy->update($user, $proyecto)
```

### ProyectoPolicy Example

```php
class ProyectoPolicy
{
    // Anyone can view their own projects
    public function view(User $user, Proyecto $proyecto): bool
    {
        return $proyecto->miembros()->where('user_id', $user->id)->exists();
    }
    
    // Anyone authenticated can create
    public function create(User $user): bool
    {
        return true;
    }
    
    // Only admin members can update
    public function update(User $user, Proyecto $proyecto): bool
    {
        return $user->esAdminDe($proyecto);
    }
    
    // Only project owner (creator) can delete
    public function delete(User $user, Proyecto $proyecto): bool
    {
        return $proyecto->user_id === $user->id;
    }
    
    // Only admins can manage members
    public function manageMembersAndInvitations(User $user, Proyecto $proyecto): bool
    {
        return $user->esAdminDe($proyecto);
    }
}
```

### Using Policies in Controllers

```php
class ProyectoController extends Controller
{
    public function show(Request $request, Proyecto $proyecto)
    {
        // Check authorization
        if (!Gate::allows('view', $proyecto)) {
            abort(403, 'No permission to view this project');
        }
        
        return response()->json($proyecto);
    }
    
    public function update(Request $request, Proyecto $proyecto)
    {
        // Check authorization
        if (!Gate::allows('update', $proyecto)) {
            abort(403, 'No permission to update this project');
        }
        
        // Update logic...
    }
}
```

### Policy Authorization Levels

```
Level 1: Public (no auth required)
    - GET /api/invitaciones/{token}
    - GET /api/email/verify/{id}/{hash}

Level 2: Authenticated (any logged-in user)
    - GET /api/user
    - POST /api/proyectos (create own)
    
Level 3: Member (project member)
    - GET /api/proyectos/{id}
    - GET /api/proyectos/{id}/categorias
    
Level 4: Admin (project admin)
    - PUT /api/proyectos/{id}
    - POST /api/proyectos/{id}/invitaciones
    - DELETE /api/proyectos/{id}/miembros/{user}
    
Level 5: Owner (project creator)
    - DELETE /api/proyectos/{id}
```

---

## ✔️ Input Validation with FormRequest

### What is FormRequest?

FormRequest classes centralize validation rules, custom messages, and authorization logic in a single reusable class.

### FormRequest Classes

Located in `app/Http/Requests/`:

| Class | Purpose | Usage |
|-------|---------|-------|
| `StoreProyectoRequest` | Create new project | POST /api/proyectos |
| `UpdateProyectoRequest` | Update project | PUT /api/proyectos/{id} |
| `StoreCategoriaRequest` | Create category | POST /api/proyectos/{id}/categorias |
| `UpdateCategoriaRequest` | Update category | PUT /api/proyectos/{id}/categorias/{id} |
| `StoreCuentaRequest` | Create account | POST /api/proyectos/{id}/cuentas |
| `UpdateCuentaRequest` | Update account | PUT /api/proyectos/{id}/cuentas/{id} |
| `StoreInvitacionRequest` | Create invitation | POST /api/proyectos/{id}/invitaciones |

### Example: StoreProyectoRequest

```php
class StoreProyectoRequest extends FormRequest
{
    // Authorization check (before validation)
    public function authorize(): bool
    {
        return true;  // All authenticated users can create
    }
    
    // Validation rules
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'min:3', 'max:255'],
            'moneda' => ['required', 'string', 'size:3', 'uppercase'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
        ];
    }
    
    // Custom error messages
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del proyecto es obligatorio.',
            'nombre.min' => 'El nombre debe tener al menos 3 caracteres.',
            'moneda.required' => 'La moneda es obligatoria.',
            'moneda.size' => 'La moneda debe ser un código de 3 caracteres (ej: USD, EUR, COP).',
        ];
    }
}
```

### Using FormRequest in Controllers

```php
class ProyectoController extends Controller
{
    public function store(StoreProyectoRequest $request)
    {
        // $request is automatically validated
        // $request->validated() contains only validated data
        
        $validated = $request->validated();
        
        $proyecto = auth()->user()->proyectos()->create([
            'nombre' => $validated['nombre'],
            'moneda' => $validated['moneda'],
            'descripcion' => $validated['descripcion'] ?? null,
        ]);
        
        return response()->json($proyecto, 201);
    }
}
```

### Validation Rules Reference

```php
// Text validation
'name' => 'required|string|min:3|max:255',

// Email validation with DNS check
'email' => 'required|email:rfc,dns',

// Numeric validation
'amount' => 'required|numeric|min:0|max:9999999.99',

// Enum validation (fixed set of values)
'rol' => 'required|string|in:admin,miembro',

// Enum validation (ISO 4217 currency codes)
'moneda' => 'required|string|size:3|uppercase',

// Optional fields
'description' => 'nullable|string|max:1000',

// Array validation
'items' => 'required|array|min:1',
'items.*.name' => 'required|string',
'items.*.amount' => 'required|numeric',
```

### Response on Validation Error

**HTTP 422 Unprocessable Entity**

```json
{
  "message": "The nombre field is required.",
  "errors": {
    "nombre": ["El nombre del proyecto es obligatorio."],
    "moneda": ["La moneda debe ser un código de 3 caracteres (ej: USD, EUR, COP)."]
  }
}
```

---

## ⏱️ Rate Limiting

### What is Rate Limiting?

Rate limiting restricts how many requests a client can make in a given time period. It protects against:
- Brute force attacks
- Credential stuffing
- Account enumeration
- DDoS attacks
- API abuse

### Current Limits

Configured in `routes/api.php`:

```php
Route::post('/login', [...])
    ->middleware('throttle:5,1');         // 5 requests per 1 minute

Route::post('/forgot-password', [...])
    ->middleware('throttle:5,1');         // 5 requests per 1 minute

Route::post('/reset-password', [...])
    ->middleware('throttle:5,1');         // 5 requests per 1 minute

Route::get('/reset-password/validate', [...])
    ->middleware('throttle:10,1');        // 10 requests per 1 minute

Route::post('/email/verification-notification', [...])
    ->middleware('throttle:6,1');         // 6 requests per 1 minute
```

### Response When Rate Limit Exceeded

**HTTP 429 Too Many Requests**

```json
{
  "message": "Too Many Requests"
}
```

**Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699000000
```

### How It Works

The `throttle` middleware uses Redis or database to track requests per IP/user.

**Format**: `throttle:requests,minutes`

```php
// Example
'throttle:5,1'      // 5 requests per 1 minute
'throttle:100,60'   // 100 requests per 60 minutes
```

### Custom Rate Limits for Different Users

For future implementation:

```php
Route::post('/api/endpoint', [...])
    ->middleware('throttle:premium-limit');

// In config/cache.php or middleware
$limit = auth()->user()->isPremium() ? 1000 : 100;
```

---

## 📚 Usage Examples

### Example 1: Create Proyecto with Full Flow

```php
// Client sends request
POST /api/proyectos
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "nombre": "Presupuesto 2025",
  "moneda": "COP",
  "descripcion": "Presupuesto anual"
}

// Server flow
1. Sanctum middleware: Validates token → Gets authenticated user
2. StoreProyectoRequest: Validates data
   - nombre: "required|string|min:3|max:255" ✅
   - moneda: "required|string|size:3|uppercase" ✅
   - descripcion: "nullable|string|max:1000" ✅
3. ProyectoPolicy->create(): Check authorization
   - Can any authenticated user create? YES ✅
4. Controller action: Create project
5. Response (201 Created)

{
  "id": 42,
  "nombre": "Presupuesto 2025",
  "moneda": "COP",
  "descripcion": "Presupuesto anual",
  "user_id": 1,
  "created_at": "2025-11-16T10:30:00Z",
  "updated_at": "2025-11-16T10:30:00Z"
}
```

### Example 2: Update Proyecto with Authorization

```php
// Client sends request
PUT /api/proyectos/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "nombre": "Presupuesto Anual 2025"
}

// Server flow
1. Sanctum middleware: Validates token → Gets user
2. UpdateProyectoRequest: Validates data
   - nombre: "sometimes|string|min:3|max:255" ✅
3. ProyectoPolicy->update(): Check authorization
   - Is user admin of proyecto? 
   - If NO → 403 Forbidden
   - If YES → Continue ✅
4. Controller action: Update project
5. Response (200 OK)
```

### Example 3: Rate Limiting on Login

```php
// First 5 attempts succeed
POST /api/login (attempt 1-5) → 200/401
X-RateLimit-Remaining: 4, 3, 2, 1, 0

// Attempt 6 is blocked
POST /api/login (attempt 6) → 429 Too Many Requests

{
  "message": "Too Many Requests"
}

// Headers show when limit resets
X-RateLimit-Reset: 1699000060  // +60 seconds from now
```

---

## 🔄 Common Patterns

### Pattern 1: Check Permission Before Action

```php
// In Controller
public function delete(Request $request, Proyecto $proyecto)
{
    // Explicit authorization check
    if (!Gate::allows('delete', $proyecto)) {
        abort(403, 'No permission to delete this project');
    }
    
    $proyecto->delete();
    return response()->noContent();
}
```

### Pattern 2: Get Authorized Resources

```php
// Only get projects user is member of
public function index(Request $request)
{
    return $request->user()
        ->proyectos()
        ->with('miembros', 'categorias', 'cuentas')
        ->get();
}
```

### Pattern 3: Implicit Authorization via Route Model Binding

```php
// Laravel automatically calls ProyectoPolicy->view()
Route::get('/proyectos/{proyecto}', function (Proyecto $proyecto) {
    return $proyecto;  // Already authorized
})->middleware('auth:sanctum');
```

### Pattern 4: Check Before Creating Related Resource

```php
public function storeCategoria(
    StoreCategoriaRequest $request,
    Proyecto $proyecto
) {
    // Check user is member of proyecto
    if (!Gate::allows('create', [Categoria::class, $proyecto])) {
        abort(403);
    }
    
    return $proyecto->categorias()->create($request->validated());
}
```

---

## 🧪 Testing Examples

### Testing Policy Authorization

```php
// tests/Feature/ProyectoTest.php

public function test_non_member_cannot_view_project()
{
    $user = User::factory()->create();
    $proyecto = Proyecto::factory()->create();
    
    $this->assertFalse(
        Gate::allows('view', $proyecto)
    );
}

public function test_member_can_view_project()
{
    $user = User::factory()->create();
    $proyecto = Proyecto::factory()->create();
    $proyecto->miembros()->attach($user, ['role' => 'member']);
    
    $this->assertTrue(
        Gate::forUser($user)->allows('view', $proyecto)
    );
}
```

### Testing FormRequest Validation

```php
// tests/Feature/ProyectoTest.php

public function test_create_proyecto_with_invalid_data()
{
    $response = $this->postJson('/api/proyectos', [
        'nombre' => 'AB',  // Too short
        'moneda' => 'USDA',  // Too long
    ]);
    
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['nombre', 'moneda']);
}
```

### Testing Rate Limiting

```php
// tests/Feature/AuthTest.php

public function test_login_rate_limiting()
{
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);
    }
    
    // 6th attempt should be rate limited
    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrong',
    ]);
    
    $response->assertStatus(429);  // Too Many Requests
}
```

---

## 📖 References

- [Laravel Policies Documentation](https://laravel.com/docs/authorization)
- [Laravel Form Requests](https://laravel.com/docs/validation#form-request-validation)
- [Laravel Rate Limiting](https://laravel.com/docs/routing#rate-limiting)
- [Sanctum Token Management](https://laravel.com/docs/sanctum)

---

**Document Version**: 1.0  
**Last Updated**: November 16, 2025  
**Status**: ✅ Production Ready
