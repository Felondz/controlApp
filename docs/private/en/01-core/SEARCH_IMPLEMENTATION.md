# Search Implementation Guide

## Summary
ControlApp uses **Meilisearch** via **Laravel Scout** to provide fast, relevant, and secure search capabilities. The search functionality is globally integrated into the top bar and supports indexing of Users and Projects.

**SQL Fallback**: If Meilisearch is unavailable, the system automatically uses SQL search with `LIKE` to ensure functionality is always available.

## Architecture

### Backend
- **Driver**: `meilisearch` (Production/Development by default), `collection` (Testing).
- **Models**: `User`, `Proyecto`.
- **Trait**: `Laravel\Scout\Searchable`.
- **Controllers**: 
  - `SearchController` (Web): Handles queries and returns results via Inertia.
  - `Api\SearchController` (API): Handles queries and returns JSON results for mobile apps.

### Frontend
- **Component**: `SearchInput.jsx` (Top bar widget).
- **Page**: `SearchResults.jsx` (Displays results).
- **Logic**: Real-time or submission-based search sending queries to `/search` (Web) or `/api/search` (API).

### Endpoints
- **Web**: `GET /search?query={query}` (Inertia)
- **API**: `GET /api/search?query={query}` (JSON, requires Bearer authentication)

## Search Engine

### Meilisearch (Primary)
- **Advantages**: Fast, relevant, typo-tolerant searches
- **Configuration**: `config/scout.php` → `driver: meilisearch`
- **Requirements**: Running Meilisearch instance

### SQL Fallback (Secondary)
- **Activation**: Automatic when Meilisearch is unavailable
- **Implementation**: Search with `LIKE %query%` on relevant fields
- **Fields**:
  - Users: `name`, `email`
  - Projects: `nombre`, `descripcion`
- **Advantages**: Guarantees 100% search service availability

## Security and Access Control

> [!IMPORTANT]
> Search results are strictly filtered to ensure data privacy and role-based access control.

### 1. Project Visibility
- **Admins**: Users can only find projects where they have the `admin` role or are owners.
- **Logic**:
  ```php
  // SearchController.php
  $adminProjectIds = $user->proyectosPersonales()->pluck('id')
      ->merge($user->proyectos()->wherePivot('rol', 'admin')->pluck('proyectos.id'))
      ->unique()
      ->values()
      ->all();
  
  $projects = Proyecto::search($query)
      ->whereIn('id', $adminProjectIds)
      ->take(10)
      ->get();
  ```

### 2. Financial Data Protection
- **Search Results**: Financial summaries are **never** included in search results.
- **Project Detail**: Financial data (`cuentas`, `transacciones`) is only loaded if `$user->esAdminDe($proyecto)`.

## Configuration and Installation

### Prerequisites
- Running Meilisearch instance (e.g., via Docker).
- `MEILISEARCH_HOST` and `MEILISEARCH_KEY` in `.env`.

### Environment Variables
```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

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
- **Feature Tests**: 
  - `tests/Feature/Web/SearchTest.php` (Web)
  - `tests/Feature/Api/SearchTest.php` (API)
- **Driver**: Uses `collection` driver for in-memory testing without needing a running Meilisearch instance.

## Troubleshooting

### Meilisearch is unavailable
- **Symptom**: Searches return empty results or are slow
- **Solution**: System automatically uses SQL fallback
- **Logs**: Check `storage/logs/laravel.log` for messages like "Search failed, using SQL fallback"

### Results not updated
- **Cause**: Meilisearch index out of date
- **Solution**: Re-index models
  ```bash
  php artisan scout:flush "App\Models\User"
  php artisan scout:import "App\Models\User"
  ```
