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
            {/* JSX content */}
        </div>
    );
});
```

## Architecture Guidelines

### Modular Backend Structure
- **Modules**: `app/Modules/{ModuleName}/` (Finance, Tasks, Chat, Inventory, Operations, Analytics, Notifications)
- **Event-Driven**: Use ModuleEventBus for inter-module communication (NO direct module coupling)
- **Standard Laravel**: Controllers, Models, Policies, Requests, Observers

### Frontend Organization
- **Components**: `resources/js/components/` for reusable UI components
- **Pages**: `resources/js/Pages/` for Inertia.js page components
- **Modules**: `resources/js/Modules/{ModuleName}/` for feature-specific components
- **Path Aliases**: Use `@/*` mapping to `resources/js/*`

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

This document should be updated as the project evolves. Always refer to the latest version when working on the codebase.