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
## 11. Workflow de Recetas y Arquitectura Orientada a Eventos (Diciembre 17)
**Objetivo**: Implementar flujo "Receta -> Lote" y desacoplar Operaciones de Inventario.

### A. Lógica de Recetas (Recipe Workflow)
*   **Modelo de Datos**:
    *   `ProductionProcess` (Receta): Define el *Output Product* y el flujo general.
    *   `StageInputTemplate` (Ingredientes): Vincula `InventoryItem` y `Quantity` a una Etapa específica.
    *   **Flujo**: Al crear un Lote, el sistema clona los `StageInputTemplates` hacia `LoteInsumo` con estado `pending`.
*   **Validación de UX**:
    *   **Proceso**: Se agregó selector de *Output Product* en `CreateProcessModal`.
    *   **Ingredientes**: Se implementó `ManageProcessModal` con pestañas ("Receta" y "Configuración") para gestionar ingredientes y metadatos del proceso.

### B. Arquitectura: Event-Driven Inventory Sync
Para cumplir con el principio de desacoplamiento modular, se refactorizó la lógica de consumo de insumos:
*   **Antes (Anti-patrón)**: `LoteController` decrementaba directamente `inventory_items.current_stock`.
*   **Ahora (Event-Driven)**:
    1.  `LoteController` marca el insumo como consumido y despacha evento `InputConsumed`.
    2.  `InventoryModule` escucha este evento.
    3.  Listener `DeductInventoryUsage` (Queued) ejecuta la transacción de inventario de forma asíncrona.
*   **Beneficio**: El módulo de Operaciones no conoce la implementación interna de Inventario.

### C. Refactorización de UI/UX
1.  **Kanban Interactivo**: Solucionado bug donde el Kanban no refrescaba al cambiar de proceso o crear uno nuevo (Sincronización de estado en `Index.jsx`).
2.  **Layout Móvil**: Ajuste de `CreateProcessModal` y layout principal para apilar controles verticalmente en pantallas pequeñas.
3.  **Gestión de Procesos**: Implementado Endpoint `PUT /processes/{process}` y formulario de edición completa.

### D. Pendientes Identificados

### E. Soluciones Aplicadas (Dec 17 - Navigation Fix)
*   **Fix Operations Navigation Crash**: Se solucionó un error crítico donde navegar al módulo de Operaciones causaba un crash o pantalla blanca.
    *   **Causas**:
        1.  **Prop Mismatch**: `Index.jsx` definía `onDragEnd` pero no lo pasaba a `KanbanBoard`. `KanbanBoard` usaba `undefined` en `DragDropContext`.
        2.  **Hydration Error**: `KanbanBoard` no tenía protección contra hidratación (`Strict Mode`), lo que causa fallos con `@hello-pangea/dnd`.
        3.  **Events Detached**: El handler `onLoteClick` no se pasaba a los componentes hijos, rompiendo la apertura de modales.
    *   **Solución**:
        *   Se conectó correctamente `onDragEnd` en `Index.jsx`.
        *   Se implementó el patrón `requestAnimationFrame` en `KanbanBoard` para asegurar renderizado correcto.
        *   Se hizo *prop drilling* correcto de `onLoteClick` hasta `LoteCard`.
*   **Fix Missing Kanban Stages**: Se corrigió el error donde las etapas no aparecían tras crear un proceso.
    *   **Causa**: El modelo `EtapaProceso` no incluía `production_process_id` en `$fillable`, descartando la relación al crear.
    *   **Solución**: Se agregó el campo en `EtapaProceso.php`.
*   **Fix RelationNotFoundException**: Se solucionó un crash (Error 500) en `LoteController`.
    *   **Causa**: El controlador intentaba cargar `assignedUser` pero la relación real es `assignee`.
    *   **Solución**: Se actualizó `LoteController.php` y `LoteCard.jsx` para usar `assignee`.
*   **Improvement**: Fix UI Noise & Broken Modals.
    *   **Date Format**: Removed time from Lote Card date.
    *   **Product Saving**: Fixed `LoteController` filtering out 0-stock items, allowing new products to be selected.
    *   **Event Driven Hydration**: Moved recipe input creation to `LoteCreated` event + `HydrateLoteInputs` listener.
