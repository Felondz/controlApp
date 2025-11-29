# Política de Versionado de Software

ControlApp sigue los principios de **Versionado Semántico (SemVer 2.0.0)**, adaptados a la naturaleza full-stack del proyecto.

## Estructura de Versión: `MAJOR.MINOR.PATCH`

### 1. MAJOR (`X`.0.0)
Se incrementa cuando hay **cambios incompatibles** o hitos arquitectónicos masivos.
- **Criterios**:
  - Reescritura completa del Backend o Frontend.
  - Cambios en la API que rompen compatibilidad con clientes móviles existentes.
  - Migración de tecnologías base (ej. cambiar de MySQL a PostgreSQL, o de React a Vue).
  - **Ejemplo**: Pasar de `1.x` a `2.0` al lanzar la App Móvil nativa.

### 2. MINOR (1.`X`.0)
Se incrementa cuando se añaden **nuevas funcionalidades** de manera compatible.
- **Criterios**:
  - Implementación de un nuevo módulo completo (ej. Módulo de Tareas, Chat).
  - Integración de servicios externos importantes (ej. Meilisearch, Pasarela de Pagos).
  - Cambios significativos en el Frontend que mejoran la experiencia pero no rompen el flujo (ej. Nuevo Dashboard).
  - **Contexto Actual**: La versión `1.1.0` marca la consolidación del Frontend y la Búsqueda Global.

### 3. PATCH (1.0.`X`)
Se incrementa cuando se realizan **correcciones de errores** compatibles.
- **Criterios**:
  - Bug fixes (ej. corrección de redirección de logo).
  - Ajustes menores de UI/UX (ej. cambio de iconos, colores).
  - Actualizaciones de traducción o documentación.
  - Actualizaciones de dependencias de seguridad.

## Flujo de Trabajo
1.  **Desarrollo**: Se trabaja en ramas `feature/` o `fix/`.
2.  **Release**: Al fusionar a `main`/`dev` para despliegue, se determina la nueva versión.
3.  **Tagging**: Se crea un git tag (ej. `v1.1.0`).
4.  **Changelog**: Se actualiza `CHANGELOG.md` moviendo "Unreleased" a la nueva versión.
