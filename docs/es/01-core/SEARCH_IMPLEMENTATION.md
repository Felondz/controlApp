# Guía de Implementación de Búsqueda

## Resumen
ControlApp utiliza **Meilisearch** a través de **Laravel Scout** para proporcionar capacidades de búsqueda rápidas, relevantes y seguras. La funcionalidad de búsqueda está integrada globalmente en la barra superior y soporta la indexación de Usuarios y Proyectos.

## Arquitectura

### Backend
- **Driver**: `meilisearch` (Producción/Desarrollo), `collection` (Pruebas).
- **Modelos**: `User`, `Proyecto`.
- **Trait**: `Laravel\Scout\Searchable`.
- **Controlador**: `SearchController` maneja las consultas y devuelve resultados al frontend de Inertia.

### Frontend
- **Componente**: `SearchInput.jsx` (Widget de barra superior).
- **Página**: `SearchResults.jsx` (Muestra resultados).
- **Lógica**: Búsqueda en tiempo real o por envío que manda consultas a `/search`.

## Seguridad y Control de Acceso

> [!IMPORTANT]
> Los resultados de búsqueda se filtran estrictamente para garantizar la privacidad de los datos y el control de acceso basado en roles.

### 1. Visibilidad del Proyecto
- **Miembros**: Los usuarios solo pueden encontrar proyectos de los que son miembros.
- **Admins**: Los usuarios solo pueden encontrar proyectos donde tienen el rol de `admin` (si el modo estricto está habilitado).
- **Lógica**:
  ```php
  // SearchController.php
  $proyectos = Proyecto::search($query)->get()->filter(function ($proyecto) use ($user) {
      // Solo devolver proyectos donde el usuario es propietario o admin
      return $user->esAdminDe($proyecto);
  });
  ```

### 2. Protección de Datos Financieros
- **Resultados de Búsqueda**: Los resúmenes financieros **nunca** se incluyen en los resultados de búsqueda.
- **Detalle del Proyecto**: Los datos financieros (`cuentas`, `transacciones`) solo se cargan si `$user->esAdminDe($proyecto)`.

## Configuración e Instalación

### Prerrequisitos
- Instancia de Meilisearch en ejecución (ej. vía Docker).
- `MEILISEARCH_HOST` y `MEILISEARCH_KEY` en `.env`.

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
- **Feature Test**: `tests/Feature/SearchTest.php`
- **Driver**: Usa el driver `collection` para pruebas en memoria sin necesitar una instancia de Meilisearch corriendo.
