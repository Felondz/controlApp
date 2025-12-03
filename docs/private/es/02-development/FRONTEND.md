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

## Testing

El código frontend está completamente cubierto por pruebas automatizadas utilizando **Vitest** y **React Testing Library**.

- **Cobertura**: 100% de Cobertura de Componentes (215 tests).
- **Ubicación**: `tests/Frontend/Components`.
- **Comando**: `npm run test`.

Para detalles sobre la arquitectura de pruebas y guías, consulta [TESTING_ARCHITECTURE.md](../04-testing/TESTING_ARCHITECTURE.md).
