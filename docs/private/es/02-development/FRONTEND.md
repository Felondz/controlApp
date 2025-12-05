# Documentación Frontend

## Componentes Reutilizables

### PasswordInput
Un envoltorio alrededor del elemento `input` nativo que añade un botón para alternar la visibilidad.
- **Ruta**: `resources/js/Components/PasswordInput.jsx`
- **Props**: Acepta todas las props estándar de input más `error` (string) para estilos de validación.
- **Características**:
  - Alterna entre tipos `password` y `text`.
  - Estilos conscientes del tema (modo claro/oscuro).
  - Integra `EyeIcon` y `EyeOffIcon`.
  - Soporte para estilos de estado de error.

### ChatWidget
- **Ruta**: `resources/js/Components/Project/ChatWidget.jsx`
- **Propósito**: Proporciona una interfaz de chat en tiempo real (polled) para los miembros del proyecto.
- **Props**:
  - `project`: Objeto del proyecto (debe incluir `id`).
  - `user`: Usuario autenticado actual.
- **Características**:
  - **Mensajería Privada**: Soporte para chats 1 a 1 con miembros del proyecto.
  - **Chat General**: Chat grupal para todos los miembros.
  - **Auto-scroll**: Se desplaza automáticamente al mensaje más nuevo.
  - **Polling Optimizado**: Actualiza cada 3 segundos sin causar bucles infinitos gracias a actualizaciones optimistas.
  - **Sincronización Global**: Actualiza contadores de Sidebar y Navbar automáticamente al leer mensajes.
  - **Móvil**: Navegación mejorada con botón "Volver a Chats" y diseño responsivo.
  - **Consciente del tema**: Usa `ChatIcon` y colores del tema.

### InboxDropdown
- **Ruta**: `resources/js/Components/InboxDropdown.jsx` (Integrado en `AuthenticatedLayout`)
- **Propósito**: Muestra una lista desplegable de proyectos con mensajes no leídos.
- **Características**:
  - Badge de conteo de no leídos en tiempo real.
  - Enlaces directos al chat del proyecto.
  - Enlace "Ver Todo" a la página `/inbox`.

### Módulo de Finanzas
- **Dashboard**: `resources/js/Pages/Projects/Finance/ProjectDashboard.jsx`
  - Panel principal con gráficos de cuentas y lista de transacciones.
  - **Filtrado**: Muestra cuentas activas por defecto, con opción de "Mostrar Inactivas".
  - **Gestión**: Permite crear/editar/eliminar cuentas y transacciones.
  - **Integración Tasks**: Muestra tareas financieras pendientes en el widget de Obligaciones Próximas.
  - **Navegación**: Recibe prop `project` para contexto correcto en Sidebar/BottomNavigation.
  
- **AccountChart**: `resources/js/Components/Finance/AccountChart.jsx`
  - Visualización de saldo, ingresos y gastos por cuenta.
  - **Estado**: Distinción visual (opacidad/badge) para cuentas inactivas.
  - **Información Detallada**: Muestra campos específicos según tipo de cuenta:
    - **Tarjetas de Crédito**: Límite, crédito disponible, fecha de pago, tasa de interés
    - **Préstamos**: Monto total, cuota mensual, cuotas restantes, tasa de interés
    - **Inversiones**: Fecha de vencimiento, tasa de retorno esperada
    - **Nómina**: Días de pago (separados por comas), monto estimado
  - **Badges**: Indicadores visuales del tipo de cuenta con iconos apropiados.
  - **Color Coding**: Saldos en verde (positivo) o rojo (negativo).
  - **Owner Differentiation** (Proyectos Colaborativos):
    - **Badge de Propietario**: Muestra iniciales + primer nombre del dueño (ej: "JP Juan")
    - **8 Colores Distintos**: Paleta automática para identificar hasta 8 propietarios
    - **Solo Colaborativo**: Badges solo aparecen en proyectos con `!proyecto.es_personal`
  - **Acciones Encapsuladas**: Botón único de "Administrar" que abre AccountAdminModal.
  - **Props**:
    - `cuenta`: Objeto de cuenta
    - `onEdit`: Callback para administrar/editar cuenta
    - `onClick`: Callback opcional para ver historial de transacciones
    - `isCollaborative`: Boolean para activar badges de propietario
  - **Manejo de Moneda**: Divide automáticamente los valores del backend (centavos) por 100 para visualización correcta.
    
