# ControlApp - Agent Development Guidelines

This file contains essential information for AI agents working on the ControlApp codebase. Follow these guidelines strictly to maintain code quality and consistency.

## Project Overview

ControlApp is a full-stack collaborative project management platform with:
- **Backend**: Laravel 12 (PHP 8.2+) with modular event-driven architecture
- **Frontend**: React 18 + Inertia.js + Vite
- **Database**: SQLite (dev), MySQL 8.0+ (production)
- **Package Manager**: PNPM (mandatory - do NOT use npm)

## Essential Commands

### Development Environment
```bash
# Complete project setup (first time only)
composer setup

# Full-stack development (server + queue + logs + vite)
composer dev

# Install dependencies
pnpm install        # Frontend dependencies
composer install    # Backend dependencies
```

### Backend Commands
```bash
# Run tests
./vendor/bin/sail test          # Via Laravel Sail
composer test                   # Alternative

# Database operations
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan serve

# Static analysis (CRITICAL - must pass after EVERY PHP change)
./vendor/bin/phpstan analyse    # Full project - Level 8
./vendor/bin/phpstan analyse app/Modules/ModuleName/  # Targeted module analysis
./vendor/bin/phpstan analyse app/Mcp/                 # MCP tools analysis
```

> **⚠️ MANDATORY**: After ANY PHP file creation or modification, you MUST run `./vendor/bin/phpstan analyse` on the affected files/directories and resolve ALL errors before considering the task complete. Zero errors is the only acceptable result.

### Frontend Commands
```bash
# Development
pnpm run dev                    # Start Vite dev server
pnpm run build                  # Production build

# Testing
pnpm test                       # Run Vitest tests
pnpm test:ci                    # CI tests with verbose output

# Linting/Formatting (if available)
# Note: No ESLint/Prettier configured - rely on PHPStan for backend
```

### Running Single Tests
```bash
# Backend (PHPUnit)
./vendor/bin/sail test --filter TestClassName
./vendor/bin/sail test tests/Feature/SpecificTest.php

# Frontend (Vitest)
pnpm test -- SpecificTest.test.jsx
pnpm test --run --reporter=verbose SpecificTest.test.jsx
```

## Code Style Guidelines

### PHP (Backend)
- **Strict Typing**: All files MUST start with `<?php declare(strict_types=1);`
- **PSR-12 Compliance**: Follow PSR-12 coding standards
- **Type Hints**: Use type hints everywhere (parameters, return types, properties)
- **PHPStan Level 8**: Code must pass PHPStan analysis at Level 8. Run after EVERY change.
- **Eloquent Generics**: All Eloquent relationships MUST include PHPStan generics (e.g., `@return BelongsTo<Model, $this>`)
- **Factory Generics**: All factories MUST have `@extends Factory<Model>` annotations
- **DocBlocks**: Use comprehensive PHPDoc for classes, methods, and properties

#### PHP Code Structure
```php
<?php declare(strict_types=1);

namespace App\Your\Namespace;

use Required\Dependencies;

/**
 * Brief description of the class
 * 
 * @property Type $property Description
 * @method static methodName() Description
 */
class YourClass
{
    use RequiredTraits;
    
    public function methodName(Type $parameter): ReturnType
    {
        // Implementation
    }
}
```

### React/JavaScript (Frontend)
- **Functional Components**: Use functional components with hooks only
- **PascalCase**: Component names in PascalCase
- **forwardRef**: Use forwardRef for components needing ref access
- **Destructuring**: Destructure props and imports consistently

#### React Component Structure
```jsx
import { useState, useEffect, forwardRef } from 'react';
import { useTranslate } from 'react-i18next'; // MANDATORY for i18n

export default forwardRef(function ComponentName(
    { requiredProp, optionalProp = 'defaultValue', ...props },
    ref
) {
    const { t } = useTranslate(); // Always use translation hook
    
    // Component logic
    
    return (
        <div className="tailwind-classes">
            {/* Conditional Route Safety Check */}
            {window.route && window.route().has('optional.route') && (
                <Link href={route('optional.route')}>Link</Link>
            )}
        </div>
    );
});
```

#### Conditional Routes (Ziggy Prevention)
> **⚠️ CRITICAL**: When rendering links or components for routes that are conditionally loaded in the backend (e.g., behind environment checks like `APP_ENV=staging`), you **MUST** verify the route exists in the frontend Ziggy object.
> Calling `route('missing.route')` will crash the entire React application.
> **ALWAYS** wrap conditional routes like this:
> `{window.route && window.route().has('your.route.name') && <Link href={route('your.route.name')}>...`

