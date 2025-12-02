# Guía de Implementación de Búsqueda

## Resumen
ControlApp utiliza **Meilisearch** a través de **Laravel Scout** para proporcionar capacidades de búsqueda rápidas, relevantes y seguras. La funcionalidad de búsqueda está integrada globalmente en la barra superior y soporta la indexación de Usuarios y Proyectos.

**Fallback SQL**: Si Meilisearch no está disponible, el sistema automáticamente utiliza búsqueda SQL con `LIKE` para garantizar que la funcionalidad siempre esté disponible.

## Arquitectura

### Backend
- **Driver**: `meilisearch` (Producción/Desarrollo por defecto), `collection` (Pruebas).
- **Modelos**: `User`, `Proyecto`.
- **Trait**: `Laravel\Scout\Searchable`.
- **Controladores**: 
  - `SearchController` (Web): Maneja consultas y devuelve resultados vía Inertia.
  - `Api\SearchController` (API): Maneja consultas y devuelve resultados JSON para apps móviles.

### Frontend
- **Componente**: `SearchInput.jsx` (Widget de barra superior).
- **Página**: `SearchResults.jsx` (Muestra resultados).
- **Lógica**: Búsqueda en tiempo real o por envío que manda consultas a `/search` (Web) o `/api/search` (API).

### Endpoints
- **Web**: `GET /search?query={query}` (Inertia)
- **API**: `GET /api/search?query={query}` (JSON, requiere autenticación Bearer)

## Motor de Búsqueda

### Meilisearch (Primario)
- **Ventajas**: Búsqueda rápida, relevante, typo-tolerant
- **Configuración**: `config/scout.php` → `driver: meilisearch`
- **Requisitos**: Instancia de Meilisearch corriendo

### SQL Fallback (Secundario)
- **Activación**: Automática cuando Meilisearch no está disponible
- **Implementación**: Búsqueda con `LIKE %query%` en campos relevantes
- **Campos**:
  - Usuarios: `name`, `email`
  - Proyectos: `nombre`, `descripcion`
- **Ventajas**: Garantiza disponibilidad 100% del servicio de búsqueda

## Seguridad y Control de Acceso

> [!IMPORTANT]
> Los resultados de búsqueda se filtran estrictamente para garantizar la privacidad de los datos y el control de acceso basado en roles.

### 1. Visibilidad del Proyecto
- **Admins**: Los usuarios solo pueden encontrar proyectos donde tienen el rol de `admin` o son propietarios.
- **Lógica**:
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

### 2. Protección de Datos Financieros
- **Resultados de Búsqueda**: Los resúmenes financieros **nunca** se incluyen en los resultados de búsqueda.
- **Detalle del Proyecto**: Los datos financieros (`cuentas`, `transacciones`) solo se cargan si `$user->esAdminDe($proyecto)`.

## Configuración e Instalación

### Prerrequisitos
- Instancia de Meilisearch en ejecución (ej. vía Docker).
- `MEILISEARCH_HOST` y `MEILISEARCH_KEY` en `.env`.

### Variables de Entorno
```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

### Indexación
Para inicializar el índice:
```bash
php artisan scout:import "App\Models\User"
php artisan scout:import "App\Models\Proyecto"
```

Esto está automatizado en:
- `composer.json` (post-create-project-cmd)
- Pipeline de CI/CD (`deploy.yml`)

## Pruebas
- **Feature Tests**: 
  - `tests/Feature/Web/SearchTest.php` (Web)
  - `tests/Feature/Api/SearchTest.php` (API)
- **Driver**: Usa el driver `collection` para pruebas en memoria sin necesitar una instancia de Meilisearch corriendo.

## Troubleshooting

### Meilisearch no está disponible
- **Síntoma**: Búsquedas devuelven resultados vacíos o son lentas
- **Solución**: El sistema automáticamente usa SQL fallback
- **Logs**: Revisa `storage/logs/laravel.log` para mensajes como "Search failed, using SQL fallback"

### Resultados no actualizados
- **Causa**: Índice de Meilisearch desactualizado
- **Solución**: Re-indexar modelos
  ```bash
  php artisan scout:flush "App\Models\User"
  php artisan scout:import "App\Models\User"
  ```