- **AccountAdminModal**: `resources/js/Components/Finance/Modals/AccountAdminModal.jsx` (✨ NUEVO)
  - Modal profesional para administración completa de cuentas con **3 tabs**:
  
  **Tab 1 - Información Básica**:
    - Nombre, banco, tipo de cuenta
    - Moneda (8 opciones: COP, USD, EUR, MXN, PEN, CLP, ARS, BRL)
    - Saldo inicial
    - Estado (Activa/Inactiva)
  
  **Tab 2 - Configuración Avanzada** (condicional según tipo):
    - **Tarjetas de Crédito**: Límite de crédito, tasa anual, día de corte, día de pago, fecha vencimiento
    - **Préstamos**: Plazo (meses), cuota mensual, cuotas pagadas, tasa anual, día de pago
    - **Inversiones**: Tasa esperada (%), fecha de vencimiento
    - **Nómina** (banco): Toggle `es_nomina`, grid interactivo 7x5 para 1-4 días de pago, valor estimado
  
  **Tab 3 - Zona de Riesgo** (Danger Zone):
    - Advertencia clara sobre acciones irreversibles
    - Botón rojo "Eliminar Cuenta" que abre DeleteAccountModal para confirmación final
    - Información sobre transacciones asociadas
  
  - **Props**:
    - `show`: Boolean para mostrar/ocultar modal
    - `account`: Objeto de cuenta a editar
    - `proyecto`: Objeto de proyecto para contexto
    - `onClose`: Callback al cerrar
    - `onSuccess`: Callback al guardar cambios
  
- **AccountModal**: `resources/js/Components/Finance/Modals/AccountModal.jsx` (Legado)
  - Modal para crear nuevas cuentas.
  - Mantiene compatibilidad con flujo de creación rápida.
  - **Nota**: Para editar cuentas existentes, usar AccountAdminModal en lugar de este.
  - **Tipos de cuenta** (6 tipos):
    - `efectivo`: Dinero en efectivo
    - `banco`: Cuenta bancaria (con soporte para nómina)
    - `credito`: Tarjeta de crédito (requiere campos adicionales)
    - `inversion`: Cuenta de inversión
    - `prestamo`: Préstamo
    - `otro`: Otros tipos
  - **Campos condicionales**:
    - **Crédito**: `cupo`, `tasa_interes`, `fecha_vencimiento`
    - **Préstamo**: `cupo`, `plazo`, `valor_cuota`, `cuotas_pagadas`, `tasa_interes`, `fecha_vencimiento`
    - **Inversión**: `tasa_interes`, `fecha_vencimiento` (opcional)
    - **Nómina** (banco): `es_nomina`, `dia_nomina` (array de 1-4 días), `valor_nomina`
  - **Payroll UI**: Grid interactivo de 7x5 para seleccionar múltiples días de pago (ej: 15 y 30 para quincenal)
  - **Currency Selector**: Soporta 8 monedas (COP, USD, EUR, MXN, PEN, CLP, ARS, BRL)
  - **Defaults**: La moneda por defecto es `proyecto.moneda_default`, pero cada cuenta puede tener su propia moneda
  - Soporte para cambiar el estado de la cuenta (Activa/Inactiva).
  
- **DeleteAccountModal**: `resources/js/Components/Finance/Modals/DeleteAccountModal.jsx`
  - Modal de confirmación segura para eliminación de cuentas.
  - **Seguridad**: Requiere escribir el nombre exacto de la cuenta para confirmar.
  - **Advertencias**: Muestra conteo de transacciones asociadas.
  - **Validación**: Botón de eliminar deshabilitado hasta confirmación correcta.
  - **Errores**: Muestra errores del backend (restricciones, permisos, etc.).
  - **Integración**: Se abre desde la Tab "Zona de Riesgo" de AccountAdminModal.
  
- **PaymentConfirmationModal**: `resources/js/Components/Finance/Modals/PaymentConfirmationModal.jsx`
  - Modal para confirmar el pago de tareas financieras.
  - Pre-llena formulario con datos de la tarea (título, monto, categoría).
  - Permite editar antes de confirmar.
  - Marca automáticamente la tarea como "done" al crear la transacción.
  