## Architecture Guidelines

### Modular Backend Structure
- **Modules**: `app/Modules/{ModuleName}/` (Finance, Tasks, Chat, Inventory, Operations)
- **Event-Driven**: Use ModuleEventBus for inter-module communication (NO direct module coupling)
- **Standard Laravel**: Controllers, Models, Policies, Requests, Observers
- **Deprecated**: Analytics and Notifications modules have been removed

### UUID Routing Convention (CRITICAL)
> **⚠️ MANDATORY**: All primary resources use **UUID** for route model binding, NOT integer IDs.
> This applies to `Proyecto`, `Cuenta`, `InventoryItem`, `LoteProduccion`, `Task`, and all models using the `HasUuids` trait.

**Rules:**
1. **Models**: All routable models MUST have `getRouteKeyName()` returning `'uuid'` and use the `HasUuids` trait.
2. **Frontend routing**: Always use `model.uuid` when building route parameters:
   ```jsx
   // ✅ CORRECT
   route('operations.lotes.store', { proyecto: proyecto.uuid })
   post(`/api/proyectos/${proyectoId}/cuentas/${account.uuid}`, data)
   
   // ❌ WRONG — will cause 404
   route('operations.lotes.store', { proyecto: proyecto.id })
   post(`/api/proyectos/${proyectoId}/cuentas/${account.id}`, data)
   ```
3. **Backend redirects**: Controllers MUST use `$model->uuid` in route parameters:
   ```php
   // ✅ CORRECT
   return to_route('operations.lotes.index', ['proyecto' => $proyecto->uuid]);
   
   // ❌ WRONG
   return to_route('operations.lotes.index', ['proyecto' => $proyecto->id]);
   ```
5. **Internal queries**: Use `$model->id` (integer) for database queries, foreign keys, and relationships. UUIDs are ONLY for routing.

### Route Parameter Consistency (CRITICAL)
> **⚠️ MANDATORY**: To prevent Ziggy hydration errors and ensure correct Route Model Binding, all project-scoped routes MUST use the parameter name **`{proyecto}`**.
> - **Backend Routes**: Always use `Route::prefix('.../{proyecto}')->group(...)` or `->parameters(['...' => 'proyecto'])`.
> - **Controller Methods**: Always use `public function methodName(Request $request, Proyecto $proyecto)`. The variable name MUST be `$proyecto`.
> - **Frontend**: Pass the parameter as `proyecto` in the `route()` helper (e.g., `route('name', { proyecto: uuid })`).
> - **NEVER** use `mis_proyecto`, `project`, or other variants. Consistent naming is the only way to avoid 403 Forbidden errors and React crashes.

### API Strategy (GraphQL vs REST)
- **GraphQL (Primary Mobile Data Layer)**: Use for >95% of standard Mobile operations. Ideal for CRUD, fetching nested relationships (e.g., loading a Project with Members, Tasks, and Transactions in one trip), and reducing mobile payload sizes.
- **REST API (Specialized/Streaming/Web Parity Layer)**: Use strictly for endpoints requiring HTTP Streaming (like LLM Chat SSE responses), binary file uploads, webhooks, or when identical request/response parity is mandatory between Web (React) and Mobile (React Native) bypassing GraphQL limitations.

### Frontend Organization
- **Components**: `resources/js/Components/` for reusable UI components
- **Pages**: `resources/js/Pages/` for Inertia.js page components
- **Modules**: `resources/js/Modules/{ModuleName}/` for feature-specific components
- **Path Aliases**: Use `@/*` mapping to `resources/js/*`

### Currency Formatting Convention
- **Database**: All monetary values are stored as **integers in cents** (centavos).
- **Display**: Use `formatCurrency(amountInCents, currencyCode)` from `@/Utils/currencyHelpers.js`.
- **Input Fields**: Use the `<CurrencyInput>` component (`@/Components/CurrencyInput.jsx`) for all money input fields. It:
  - Shows the correct currency symbol based on `currency` prop
  - Formats with thousand separators on blur
  - Respects decimal rules: **no decimals** for COP/JPY/KRW/CLP, **2 decimals** for USD/EUR/GBP
  ```jsx
  <CurrencyInput
      id="saldo_inicial"
      value={data.saldo_inicial}  // Value in currency units (NOT cents)
      onChange={(e) => setData('saldo_inicial', e.target.value)}
      currency={data.moneda}      // ISO 4217 code
      className="mt-1 block w-full"
  />
  ```