### F. Deep Debugging & Stabilization (Dec 17 - DnD/Inputs)
*   **Fix DnD Crash (Silent Failure)**: persiste error crítico donde mover lotes entre etapas no consume insumos y fallaba silenciosamente.
    *   **Posible Causa**: El controlador llamaba a `$lote->insumos()` (método inexistente) en lugar de `$lote->inputs()`, generando una excepción interna.
    *   **Solución**: Corrección implementada del nombre del método en `LoteController` se tiene que hacer mas debigging hasta encontrar la causa real.
*   **Fix Input Assignment Failure**: Se solucionó la creación incorrecta de insumos con costo cero.
    *   **Causa**: El listener `HandleLoteInput` intentaba leer `unit_cost` de `InventoryItem`, pero la columna real es `cost_price`.
    *   **Solución**: Actualización de propiedad en listener.
*   **Fix Modal Flickering/Closing**: Se estabilizó el "Manage Process Modal".
    *   **Causa**: El uso de `redirect()->route(...)` en backend forzaba un recarga completa de la página, perdiendo el estado del modal (Flash/Flicker).
    *   **Solución**: Se revirtió a `return back()` con optimización frontend (`preserveState: true`, `only: ['stages']`) para actualizaciones fluidas, pero sigue parpadeando al hacer cualquier cambio en los insumos.
*   **Fix Missing Initial Consumption**: Se implementó consumo automático al crear Lote, pero no se refleja visualmente en el modal de Lote, donde debe ir el registro visual de que se ha consumido en este lote.
    *   **Acción**: Se creó listener `HandleLoteCreated` para clonar los insumos de la Etapa 1 inmediatamente al crear el lote.
*   **Fix Navigation Loop**: Se corrigió el problema donde "Agregar Insumo" redirigía incorrectamente al modal de Receta, pero sigue sin funcionar en el modal de Lote, pero persiste el bug de no poder agregar insumos desde el modal de Lote ni tener visualizacion de todos los insumos consumidos por ese lote.
### G. Pendientes Críticos y Requerimientos de Lógica (Reportado Dec 17)
*   **DnD Confirmation & Feedback**:
    *   **Problema**: El cambio de etapa no informa al usuario qué insumos se consumirán automáticamente.
    *   **Requerimiento**: Implementar modal de confirmación al soltar (drop) el lote en una nueva etapa, listando los insumos a descontar.
*   **Lógica de Consumo Seguro (Idempotencia)**:
    *   **Problema**: Mover lotes entre etapas (atrás/adelante) podría duplicar consumos o dejar de consumir si se saltan etapas.
    *   **Requerimiento**:
        *   Si se devuelve a una etapa anterior: No consumir nuevamente (el usuario debe usar consumo manual para reprocesos).
        *   Si se salta etapas: Advertir o impedir, asegurar que el consumo secuencial se respete o se gestione.
        *   Evitar "doble consumo" si el lote ya pasó por esa etapa previamente.
*   **Finalización y Descarte Visual**:
    *   **Problema**: Lotes marcados como `finished` o `discarded` cambian de estado en DB pero siguen visibles en el Kanban "Activo".
    *   **Requerimiento**: Filtrar el Kanban para mostrar solo lotes `active`. Los finalizados/descartados deben salir del flujo productivo y pasar a histórico/reportes.
*   **Visualización de Insumos en Lote**:
    *   **Problema**: El modal de Detalles del Lote no muestra correctamente el historial de insumos consumidos ni permite agregar nuevos sin fallos de redirección.
    *   **Requerimiento**: Reparar la carga de `lote.inputs` y la UX de agregación manual dentro del mismo modal.
*   **Mejoras Visuales (Tarjeta de Lote)**:
    *   **Requerimiento**: Mostrar en la tarjeta del Kanban el **Total Invertido** (Suma de costo de insumos consumidos hasta el momento).
*   **Automatización de Flujo (Triggers)**:
    *   **Requerimiento**: El cambio de etapa debe disparar eventos consistentes (`stage_changed`).
    *   **Finalización Automática**: Al mover un lote a la **Etapa Final**, el sistema debe disparar automáticamente la lógica de `finish` (Finalizar Proceso Exitoso), cambiando el estado a `finished` y solicitando la cantidad final producida (si aplica) o cerrando el ciclo.
*   **Reportes e Histórico**:
    *   **Problema**: No hay forma fácil de ver lotes terminados.
    *   **Requerimiento**: Implementar una vista dedicada o modal "Historial de Producción" con buscador/filtros para listar todos los lotes (activos, finalizados, descartados) por proceso, fecha y estado. Útil para informes.

