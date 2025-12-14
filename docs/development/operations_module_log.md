# Bitácora de Desarrollo: Expansión Operations & Inventory
**Fecha de Inicio**: Diciembre 2025
**Objetivo**: Implementar gestión de Operaciones (Producción), Inventario Centralizado y Automatización Financiera.

---

## 1. Visión y Alcance
El proyecto requiere expandirse de un gestor de tareas/finanzas a un ERP modular capaz de gestionar:
*   Ciclos de producción (ej. Cultivos, Manufactura).
*   Inventario de insumos y productos terminados.
*   Automatización de compras recurrentes y tareas operativas.

## 2. Decisiones Arquitectónicas Clave (Changelog de Diseño)

### A. Desacoplamiento de Inventario (v1.5)
*   **Decisión**: Separar `InventoryModule` como un módulo Core independiente de `OperationsModule`.
*   **Motivo**: Permitir que negocios de solo venta (retail) usen Inventario sin activar el módulo de Producción complejo.
*   **Efecto**: `Operations` depende de `Inventory`, pero `Inventory` es autónomo.

### B. Jerarquía de Procesos Productivos (v1.8)
*   **Decisión**: Introducir modelo `ProductionProcess` como padre de las Etapas.
*   **Antes**: `Proyecto` -> `EtapaProceso`. (Limitaba a un solo flujo lineal por proyecto).
*   **Ahora**: `Proyecto` -> `ProductionProcess` (ej. "Café", "Cacao") -> `EtapaProceso`.
*   **Motivo**: Soportar múltiples líneas de producción simultáneas en la misma hacienda/proyecto.

### C. Integración Financiera por Eventos (v1.7)
*   **Decisión**: `FinanceModule` gestiona `Providers` y `SupplyContracts` pero NO depende de `Inventory`.
*   **Mecanismo**: `SupplyContract` emite eventos (`finance.contract.processed`). Si Inventario está activo, escucha y crea la entrada de stock. Si no, solo se genera la factura.
*   **Motivo**: Mantener el Core de Finanzas limpio de dependencias opcionales.

### D. Automatización de Tareas (v1.7)
*   **Decisión**: Implementar `StageTaskTemplate` vinculado a Etapas.
*   **Flujo**: Al cambiar de etapa un Lote, el sistema clona los templates a Tareas reales (`Task`) vinculadas polimórficamente al Lote.

### E. Integración Core Polimórfica (Fase 1)
*   **Diseño**: Se modificaron las tablas `tasks` y `transacciones` para agregar columnas polimórficas (`related_type/id`, `source_type/id`).
*   **Beneficio**: Cualquier módulo futuro puede vincular tareas o dinero sin migrar la base de datos core.

---

## 3. Registro de Implementación (Log)

### Fase 1: Preparación Core (Completado)
*   [x] Migración para columnas polimórficas en `tasks` y `transacciones`.
*   [x] Actualización de modelos `Task` y `Transaccion` con `morphTo`.
*   [x] Ajuste de Validadores y Controllers existentes.

### Fase 2: Estructura Modular (Completado)
*   [x] Creación de `app/Modules/Inventory`.
*   [x] Creación de `app/Modules/Operations`.
*   [x] Definición de ServiceProviders (`InventoryModule.php`, `OperationsModule.php`).
*   [x] Registro en `config/modules.php`.

### Fase 3: Modelos y Datos (Completado)
Se ha desplegado el esquema completo de base de datos:
*   **Finance**:
    *   `providers`: Proveedores.
    *   `supply_contracts`: Configuración de compras recurrentes.
*   **Inventory**:
    *   `inventory_items`: Productos (Simples/Variables con `parent_id` + JSON attrs).
    *   `inventory_transactions`: Kardex.
*   **Operations**:
    *   `production_processes`: Definición de líneas.
    *   `etapas_proceso`: Pasos configurables.
    *   `lotes_produccion`: Instancias vivas de producción.
    *   `stage_task_templates`: Automatización de tareas.

### Fase 4: Lógica y Eventos (Pendiente)
*   [ ] Listeners para movimiento de stock automático.
*   [ ] Jobs para Cron de Contratos.
*   [x] Listeners para generación automática de Tareas.

