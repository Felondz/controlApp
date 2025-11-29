# Search Implementation Guide

## Summary
ControlApp uses **Meilisearch** via **Laravel Scout** to provide fast, relevant, and secure search capabilities. The search functionality is globally integrated into the top bar and supports indexing of Users and Projects.

## Architecture

### Backend
- **Driver**: `meilisearch` (Production/Development), `collection` (Testing).
- **Models**: `User`, `Proyecto`.
- **Trait**: `Laravel\Scout\Searchable`.
- **Controller**: `SearchController` handles queries and returns results to the Inertia frontend.

### Frontend
- **Component**: `SearchInput.jsx` (Top bar widget).
- **Page**: `SearchResults.jsx` (Displays results).
- **Logic**: Real-time or submission-based search sending queries to `/search`.

## Security and Access Control

> [!IMPORTANT]
> Search results are strictly filtered to ensure data privacy and role-based access control.

### 1. Project Visibility
- **Members**: Users can only find projects they are members of.
- **Admins**: Users can only find projects where they have the `admin` role (if strict mode is enabled).
- **Logic**:
  ```php
  // SearchController.php
  $proyectos = Proyecto::search($query)->get()->filter(function ($proyecto) use ($user) {
      // Only return projects where user is owner or admin
      return $user->esAdminDe($proyecto);
  });
  ```

### 2. Financial Data Protection
- **Search Results**: Financial summaries are **never** included in search results.
- **Project Detail**: Financial data (`cuentas`, `transacciones`) is only loaded if `$user->esAdminDe($proyecto)`.

## Configuration and Installation

### Prerequisites
- Running Meilisearch instance (e.g., via Docker).
- `MEILISEARCH_HOST` and `MEILISEARCH_KEY` in `.env`.

### Indexing
To initialize the index:
```bash
php artisan scout:import "App\Models\User"
php artisan scout:import "App\Models\Proyecto"
```

This is automated in:
- `composer.json` (post-create-project-cmd)
- CI/CD Pipeline (`deploy.yml`)

## Testing
- **Feature Test**: `tests/Feature/SearchTest.php`
- **Driver**: Uses `collection` driver for in-memory testing without needing a running Meilisearch instance.