- **Conversion**: When loading from DB, divide by 100. When saving to DB, multiply by 100.
  ```js
  // Loading: centsToDisplay
  const val = (dbValue / 100).toFixed(shouldShowDecimals(currency) ? 2 : 0);
  // Saving: displayToCents
  const cents = parseFloat(formValue || 0) * 100;
  ```

## Critical Rules

### Internationalization (i18n)
- **MANDATORY**: All user-facing text MUST use `useTranslate` hook
- **NO Hardcoded Text**: Never write strings directly in components
- **Translation Keys**: Use descriptive keys like 'dashboard.welcome.title'

### Security
- **Authorization**: Always check policies before allowing actions
- **Input Validation**: Use Form Requests for validation
- **No Secrets**: Never commit API keys, passwords, or sensitive data

### Testing
- **100% Backend Coverage**: Target 100% test coverage for PHP code
- **Frontend Testing**: Use Vitest + React Testing Library
- **Test Database**: Use SQLite in-memory for testing

### Performance
- **N+1 Prevention**: Use eager loading to avoid N+1 queries
- **Caching**: Implement appropriate caching strategies
- **Efficient Queries**: Write optimized database queries

## Import Conventions

### PHP Imports
```php
// Order: Framework, third-party, application
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use ThirdParty\Package\Class;
use App\Models\YourModel;
use App\Your\Custom\Class;
```

### React Imports
```jsx
// Order: React, third-party, local components
import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import LocalComponent from '@/Components/LocalComponent';
```

## Error Handling

### Backend
- **Exceptions**: Use appropriate exception types
- **Validation**: Return proper validation responses
- **Logging**: Log errors appropriately for debugging

### Frontend
- **Error Boundaries**: Implement error boundaries where needed
- **User Feedback**: Show user-friendly error messages
- **Validation**: Display validation errors clearly

## Naming Conventions

### Files
- **PHP**: PascalCase (e.g., `UserController.php`)
- **React**: PascalCase (e.g., `UserProfile.jsx`)
- **Components**: Descriptive names (e.g., `UserAvatar`, `ProjectCard`)

### Variables/Functions
- **PHP**: camelCase (e.g., `getUserData()`)
- **JavaScript**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

## Quality Assurance

### Before Committing
1. **Run Tests**: Ensure all tests pass
2. **Static Analysis**: Run `./vendor/bin/phpstan analyse`
3. **Code Review**: Check for security vulnerabilities
4. **Documentation**: Update relevant documentation

### Code Review Checklist
- [ ] PHPStan passes at Level 8
- [ ] All tests pass
- [ ] i18n properly implemented
- [ ] Security policies checked
- [ ] Performance considerations addressed
- [ ] Code follows project conventions

## Development Workflow

1. **Setup**: Use `composer setup` for new environments
2. **Development**: Use `composer dev` for full-stack development
3. **Testing**: Run tests frequently during development
4. **PHPStan**: Run `./vendor/bin/phpstan analyse` on every modified PHP file — **zero errors required**
5. **Documentation**: Update docs for significant changes

## Special Considerations

### Laravel Sail
- Development runs in Docker containers via Laravel Sail
- Use `./vendor/bin/sail` for Laravel commands in containerized environment

### Event-Driven Architecture
- Modules communicate via events only
- No direct module-to-module dependencies
- Use ModuleEventBus for all inter-module communication

### Search Integration
- Meilisearch integration via Laravel Scout
- Implement `toSearchableArray()` methods for searchable models

## 13. Model Context Protocol (MCP) Tools

ControlApp utilizes a custom MCP Server to provide structured, domain-specific tools in `app/Mcp/Tools/`. These tools give you (the AI) powerful capabilities to query balances, fetch active operations, and modify the database directly.

> **🔒 MCP SECURITY PROTOCOL (CRITICAL)**: Many MCP tools that modify critical financial or inventory states (such as deleting data, discounting stock, paying bills, etc.) are protected. They mandate a boolean `confirm_action` argument in their JSON schema.
> If a tool requests `confirm_action`, **you MUST NOT AUTO-APPROVE IT**. You must explicitly ask the user for permission in chat, and ONLY if the user says "Yes", execute the tool with `confirm_action: true`.

For a full list of tools and details on this security protocol, you **MUST READ**:
`docs/private/es/03-ia-collaboration/MCP_TOOLS.md`

This document should be updated as the project evolves. Always refer to the latest version when working on the codebase.