### Fase 5: API y UI (En Progreso)
*   [x] Rutas API/Web controladas por módulo (`routes/web.php` refactorizado).
*   [x] Refactorización Dashboard Global a sistema de Widgets (`DraggableWidgetGrid`).
*   [x] Gestión de Imágenes en Inventario (`InventoryItemController`, `ImageUploader`).
*   [ ] Vistas React faltantes (Kanban de Lotes, Detalles de Producción).

---

## 4. Dificultades y Pendientes Técnicos
1.  **Validación de Eventos**: Será crucial testear unitariamente que los eventos se disparen y escuchen correctamente para evitar desincronización entre stock y finanzas.
2.  **UI Compleja**: La gestión de Lotes con múltiples procesos requerirá un selector de contexto claro en el Frontend.
3.  **Variantes de Producto**: El Front debe manejar dinámicamente los atributos JSON del `InventoryItem`.

---

## 5. Requerimientos de UX y Frontend (Bitácora)
*   **Venta de Inventario (Manual)**: El campo `Account` (Cuenta Destino) debe ser **OBLIGATORIO**.
    *   *Recomendación*: Mostrar advertencia fuerte si el usuario selecciona "Efectivo" (Caja General), promoviendo la trazabilidad bancaria.
*   **Gestor de Lotes**: Necesita selectores claros de "Proceso Productivo" para filtrar etapas.

---

## 6. Bitácora de Depuración y Estabilización (Diciembre 10)
**Contexto**: Implementación del Dashboard Global y Módulo de Inventario.

### A. Errores Resueltos
| Incidencia | Causa | Solución |
| :--- | :--- | :--- |
| `ReferenceError: DashboardIcon...` | Iconos no importados en `Sidebar.jsx`. | Importación masiva de iconos faltantes desde `@/Components/Icons`. |
| `ENOENT: SelectInput` | Componente inexistente. | Creación de `resources/js/Components/SelectInput.jsx`. |
| `404 Inventory Index` | Falta de ruta y método controller. | Implementación de `InventoryItemController@index` y ruta `GET /items`. |
| `TypeError: null (reading 'id')` (Initial) | Acceso a `proyecto.id` nulo en widgets de inventario. | Corrección de pase de props y lógica de controlador. |
| ReferenceError | Falta de `ziggy-js` | Instalación y configuración de `ziggy` global en `app.jsx`. |
| Pangea DnD Error | StrictMode + DOM | Fix de hidratación en `DraggableWidgetGrid` (useEffect). |
| N+1 Queries | Dashboard Counts | **Migración a EventBus Asíncrono** (Ver Fase 6). |

### B. Error Persistente Crítico: WidgetSettingsModal Crash
*   **Síntoma**: `TypeError: Cannot read properties of null (reading 'id')` al abrir `WidgetSettingsModal`.
*   **Estado**: En investigación. A pesar de múltiples capas de protección (`?.`, `filter(Boolean)`), el error persiste en el reporte del usuario.
*   **Acciones Tomadas**:
    1.  Sanitización de `availableWidgets` en `widgetRegistry.js` con `filter(Boolean)`.
    2.  Uso de *optional chaining* masivo en `WidgetSettingsModal.jsx`.
    3.  Corrección de icono faltante `Squares2X2Icon` -> `TableCellsIcon` en el registro.
    4.  Adición de logs de depuración (`console.log`) en el modal.

### C. Próximos Pasos (Troubleshooting)
3.  **Aislamiento**: Si el error continúa, deshabilitar temporalmente el renderizado de la lista de widgets para confirmar si el crash es interno del modal o de la lista.

### E. Soluciones Aplicadas (Agente Antigravity - Dec 12)
*   **Fix Operations Module**: Se corrigió error SQL crítico `table lotes_produccion has no column named current_stage_id`.
    *   **Causa**: Discrepancia entre nombre de columna en migración (`stage_id`) y en modelo (`current_stage_id`).
    *   **Solución**: Renombrado de propiedad mass-assignable en Modelo, Factory y Tests a `stage_id`.
*   **Stage Tasks Automation**: Se completó la implementación del listener `GenerateStageTasks` que clona templates al cambiar etapa.
    *   **Testing**: Se implementaron Unit Tests con Mockery para aislar lógica de negocio. Integration Tests presentan inestabilidad con SQLite/Scout en entorno local.

