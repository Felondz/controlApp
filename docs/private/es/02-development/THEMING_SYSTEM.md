# Sistema de Temas Frontend

> **Última Actualización**: Noviembre 2025

La aplicación implementa un sistema de temas robusto y dinámico que soporta temas globales, anulaciones específicas por proyecto y modo oscuro. Este sistema está construido usando React Context, Variables CSS de Tailwind y un archivo centralizado de definiciones de temas.

## 🎨 Arquitectura

El sistema de temas consta de tres capas principales:

1.  **Variables CSS (`app.css`)**: Define los valores de color reales (tripletes RGB) para cada tema usando selectores `[data-theme="..."]`.
2.  **Definiciones de Tema (`themeStyles.js`)**: Una fuente de verdad en JavaScript que refleja las variables CSS para su uso en estilos en línea (temas con alcance/scoped).
3.  **Contexto de Tema Global**: Gestiona el estado del tema activo, la persistencia y la sincronización con el DOM.

### Estructura de Directorios

```
resources/
├── css/
│   └── app.css                   # Definiciones de Variables CSS para todos los temas
├── js/
│   ├── Contexts/
│   │   └── GlobalThemeContext.jsx    # Proveedor de Contexto y Hook
│   ├── Utils/
│   │   └── themeStyles.js            # Definiciones de tema en JS y helpers
│   └── Components/
│       └── Icons.jsx                 # Sistema de Iconos Estandarizado
```

## 🌍 Temas Globales

Los temas globales son la preferencia predeterminada del usuario. Se persisten en la base de datos (`users.global_theme`) y se aplican a toda la aplicación a menos que se anulen.

### Temas Disponibles

- **Purple Modern** (`purple-modern`): Púrpura vibrante por defecto.
- **Ocean Blue** (`blue-ocean`): Tonos azules relajantes.
- **Forest Green** (`forest-green`): Tonos esmeralda naturales.
- **Scarlet Red** (`scarlet-red`): Acentos rojos audaces.
- **Amber Gold** (`amber-gold`): Tonos ámbar cálidos.
- **Pink Rose** (`pink-rose`): Variaciones suaves de rosa.

> **Nota**: Los IDs de temas antiguos (ej. `emerald-nature`, `amber-warm`) son soportados vía alias tanto en `app.css` como en `themeStyles.js`.

## 🏗️ Temas de Proyecto (Scoped Theming)

Los proyectos pueden forzar un tema específico, anulando la preferencia global del usuario mientras se visualiza ese proyecto. Esto se logra a través de **Temas con Alcance (Scoped Theming)**.

### Implementación

1.  **Alcance de Variable CSS**: El `AuthenticatedLayout` o contenedores específicos (como `ProjectCard`) aplican un atributo `style` o `data-theme`.
2.  **Función Helper**: `getThemeStyle(themeId)` de `themeStyles.js` retorna el objeto `style` de React que contiene las variables CSS para ese tema.

```jsx
// Ejemplo: Aplicación de Tema con Alcance
import { getThemeStyle } from '@/Utils/themeStyles';

<div style={getThemeStyle(project.theme)}>
    <h1 className="text-primary-600">¡Estoy coloreado por el tema del proyecto!</h1>
</div>
```

## 🛠️ Agregando un Nuevo Tema

Para agregar un nuevo tema, debes actualizar tres ubicaciones para asegurar compatibilidad total:

1.  **`resources/css/app.css`**: Agrega las variables CSS bajo un nuevo selector `[data-theme="new-theme-id"]`.
    ```css
    [data-theme="new-theme-id"] {
        --color-primary-50: 255 255 255;
        /* ... definir de 50 a 950 */
    }
    ```

2.  **`resources/js/Utils/themeStyles.js`**: Agrega la misma definición a la constante `THEME_STYLES`.
    ```javascript
    'new-theme-id': {
        '--color-primary-50': '255 255 255',
        // ...
    },
    ```

3.  **`resources/js/Pages/Projects/CreateProject.jsx`**: Agrega el tema a la lista de selección para que los usuarios puedan elegirlo.

## 🌙 Modo Oscuro

El modo oscuro es soportado nativamente vía la clase `dark` de Tailwind. El `GlobalThemeContext` gestiona el estado `isDark`, sincronizándolo con:
1.  `localStorage` (persistencia)
2.  Preferencias del sistema (fallback)
3.  Atributo HTML `class="dark"`

## 🧩 Estandarización de Iconos

Todos los iconos están estandarizados en `resources/js/Components/Icons.jsx`.

- **Implementación**: Componentes funcionales que retornan SVGs.
- **Estilos**: Usan `currentColor` (ej. `text-primary-500`) para adaptarse automáticamente al tema activo.