- **UpcomingObligationsWidget**: `resources/js/Components/Finance/Widgets/UpcomingObligationsWidget.jsx`
  - Muestra próximos pagos y obligaciones financieras.
  - **Integración Tasks**: Combina transacciones futuras y tareas financieras pendientes.
  - **Diferenciación**: Ingresos (verde) vs Gastos (rojo).
  - **Nómina**: Genera eventos separados para cada día de pago configurado (ej: 15 y 30 del mes).
  - **Visual**: Badge "Tarea" para distinguir tareas de transacciones.
  - **Visual**: Badge "Tarea" para distinguir tareas de transacciones.
  - **Acción**: Botón "Marcar como pagado" (checkmark) al hacer hover (solo admin).
  - **Obligaciones**: Incluye automáticamente cortes de tarjeta y pagos de préstamos basados en `dia_pago`.
  - **Manejo de Moneda**: Divide automáticamente los valores del backend (centavos) por 100 para visualización correcta.

### Alert
Componente para mostrar mensajes de estado (información, advertencia, éxito, error) con estilos estandarizados.

**Uso:**
```jsx
import Alert from '@/Components/Alert';

<Alert type="info" title="Nota">
    Este es un mensaje informativo.
</Alert>
```

**Props:**
- `type`: 'info' (azul), 'warning' (ámbar), 'success' (verde), 'error' (rojo). Default: 'info'.
- `title`: Título opcional en negrita.
- `children`: Contenido del mensaje.
- `className`: Clases CSS adicionales.

**Ubicación:** `resources/js/Components/Alert.jsx`

## Iconos
Se utiliza una estrategia híbrida de iconos SVG reutilizables y Heroicons.
- **Ubicación:** `resources/js/Components/Icons.jsx`
- **Nuevos Iconos:** `InfoIcon`, `BookOpenIcon`, `CodeIcon`.

## Tema y Colores
El sistema utiliza Tailwind CSS con variables CSS para el soporte de temas dinámicos.
- **Primario**: Definido por el tema seleccionado (púrpura, azul, verde, etc.).
- **Secundario**: `colors.gray` para mantener el modo oscuro elegante y neutro.
- **Info**: `colors.blue` para elementos informativos y técnicos (ej. tarjeta de desarrollador).

## Componentes UI

### QuantityInput
Componente para entrada numérica con botones de incremento/decremento, usando colores del tema.

**Uso:**
```jsx
import QuantityInput from '@/Components/UI/QuantityInput';

<QuantityInput
    value={term}
    onChange={setTerm}
    min={1}
    max={360}
    label="Plazo"
/>
```

**Props:**
- `value`: Valor numérico actual.
- `onChange`: Función para manejar cambios de valor.
- `min`: Valor mínimo permitido (default: 0).
- `max`: Valor máximo permitido (default: Infinity).
- `step`: Paso de incremento/decremento (default: 1).
- `label`: Texto de etiqueta opcional.
- `className`: Clases CSS adicionales.

**Estilos**: Usa `text-primary-600 dark:text-primary-400` para los botones para coincidir con el tema activo.

**Ubicación:** `resources/js/Components/UI/QuantityInput.jsx`

### InputGroup
Componente para inputs de texto/número con etiqueta y sufijo/tooltip opcional.

**Uso:**
```jsx
import InputGroup from '@/Components/UI/InputGroup';

<InputGroup
    label="Tasa de Interés"
    tooltip="Tasa Efectiva Anual"
    type="number"
    value={rate}
    onChange={(e) => setRate(Number(e.target.value))}
    suffix="%"
/>
```

**Props:**
- `label`: Texto de la etiqueta.
- `value`: Valor del input.
- `onChange`: Función manejadora de cambios.
- `type`: Tipo de input (default: 'text').
- `placeholder`: Texto placeholder.
- `suffix`: Texto sufijo opcional (ej. '%', 'USD').
- `tooltip`: Texto de tooltip opcional.
- `className`: Clases CSS adicionales.

**Estilos**: El sufijo usa `text-primary-600 dark:text-primary-400` con peso de fuente negrita.

**Ubicación:** `resources/js/Components/UI/InputGroup.jsx`

---

## Diseño Responsivo