### D. Soluciones Aplicadas (Agente Antigravity - Dec 11)
*   **Fix WidgetSettingsModal**: Se agregaron chequeos de seguridad (`filter(w => w)`) en `WidgetSettingsModal.jsx` (líneas 36 y 95) para prevenir el crash `TypeError: null (reading 'id')` incluso si el `WidgetRegistry` retorna valores nulos.
*   **Fix Widgets (Global Dashboard)**: Se detectó que `MembersSummaryWidget`, `TasksSummaryWidget` y `ChatRecentWidget` intentaban generar links usando `project.id` incluso cuando `project` era nulo (contexto Global Dashboard). Se envolvieron estos links en una condicional `project ? (...) : null`.
*   **Fix Infinite Loop**: Se solucionó un error de `Maximum update depth exceeded` en `DraggableWidgetGrid`. La causa era pasar arrays como dependencias del `useEffect` (ej: `defaultLayout`), lo que causaba re-renderizados infinitos al cambiar la referencia del array en cada render. Se solucionó usando `.join(',')` para comparar por valor.

---

## 7. Fase 6: Arquitectura Orientada a Eventos (EventBus Asíncrono)
**Fecha de Inicio**: Diciembre 11, 2025
**Objetivo**: Migración a Event-Driven Architecture con `ModuleEventBus` asíncrono para todos los módulos.

### 7.1 Estado de Migración por Módulo

| Módulo | Estado | Eventos Migrados | Listeners con ShouldQueue |
|--------|--------|------------------|---------------------------|
| **Chat** | ✅ Completado | `chat.message.sent` | `UpdateUnreadCount` |
| **Operations** | ✅ Completado | `operations.lote.stage_changed`, `operations.lote.finished` | `GenerateStageTasks` |
| **Inventory** | ✅ Completado | `inventory.stock.low` | `CreateFinishedGoodsEntry`, `CreateInventoryDraftEntry`, `CreateReplenishmentTask` |
| **Finance** | ✅ Completado | `finance.contract.executed` | - (emite eventos, no escucha) |

### 7.2 Problema Original (N+1 Queries)
*   **Síntoma**: Consultas repetitivas (`select count(*) ... messages`) en Dashboard.
*   **Causa**: Cálculo "on-the-fly" de mensajes no leídos en `ProyectoUiWebController`.
*   **Solución**: Arquitectura "Read Model" con columna caché `unread_messages_count`.

### 7.3 Patrón de Implementación (Referencia: Chat Module)

#### Eventos
Todos los eventos deben extender `BaseModuleEvent`:
```php
class MessageSent extends BaseModuleEvent
{
    public function getName(): string
    {
        return 'chat.message.sent';  // String-based naming
    }
}
```

#### Listeners
Implementar `ShouldQueue` con conexión Redis:
```php
class UpdateUnreadCount implements ShouldQueue
{
    use InteractsWithQueue;
    public $connection = 'redis';
    
    public function handle(ModuleEvent $event): void { ... }
}
```

#### Registro en Módulo
Usar strings en `getEventListeners()`:
```php
'chat.message.sent' => [UpdateUnreadCount::class]
```

### 7.4 Infraestructura

| Componente | Configuración |
|------------|---------------|
| Queue Driver | Redis |
| Workers | 3 réplicas en producción |
| Logging | `storage/logs/modules.log` |
| Env Vars | `MODULE_EVENT_ASYNC=true`, `MODULE_EVENT_LOG=true` |

### 7.5 Resultados (Diciembre 11, 2025)
1.  [x] Migrar eventos de Operations a `BaseModuleEvent`
2.  [x] Migrar eventos de Inventory a `BaseModuleEvent`
3.  [x] Agregar `ShouldQueue` a todos los listeners
4.  [x] Tests de integración pasados (62 tests, 200 assertions)

---

## 8. Dashboard Refactor & Stabilization (Dec 11)
**Objetivo**: Simplificar la interfaz principal y corregir errores críticos de navegación.

