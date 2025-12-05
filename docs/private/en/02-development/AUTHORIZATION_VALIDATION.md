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

Laravel Policies are classes that organize authorization logic. They centralize authorization checks instead of scattering them throughout controllers.

### Policy Classes

Located in `app/Policies/`:

| Policy | Model | Actions |
|--------|--------|---------|
| `ProjectPolicy` | Project | view, create, update, delete, manageMembersAndInvitations |
| `CategoryPolicy` | Category | view, create, update, delete |
| `AccountPolicy` | Account | view, create, update, delete |
| `TransactionPolicy` | Transaction | view, create, update, delete |
| `InvitationPolicy` | Invitation | view, create, delete |

### ProjectPolicy Example

```php
class ProjectPolicy
{
    // Anyone can view their own projects
    public function view(User $user, Project $project): bool
    {
        return $project->members()->where('user_id', $user->id)->exists();
    }
    
    // Anyone authenticated can create
    public function create(User $user): bool
    {
        return true;
    }
    
    // Only admin members can update
    public function update(User $user, Project $project): bool
    {
        return $user->isAdminOf($project);
    }
    
    // Only project owner can delete
    public function delete(User $user, Project $project): bool
    {
        return $project->user_id === $user->id;
    }
}
```

### Using Policies in Controllers

```php
class ProjectController extends Controller
{
    public function show(Request $request, Project $project)
    {
        if (!Gate::allows('view', $project)) {
            abort(403, 'No permission to view this project');
        }
        
        return response()->json($project);
    }
    
    public function update(Request $request, Project $project)
    {
        if (!Gate::allows('update', $project)) {
            abort(403, 'No permission to update this project');
        }
        
        // Update logic...
    }
}
```

---

## ✔️ Input Validation with FormRequest

### What is FormRequest?

FormRequest classes centralize validation rules, custom messages, and authorization logic in a single reusable class.

### FormRequest Classes

Located in `app/Http/Requests/`:

| Class | Purpose | Usage |
|-------|---------|-------|
| `StoreProjectRequest` | Create project | POST /api/projects |
| `UpdateProjectRequest` | Update project | PUT /api/projects/{id} |
| `StoreCategoryRequest` | Create category | POST /api/projects/{id}/categories |
| `UpdateCategoryRequest` | Update category | PUT /api/projects/{id}/categories/{id} |
| `StoreAccountRequest` | Create account | POST /api/projects/{id}/accounts |
| `UpdateAccountRequest` | Update account | PUT /api/projects/{id}/accounts/{id} |
| `StoreInvitationRequest` | Create invitation | POST /api/projects/{id}/invitations |

### Example: StoreProjectRequest

```php
class StoreProjectRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'currency' => ['required', 'string', 'size:3', 'uppercase'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
    
    // Custom error messages
    public function messages(): array
    {
        return [
            'name.required' => 'Project name is required.',
            'name.min' => 'Name must be at least 3 characters.',
            'currency.required' => 'Currency is required.',
            'currency.size' => 'Currency must be exactly 3 characters (e.g. USD, EUR, COP).',
        ];
    }
}
```

### Using FormRequest in Controllers

```php
class ProjectController extends Controller
{
    public function store(StoreProjectRequest $request)
    {
        // $request is automatically validated
        // $request->validated() contains only validated data
        
        $validated = $request->validated();
        
        $project = auth()->user()->projects()->create([
            'name' => $validated['name'],
            'currency' => $validated['currency'],
            'description' => $validated['description'] ?? null,
        ]);
        
        return response()->json($project, 201);
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
'role' => 'required|string|in:admin,member',

// Currency codes (ISO 4217)
'currency' => 'required|string|size:3|uppercase',

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
  "message": "The name field is required.",
  "errors": {
    "name": ["Project name is required."],
    "currency": ["Currency must be exactly 3 characters (e.g. USD, EUR, COP)."]
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

---

## 📚 Usage Examples

### Example 1: Create Project with Full Flow

```php
// Client sends request
POST /api/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Budget 2025",
  "currency": "COP",
  "description": "Annual budget"
}

// Server flow
1. Sanctum middleware: Validates token → Gets authenticated user
2. StoreProjectRequest: Validates data
   - name: "required|string|min:3|max:255" ✅
   - currency: "required|string|size:3|uppercase" ✅
   - description: "nullable|string|max:1000" ✅
3. ProjectPolicy->create(): Check authorization
   - Can any authenticated user create? YES ✅
4. Controller action: Create project
5. Response (201 Created)
```

### Example 2: Update Project with Authorization

```php
// Client sends request
PUT /api/projects/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Annual Budget 2025"
}

// Server flow
1. Sanctum middleware: Validates token → Gets user
2. UpdateProjectRequest: Validates data
   - name: "sometimes|string|min:3|max:255" ✅
3. ProjectPolicy->update(): Check authorization
   - Is user admin of project? 
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
X-RateLimit-Reset: 1699000060  // +60 seconds
```

---

## 🔄 Common Patterns

### Pattern 1: Check Permission Before Action

```php
// In Controller
public function delete(Request $request, Project $project)
{
    if (!Gate::allows('delete', $project)) {
        abort(403, 'No permission to delete this project');
    }
    
    $project->delete();
    return response()->noContent();
}
```

### Pattern 2: Get Authorized Resources

```php
// Only get projects user is member of
public function index(Request $request)
{
    return $request->user()
        ->projects()
        ->with('members', 'categories', 'accounts')
        ->get();
}
```

### Pattern 3: Test Policy Authorization

```php
// tests/Feature/ProjectTest.php

public function test_non_member_cannot_view_project()
{
    $user = User::factory()->create();
    $project = Project::factory()->create();
    
    $this->assertFalse(
        Gate::forUser($user)->allows('view', $project)
    );
}

public function test_admin_can_update_project()
{
    $user = User::factory()->create();
    $project = Project::factory()->create();
    $project->members()->attach($user, ['role' => 'admin']);
    
    $this->assertTrue(
        Gate::forUser($user)->allows('update', $project)
    );
}
```

### Pattern 4: Test FormRequest Validation

```php
public function test_create_project_with_invalid_data()
{
    $response = $this->postJson('/api/projects', [
        'name' => 'AB',  // Too short
        'currency' => 'USDA',  // Too long
    ]);
    
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name', 'currency']);
}
```

### Pattern 5: Test Rate Limiting

```php
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
