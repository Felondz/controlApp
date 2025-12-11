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
*   [ ] Listeners para generación automática de Tareas.

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

### B. Error Persistente Crítico: WidgetSettingsModal Crash
*   **Síntoma**: `TypeError: Cannot read properties of null (reading 'id')` al abrir `WidgetSettingsModal`.
*   **Estado**: En investigación. A pesar de múltiples capas de protección (`?.`, `filter(Boolean)`), el error persiste en el reporte del usuario.
*   **Acciones Tomadas**:
    1.  Sanitización de `availableWidgets` en `widgetRegistry.js` con `filter(Boolean)`.
    2.  Uso de *optional chaining* masivo en `WidgetSettingsModal.jsx`.
    3.  Corrección de icono faltante `Squares2X2Icon` -> `TableCellsIcon` en el registro.
    4.  Adición de logs de depuración (`console.log`) en el modal.

### C. Próximos Pasos (Troubleshooting)
1.  **Revisar Consola del Navegador**: El usuario debe verificar el output de `WidgetSettingsModal: availableWidgets` para identificar si algún objeto widget está corrupto o mal formado.
2.  **Verificar Cache**: Asegurar que el navegador no esté sirviendo un bundle JS antiguo (Hard Reload recomendado).
3.  **Aislamiento**: Si el error continúa, deshabilitar temporalmente el renderizado de la lista de widgets para confirmar si el crash es interno del modal o de la lista.