### H. Resurrección del Sistema de Módulos y Correcciones Críticas de Integridad (19 Dic)
**Severidad**: CRÍTICA
**Contexto**: Fallo completo de comunicación entre módulos y valores de inventario caóticos (contabilidad doble/triple).

1.  **Fallo de Arranque del Sistema (Bootstrap)**:
    *   **Síntoma**: Múltiples "Fallos Silenciosos". Modales no cerraban, stock no actualizaba, eventos no se disparaban.
    *   **Causa Raíz**: Se eliminó accidentalmente `App\Providers\ModuleServiceProvider` de `bootstrap/providers.php`.
    *   **Solución**: Se volvió a registrar el proveedor. Esto reinició todo el sistema de módulos (Operaciones, Inventario, etc.).

2.  **TypeError en EventBus**:
    *   **Síntoma**: `TypeError: Argument #2 must be callable, string given` durante el arranque.
    *   **Solución**: Se relajó el tipado de `ModuleEventBus::subscribe` a `mixed` para aceptar nombres de Clases como listeners (Estándar Laravel).

3.  **Error Lógico en Module Event Bus (Doble Ejecución)**:
    *   **Síntoma**: Cada evento se disparaba exactamente dos veces.
    *   **Causa Raíz**: La lógica de `getListeners()` obtenía los listeners de "coincidencia exacta" y luego los volvía a capturar durante el bucle de "comodines".
    *   **Solución**: Se agregó lógica de exclusión: `if ($pattern === $eventName) continue;`. Se añadió deduplicación rígida `array_unique` antes de la ejecución.

4.  **Conflicto Arquitectónico (Inventario vs Operaciones)**:
    *   **Síntoma**: El inventario se descontaba dos veces por cada evento de consumo.
    *   **Causa Raíz**: Tanto `OperationsModule` (Listener: `HandleInputConsumed`) COMO `InventoryModule` (Listener: `DeductInventoryUsage`) escuchaban `operations.input.consumed` y descontaban stock independientemente.
    *   **Solución**: Se **Deshabilitó** la lógica en el listener de Operaciones. El Módulo de Inventario es ahora la *Única Autoridad* para actualizaciones de stock.

5.  **Condición de Carrera en Actualizaciones Manuales**:
    *   **Síntoma**: Los ajustes manuales en "Editar Item" calculaban totales incorrectos.
    *   **Causa Raíz**: El Controlador incrementaba manualmente `$item->increment` *Y* creaba una transacción (lo que incorrectamente disparaba al `InventoryTransactionObserver` a actualizar también).
    *   **Solución**: Se eliminaron los incrementos manuales en el Controlador. El sistema ahora confía 100% en el `Observer` para recalcular `current_stock` usando una estrategia de `sum(transactions)` (Fuente de Verdad Idempotente).

## 12. Consolidación de Calidad y Ciclo de Vida del Lote (Diciembre 19)
**Objetivo**: Implementar flujos finales de producción (Finish/Discard), historial visual y cobertura de pruebas completa.

### A. Mejoras Implementadas
*   [x] **Ciclo de Vida Completo**:
    *   **Finalizar Lote**: Implementada lógica `finish()` que valida inventario, marca estado como `finished` y dispara evento `LoteFinished`.
    *   **Descartar Lote**: Implementada lógica `discard()` para lotes cancelados.
    *   **Historial**: Nueva vista `History.jsx` con tabla server-side, filtros por estado y buscador.
*   [x] **Frontend Tests (Vitest)**:
    *   Creado `tests/Frontend/Pages/Operations/Lotes/History.test.jsx`.
    *   Verificación de renderizado, filtrado y navegación via router mock.
*   [x] **Correcciones de Estabilidad**:
    *   **Finance**: Fix `BalanceTest` (random account validation).
    *   **Inventory**: Fix `CreateFinishedGoodsEntryTest` (event payload mismatch).
    *   **Operations**: Fix `LoteStageChangeTest` usando aserciones de BD directas para eventos del `ModuleEventBus`.

### B. Decisiones de Diseño
*   **Separación de Tests Frontend**: Se movieron los tests de componentes fuera de `resources/js` hacia `tests/Frontend/` para mantener una estructura espejo más limpia.
*   **Mocking Extensivo**: Para `History.test.jsx` se mockearon dependencias pesadas (`AuthenticatedLayout`, `usePage`, `router`) enfocando el test en la lógica del componente.