### Estrategia de Breakpoints

La aplicación utiliza un enfoque de diseño responsivo "mobile-first" con los siguientes breakpoints:

- **Móvil**: `< 768px` - Navegación inferior, diseños de una columna, espaciado reducido
- **Tablet**: `768px - 1024px` - Barra lateral (colapsable), grillas de 2 columnas
- **Escritorio**: `> 1024px` - Barra lateral (expandida), grillas de múltiples columnas, espaciado completo

### Breakpoints de Tailwind

Uso consistente de breakpoints de Tailwind CSS en todas las vistas:
- `sm:` - 640px en adelante
- `md:` - 768px en adelante
- `lg:` - 1024px en adelante
- `xl:` - 1280px en adelante

### Componentes de Navegación

#### Sidebar (Escritorio y Tablet)
- **Visibilidad**: Oculto en móvil (`hidden md:flex`), visible en tablet y escritorio
- **Ubicación**: `resources/js/Components/Sidebar.jsx`
- **Características**:
  - Colapsable en escritorio
  - Consciente del tema con variables CSS
  - Navegación consciente del proyecto
  - Muestra herramientas globales cuando están habilitadas

#### BottomNavigation (Móvil)
- **Visibilidad**: Visible en móvil (`md:hidden`), oculto en tablet y escritorio
- **Ubicación**: `resources/js/Components/BottomNavigation.jsx`
- **Características**:
  - Fijo en la parte inferior de la pantalla (`fixed bottom-0`)
  - Navegación consciente del contexto (global vs proyecto)
  - Diseño de grilla dinámica (3-4 columnas basado en ítems)
  - Consciente del tema usando variables CSS

**Uso:**
```jsx
import BottomNavigation from '@/Components/BottomNavigation';

<BottomNavigation user={user} project={project} />
```

**Props:**
- `user`: Objeto de usuario autenticado (requerido)
- `project`: Objeto del proyecto actual (opcional, para navegación de proyecto)

**Ítems de Navegación:**
- **Contexto Global**: Dashboard, Marketplace, Herramientas
- **Contexto de Proyecto**: Dashboard, Proyecto Actual, Finanzas (si está habilitado)

**Estilos:**
- Estado activo: `text-primary-600 dark:text-primary-400`
- Estado inactivo: `text-gray-500 dark:text-gray-400`
- Hover: `hover:text-primary-600 dark:hover:text-primary-400`

### Consideraciones de Diseño

#### Padding del Contenido Principal
El `AuthenticatedLayout` añade padding inferior para evitar superposición de contenido con la navegación inferior:
```jsx
<div className="py-6 pb-20 md:pb-6">
```
- `pb-20` (80px) en móvil para despejar la navegación inferior
- `md:pb-6` (24px) en tablet y escritorio

#### Botones de Acción Flotantes (FAB)
Los FABs deben posicionarse por encima de la navegación inferior en móvil:
```jsx
className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40"
```
- `bottom-20` en móvil (encima de nav inferior)
- `md:bottom-8` en escritorio (posición normal)
- `z-40` (nav inferior es `z-50`)

### Patrones Responsivos

#### Diseños de Grilla
```jsx
// Grilla de proyectos del Dashboard
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">

// Tarjetas de resumen de proyecto
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Selector de tema
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```

#### Espaciado
```jsx
// Padding: más pequeño en móvil, más grande en escritorio
<div className="p-4 sm:p-6">

// Gap: más ajustado en móvil, más amplio en escritorio
<div className="gap-4 md:gap-6">

// Margen: reducido en móvil
<div className="pt-4 sm:pt-8 pb-4 sm:pb-6">
```

#### Tipografía
```jsx
// Encabezados: más pequeños en móvil
<h1 className="text-xl sm:text-2xl">

// Texto cuerpo: más pequeño en móvil
<p className="text-xs sm:text-sm">
```

