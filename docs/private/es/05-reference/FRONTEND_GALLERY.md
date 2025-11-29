# Galería de Componentes Frontend

> **Nota**: Para una guía detallada sobre el sistema de temas (Temas Globales, Temas por Proyecto, Modo Oscuro), por favor consulta la [Documentación del Sistema de Temas](../02-development/THEMING_SYSTEM.md).

## Widgets

### SearchInput
- **Ruta**: `resources/js/Components/SearchInput.jsx`
- **Descripción**: Un componente de barra de búsqueda responsivo integrado en la barra superior.
- **Características**:
  - Búsqueda en tiempo real o por envío.
  - Adaptable al tema (Modo Oscuro/Claro).
  - Ancho y relleno personalizables vía props (`inputClasses`).
- **Uso**:
  ```jsx
  <SearchInput className="w-full" inputClasses="py-0.5 text-xs" />
  ```

### ProjectCard
- **Ruta**: `resources/js/Components/Project/ProjectCard.jsx`
- **Descripción**: Muestra un resumen de un proyecto en el dashboard.
- **Características**:
  - Muestra icono del proyecto, nombre y módulo principal.
  - **Seguridad**: Muestra un icono de candado "Acceso Restringido" si el usuario no es admin y el proyecto tiene datos financieros.
  - **Acciones Rápidas**: Botón "Agregar Gasto" (solo para admins).

### FinanceWidget
- **Ruta**: `resources/js/Components/Project/FinanceWidget.jsx`
- **Descripción**: Un mini-dashboard para datos financieros dentro de una tarjeta de proyecto.
- **Características**:
  - Muestra el balance total.
  - Indicador visual de salud financiera.
  - **Restringido**: Solo se renderiza para admins.

## Componentes de Formulario

### SecondaryLink
- **Ruta**: `resources/js/Components/SecondaryLink.jsx`
- **Descripción**: Un componente de enlace (`Link` de Inertia) con el mismo estilo visual que un `SecondaryButton`. Ideal para acciones de navegación secundarias (ej. "Cancelar") junto a botones primarios.
- **Uso**:
  ```jsx
  <SecondaryLink href={route('home')}>
      Cancelar
  </SecondaryLink>
  ```

### ImageUploader
- **Ruta**: `resources/js/Components/ImageUploader.jsx`
- **Descripción**: Componente reutilizable para cargar y previsualizar imágenes, con soporte para diferentes formas y validaciones.
- **Características**:
  - **Formas**: Cuadrada (`square`) o Circular (`circle`).
  - **Tamaños**: Predefinidos (`sm`, `md`, `lg`).
  - **Validación**: Límite de tamaño configurable y feedback visual de errores.
  - **Interacción**: Click para cambiar, botón opcional para eliminar.
- **Uso**:
  ```jsx
  <ImageUploader
      value={data.image}
      onChange={(file) => setData('image', file)}
      shape="square"
      size="lg"
      maxSizeMB={4}
  />
  ```

## Iconos (`resources/js/Components/Icons.jsx`)

### Iconos de Idioma
- **IconES**: Insignia monocromática "ES" para la selección de idioma español.
- **IconEN**: Insignia monocromática "EN" para la selección de idioma inglés.
- **Estilo**: Estilo de contorno con relleno `currentColor` para el texto, adaptándose al tema.

### Iconos de UI
- **SearchIcon**: Lupa para inputs de búsqueda.
- **DashboardIcon**: Icono de cuadrícula para el enlace del dashboard.
- **MenuFoldIcon / MenuUnfoldIcon**: Para alternar la barra lateral.
- **UserCircleIcon**: Avatar de perfil por defecto.
- **EmptyStateIcon**: Usado cuando no hay datos disponibles (ej. no se encontraron proyectos).

## Componentes de Layout

### AuthenticatedLayout
- **Ruta**: `resources/js/Layouts/AuthenticatedLayout.jsx`
- **Actualizaciones**:
  - **Barra Superior**: Altura reducida a `h-12`.
  - **Menú de Perfil**: Limpiado, enlace "Editar Perfil".
  - **Búsqueda**: Integrado `SearchInput`.
  - **Logo**: Redirige al Dashboard.

### Sidebar
- **Ruta**: `resources/js/Components/Sidebar.jsx`
- **Actualizaciones**:
  - **Logo**: Redirige al Dashboard.
  - **Altura**: Sección del logo ajustada a `h-12` para coincidir con la barra superior.
