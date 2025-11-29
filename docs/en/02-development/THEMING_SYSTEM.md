# Frontend Theming System

> **Last Updated**: November 2025

The application implements a robust and dynamic theming system that supports global themes, project-specific overrides, and dark mode. This system is built using React Context, Tailwind CSS Variables, and a centralized theme definition file.

## 🎨 Architecture

The theming system consists of three main layers:

1.  **CSS Variables (`app.css`)**: Defines the actual color values (RGB triplets) for each theme using `[data-theme="..."]` selectors.
2.  **Theme Definitions (`themeStyles.js`)**: A JavaScript source of truth that mirrors the CSS variables for use in inline styles (scoped theming).
3.  **Global Theme Context**: Manages the active theme state, persistence, and synchronization with the DOM.

### Directory Structure

```
resources/
├── css/
│   └── app.css                   # CSS Variable definitions for all themes
├── js/
│   ├── Contexts/
│   │   └── GlobalThemeContext.jsx    # Context Provider & Hook
│   ├── Utils/
│   │   └── themeStyles.js            # JS Theme definitions & helpers
│   └── Components/
│       └── Icons.jsx                 # Standardized Icon System
```

## 🌍 Global Themes

Global themes are the user's default preference. They are persisted in the database (`users.global_theme`) and apply to the entire application unless overridden.

### Available Themes

- **Purple Modern** (`purple-modern`): Default vibrant purple.
- **Ocean Blue** (`blue-ocean`): Calming blue tones.
- **Forest Green** (`forest-green`): Natural emerald shades.
- **Scarlet Red** (`scarlet-red`): Bold red accents.
- **Amber Gold** (`amber-gold`): Warm amber tones.
- **Pink Rose** (`pink-rose`): Soft pink variations.

> **Note**: Legacy theme IDs (e.g., `emerald-nature`, `amber-warm`) are supported via aliases in both `app.css` and `themeStyles.js`.

## 🏗️ Project Themes (Scoped Theming)

Projects can enforce a specific theme, overriding the user's global preference while viewing that project. This is achieved through **Scoped Theming**.

### Implementation

1.  **CSS Variable Scope**: The `AuthenticatedLayout` or specific containers (like `ProjectCard`) apply a `style` attribute or `data-theme` attribute.
2.  **Helper Function**: `getThemeStyle(themeId)` from `themeStyles.js` returns the React `style` object containing the CSS variables for that theme.

```jsx
// Example: Scoped Theme Application
import { getThemeStyle } from '@/Utils/themeStyles';

<div style={getThemeStyle(project.theme)}>
    <h1 className="text-primary-600">I am colored by the project theme!</h1>
</div>
```

## 🛠️ Adding a New Theme

To add a new theme, you must update three locations to ensure full compatibility:

1.  **`resources/css/app.css`**: Add the CSS variables under a new `[data-theme="new-theme-id"]` selector.
    ```css
    [data-theme="new-theme-id"] {
        --color-primary-50: 255 255 255;
        /* ... define 50 to 950 */
    }
    ```

2.  **`resources/js/Utils/themeStyles.js`**: Add the same definition to the `THEME_STYLES` constant.
    ```javascript
    'new-theme-id': {
        '--color-primary-50': '255 255 255',
        // ...
    },
    ```

3.  **`resources/js/Pages/Projects/CreateProject.jsx`**: Add the theme to the selection list so users can choose it.

## 🌙 Dark Mode

Dark mode is supported natively via Tailwind's `dark` class. The `GlobalThemeContext` manages the `isDark` state, syncing it with:
1.  `localStorage` (persistence)
2.  System preferences (fallback)
3.  HTML `class="dark"` attribute

## 🧩 Icon Standardization

All icons are standardized in `resources/js/Components/Icons.jsx`.

- **Implementation**: Functional components returning SVGs.
- **Styling**: Use `currentColor` (e.g., `text-primary-500`) to automatically adapt to the active theme.