#### Dirección Flex
```jsx
// Apilar verticalmente en móvil, horizontal en escritorio
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### Probando Diseño Responsivo

Usar la emulación de dispositivos de DevTools del navegador para probar:
1. **Móvil**: iPhone 12 Pro (390x844)
2. **Tablet**: iPad (768x1024)
3. **Escritorio**: 1920x1080

**Lista de Verificación:**
- [ ] Navegación inferior visible y funcional en móvil
- [ ] Barra lateral visible y funcional en tablet/escritorio
- [ ] Sin desplazamiento horizontal en ningún breakpoint
- [ ] Todos los elementos interactivos accesibles
- [ ] Formularios utilizables en móvil
- [ ] Gráficos responsivos
- [ ] Imágenes escalan correctamente

### ChatWidget
- **Ruta**: `resources/js/Components/Project/ChatWidget.jsx`
- **Propósito**: Proporciona una interfaz de chat en tiempo real (polled) para los miembros del proyecto.
- **Props**:
  - `project`: Objeto del proyecto (debe incluir `id`).
  - `user`: Usuario autenticado actual.
- **Características**:
  - **Mensajería Privada**: Soporte para chats 1 a 1 con miembros del proyecto.
  - **Chat General**: Chat grupal para todos los miembros.
  - **Auto-scroll**: Se desplaza automáticamente al mensaje más nuevo.
  - **Polling**: Actualiza cada 5 segundos.
  - **Consciente del tema**: Usa `ChatIcon` y colores del tema.

### InboxDropdown
- **Ruta**: `resources/js/Components/InboxDropdown.jsx` (Integrado en `AuthenticatedLayout`)
- **Propósito**: Muestra una lista desplegable de proyectos con mensajes no leídos.
- **Características**:
  - Badge de conteo de no leídos en tiempo real.
  - Enlaces directos al chat del proyecto.
  - Enlace "Ver Todo" a la página `/inbox`.

## Comandos de Desarrollo

### Compilación y Desarrollo

**Desarrollo (Hot Reload):**
```bash
npm run dev
```
Inicia el servidor de desarrollo de Vite con hot module replacement (HMR). Los cambios se reflejan automáticamente en el navegador.

**Compilación para Producción:**
```bash
npm run build
```
Compila y optimiza todos los assets para producción. Los archivos se generan en `public/build/`.

**Nota Importante:** Después de hacer cambios en componentes React, siempre ejecuta `npm run build` para que los cambios se reflejen en el navegador. El navegador puede cachear la versión anterior, por lo que puede ser necesario hacer un "hard refresh" (Ctrl+Shift+R o Cmd+Shift+R).

### Con Laravel Sail (Docker)

Si estás usando Laravel Sail, ejecuta los comandos dentro del contenedor:

```bash
# Desarrollo
./vendor/bin/sail npm run dev

