# Galería de Componentes Frontend

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