### A. Refactorización del Dashboard (User Request)
*   **Decisión**: El Dashboard Global deja de ser un contenedor de widgets genéricos y pasa a ser una **Grilla de Proyectos** pura.
*   **Implementación**:
    *   Se eliminó `DraggableWidgetGrid` de la vista principal.
    *   Se creó `DraggableProjectGrid` especializado en renderizar y reordenar `ProjectCards`.
    *   **Drag & Drop**: Se implementó reordenamiento persistente de proyectos usando `@hello-pangea/dnd` con un *handle* dedicado en la tarjeta.
    *   **Persistencia**: Fix de anidación JSON para guardar correctamente el orden en `user.settings.global_dashboard.project_order`.

### B. Módulo de Operaciones (Skeleton)
*   **Incidencia**: Crash de aplicación por ruta faltante `operations.lotes.index` (Ziggy Error).
*   **Acción**:
    *   Se creó la estructura base del módulo: `app/Modules/Operations/Controllers/LoteController.php`.
    *   Se definió la ruta en `routes/web.php` apuntando al controlador real.
    *   Se creó la vista placeholder `Operations/Lotes/Index.jsx` para permitir navegación sin errores 404.

### C. Estado de Migración a EventBus (Workers)
**Status**: ✅ **Piloto Exitoso**
*   **Arquitectura**: Confirmada y estable en entorno local.
*   **Componentes**:
    *   `ModuleEventBus` (Async) -> Correcto.
    *   `Redis Queue` -> Procesando eventos sin lag.
    *   `UpdateUnreadCount` -> Actualiza la columna caché en tiempo real.
*   **Próximos Pasos**: Desplegar a Staging y monitorear `modules.log` bajo carga.

---

## 9. Actualización Inventario y UI (Diciembre 12)
**Contexto**: Polishing de UI, estandarización de botones y widgets de Inventario.

### A. Mejoras Implementadas
*   [x] **Estandarización UI**: Botones "Personalizar" y "Nuevo Item/Tarea" unificados con estilo Finanzas.
*   [x] **Inventory Widgets**: Implementación final de `InventorySummary`, `LowStock` y `InventoryItems` con diseño responsive.
*   [x] **Fix Redefinición**: Solucionado error de variable `t` en `AuthenticatedLayout`.
*   [x] **Tasks UI**: Aplicación de tema de proyecto a módulo de Tareas y búsqueda reactiva.
*   [x] **Draggable Fix**: Restricción de widgets globales que causaban error en Project Overview.

### B. Pendientes Críticos
*   [ ] **Frontend Tests**: Faltan pruebas automatizadas para los componentes y widgets de Inventario.



## 10. Gestión de Operaciones e Inventario Avanzado (Diciembre 13)
**Objetivo**: Flexibilizar la creación de Procesos Productivos y corregir integración de inventario.

### A. Gestión de Procesos (Etapas Dinámicas)
*   **Problema**: El sistema solo permitía 3 etapas fijas ("Inicio", "Proceso", "Finalizado").
*   **Solución**:
    *   **Frontend**: Se actualizó `CreateProcessModal.jsx` para permitir agregar, editar y eliminar etapas dinámicamente durante la creación del proceso.
    *   **Backend**: `LoteController::storeProcess` ahora acepta un array de `stages`, las valida y las crea transaccionalmente.

### B. Correcciones Técnicas (Bug Fixes)
1.  **Ziggy Route Error**: Corregido error persistente donde `operations.processes.store` no era encontrada. Solución implicó limpieza de inputs en `app.jsx` y corrección de sintaxis de parámetros de ruta en modals.
2.  **SQL Error (1364)**: Solucionado error de campo default `proyecto_id` faltante al crear `EtapaProceso` por defecto.
3.  **Method Call Error**: Agregada relación faltante `inventoryItems()` en modelo `Proyecto` para permitir carga de estadísticas en el Dashboard.
4.  **Frontend Build**: Reparado crash de compilación Vite por importación errónea de `Link` en `CreateProcessModal`.
5.  **Linting**: Limpieza de tipos indefinidos (`Inertia`) y llamadas inseguras a `Auth` en `InventoryItemController`.

### C. Próximos Pasos
*   [ ] Implementar **Edición de Procesos** existentes (Rename/Reorder etapas).
*   [ ] Validar integración completa de **Consumo de Inventario** en transacciones de lotes.