# Compilación
./vendor/bin/sail npm run build
```

## Sistema de Estandarización de Monedas

La aplicación implementa un **sistema multi-moneda centralizado** diseñado para futuras funcionalidades de conversión de divisas.

### Utilidades Centrales

**Ubicación**: `resources/js/Utils/currencyHelpers.js`

**Funciones**:
- `getCurrencySymbol(currencyCode)` - Retorna el símbolo correcto ($, €, £, ¥, etc.)
- `getCurrencyLocale(currencyCode)` - Retorna cadena de locale (es-CO, en-US, de-DE, etc.)
- `shouldShowDecimals(currencyCode)` - Determina si la moneda usa decimales
- `formatCurrency(amount, currencyCode, divideByCents)` - Formatea cantidad con símbolo y estructura correctos

**Monedas Soportadas (19+)**:
- **Américas**: USD, COP, MXN, BRL, ARS, CLP, PEN, CAD
- **Europa**: EUR, GBP, CHF, RUB, TRY
- **Asia**: JPY, CNY, KRW, INR
- **Otros**: AUD, ZAR

### Reglas de Formato

1. **Visualización de Símbolos**: Cada moneda muestra su símbolo apropiado
   - USD/COP/MXN/ARS/CLP: `$`
   - EUR: `€`
   - GBP: `£`
   - JPY/CNY: `¥`
   - BRL: `R$`

2. **Formato Consciente de Locale**:
   - COP (Colombia): `$1.500.000` (puntos para miles, sin decimales)
   - USD (Estados Unidos): `$1,500.00` (comas para miles, 2 decimales)
   - EUR (Alemania): `€1.500,00` (puntos para miles, coma para decimales)

3. **Manejo de Decimales**:
   - **Sin decimales**: COP, JPY, KRW, CLP (solo números enteros)
   - **2 decimales**: USD, EUR, GBP y la mayoría de los demás

4. **Código de Colores**:
   - **Verde** (`text-green-600 dark:text-green-400`): Saldos positivos
   - **Rojo** (`text-red-600 dark:text-red-400`): Saldos negativos

### Estrategia de Almacenamiento Backend

1. **Almacenamiento (Backend)**: Todos los valores monetarios se almacenan como **enteros (centavos)**
   - Ejemplo: $103.00 se almacena como `10300`
2. **Entrada (Frontend)**: El usuario ingresa valores en **unidades** (ej: 103.00)
   - Frontend multiplica por 100 antes de enviar al backend
   - `AccountAdminModal`: `parseFloat(value) * 100`
3. **Visualización (Frontend)**: Frontend recibe **centavos** del backend
   - `formatCurrency` divide automáticamente por 100 cuando `divideByCents = true`
   - Los componentes pasan valores del backend directamente al helper

> [!IMPORTANT]
> Si observa valores incorrectos (ej: 1.030.000 en lugar de 10.300), verifique que `formatCurrency` se esté llamando con `divideByCents = true` o que los valores se estén dividiendo por 100.

### Componentes que Usan Currency Helpers

Los 13 widgets financieros usan formato centralizado:

1. **AnalyticsWidget** - Gráficos de tendencia con montos formateados
2. **FinanceWidget** - Visualización de saldo con código de colores, sin icono de módulo
3. **UpcomingObligationsWidget** - Obligaciones futuras
4. **BalanceSummaryWidget** - Activos/pasivos/patrimonio neto
5. **SavingsGoalWidget** - Seguimiento de progreso de metas
6. **CreditSimulationWidget** - Cálculos de préstamos
7. **TransactionsWidget** - Listado de transacciones
8. **AccountChart** - Visualización de cuentas
9. **FinancialChartsWidget** - Todos los tipos de gráficos
10. **PersonalDashboard** - Visualización general

### Ejemplo de Uso

```jsx
import { formatCurrency } from '@/Utils/currencyHelpers';

// Formatear saldo con símbolo y estructura apropiados
const balanceInCents = 150000; // del backend
const currency = 'COP';
const formatted = formatCurrency(balanceInCents, currency, true); // "$1.500.000"

// Diferentes monedas
formatCurrency(150000, 'USD', true); // "$1,500.00"
formatCurrency(150000, 'EUR', true); // "€1.500,00"
formatCurrency(150000, 'JPY', true); // "¥1,500"
```

### Ruta de Migración Futura

El sistema está preparado para:
- Tipos de cambio en tiempo real
- Cuentas multi-moneda
- Transacciones entre monedas
- Historial de conversión de divisas

## Testing

El código frontend está completamente cubierto por pruebas automatizadas utilizando **Vitest** y **React Testing Library**.

- **Cobertura**: 100% de Cobertura de Componentes (217 tests en 39 archivos).
- **Ubicación**: `tests/Frontend/Components`.
- **Comando**: `npm run test`.
- **Nota**: Todos los tests usan claves de traducción en lugar de texto hardcodeado, siguiendo el sistema de i18n.

Para detalles sobre la arquitectura de pruebas y guías, consulta [TESTING_ARCHITECTURE.md](../04-testing/TESTING_ARCHITECTURE.md).

## Transacciones Programadas (Facturas)

La aplicación soporta **transacciones programadas/pendientes** (facturas) con un flujo de trabajo dedicado:

### Esquema de Base de Datos
- **status**: `enum('completed', 'pending', 'cancelled')` - Estado de la transacción
- **is_recurring**: `boolean` - Si la transacción se repite
- **recurrence_interval**: `enum('daily', 'weekly', 'biweekly', 'monthly', 'yearly')` - Frecuencia
- **recurrence_day**: `integer` - Día del mes/semana para la recurrencia
- **next_occurrence**: `date` - Próxima fecha programada

### Componentes Frontend

1. **BillModal** (`resources/js/Components/Finance/Modals/BillModal.jsx`):
   - Modal dedicado para crear y editar facturas pendientes.
   - **Campos**: Monto, Descripción, Fecha de Vencimiento.
   - **Estado**: Guarda siempre como `status='pending'` y `cuenta_id=null`.

2. **BillsWidget** (`resources/js/Components/Finance/Widgets/BillsWidget.jsx`):
   - Widget específico para visualizar facturas pendientes.
   - **Acciones**:
     - **Pagar**: Abre `QuickTransactionModal` en modo Gasto con datos pre-llenados.
     - **Editar**: Abre `BillModal` para modificar la factura.
     - **Eliminar**: Elimina la factura pendiente.
   - **Visual**: Indicadores de días restantes (Vencido, Hoy, Mañana, X días).

   - Listado de facturas pendientes.
   - Acciones: Crear nueva factura, editar, pagar, eliminar.
   - Botón estilizado con SVG para "Agregar Factura".

3. **AccountFlowWidget** (`resources/js/Components/Finance/Widgets/AccountFlowWidget.jsx`) - ✨ NUEVO v2.6.0:
   - **Propósito**: Visualización de distribución de ingresos y gastos por cuenta bancaria.
   - **Gráficos de Torta Duales**:
     - **Ingresos**: Gráfico dona (donut chart) en tonos verdes (#10B981 → #064E3B)
     - **Gastos**: Gráfico dona en tonos rojos (#EF4444 → #7F1D1D)
   - **Efectos Visuales**:
     - Sombras SVG 3D usando `feGaussianBlur` + `feOffset`
     - `innerRadius={40}` para estilo dona profesional
     - Bordes con brillo: `stroke="rgba(255,255,255,0.3)"`
   - **Etiquetas de Porcentaje**: Muestra porcentajes precisos en cada rebanada (>5%)
   - **Leyenda Interactiva**:
     - Nombre de cuenta truncado
     - Badge de propietario (solo proyectos colaborativos)
     - Monto total formateado
   - **Colores Inteligentes**:
     - Proyectos colaborativos: usa colores del propietario
     - Proyectos personales: paleta estándar de 5 tonos
   - **Props**:
     - `transactions`: Array de transacciones del proyecto
     - `accounts`: Array de cuentas (proyecto + asociadas)
     - `isCollaborative`: Boolean para mostrar badges de propietario
     - `currency`: Código de moneda (COP, USD, EUR, etc.)
   - **Totales por Sección**: Muestra total de ingresos y gastos en headers
   - **Flujo Neto**: Footer con balance total (verde si positivo, rojo si negativo)
   - **Configurable**: Toggle en DashboardSettingsModal
   - **Posición**: Después de FinancialChartsWidget, antes de TransactionsWidget

4. **QuickTransactionModal** (`resources/js/Components/Finance/Modals/QuickTransactionModal.jsx`):
   - Enfocado exclusivamente en Ingresos y Gastos (transacciones completadas).
   - **Modo Pago**: Al pagar una factura, este modal se abre pre-llenado para completar la transacción y asignar la cuenta de pago.
   - **Auto-llenado**: Al seleccionar una categoría, la descripción se completa automáticamente.

5. **UpcomingObligationsWidget**:
   - Muestra transacciones pendientes combinadas con tareas financieras.
   - Indicadores de alerta basados en proximidad de fecha de vencimiento.

6. **TransactionsWidget** (`resources/js/Components/Finance/Widgets/TransactionsWidget.jsx`):
   - Lista de transacciones recientes (último 100, scroll).
   - Acciones: Editar/Eliminar transacciones.
   - **Owner Badges** (Proyectos Colaborativos) - ✨ NUEVO v2.6.0:
     - Badge de iniciales del propietario junto al nombre de cuenta
     - Tooltip muestra nombre completo del propietario
     - Solo visible si `isCollaborative={true}` y cuenta tiene propietario
   - **Props Adicionales**:
     - `isCollaborative`: Boolean para activar badges de propietario
   - Filtrado y ordenamiento descendente por fecha.

### Flujo de Trabajo
1. Usuario crea una factura vía botón "Agregar Factura" -> Abre `BillModal`.
2. La factura aparece en `BillsWidget` y `UpcomingObligationsWidget`.
3. Usuario hace clic en "Pagar" en `BillsWidget`.
4. Se abre `QuickTransactionModal` (Modo Gasto) con el monto y descripción de la factura.
5. Usuario selecciona la cuenta y confirma.
6. Backend actualiza la transacción a `status='completed'`, asigna la cuenta y actualiza el saldo.
