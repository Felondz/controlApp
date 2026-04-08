# Themes & Color Propagation

ControlApp uses a dynamic theme system based on CSS variables and Tailwind colors.

## The Primary Color
The `primary` color in Tailwind is mapped to RGB CSS variables:
`primary-500: rgb(var(--color-primary-500) / <alpha-value>)`

## Standard Themes
Available themes (defined in `resources/css/app.css` and `themeStyles.js`):
- `purple-modern` (Default)
- `ocean-blue` / `blue-ocean` / `cyan-tech`
- `forest-green` / `emerald-nature`
- `scarlet-red`
- `amber-gold` / `amber-warm`
- `pink-rose` / `rose-romantic`
- `ptr-orange` (For Test environments)

## How to Apply Themes
1. **Container Attribute**: Apply `data-theme="theme-id"` to the parent container.
2. **Inline Styling**: For components like Project Cards that have project-specific themes, use the `getThemeStyle(themeId)` utility from `@/Utils/themeStyles`.
   ```jsx
   import { getThemeStyle } from '@/Utils/themeStyles';
   // ...
   <div style={getThemeStyle(proyecto.theme)}>
   ```

## Dark Mode
- Triggered by the `.dark` class on the `html` element.
- Use `dark:` variants in Tailwind classes.
- **Surface Colors**: `bg-white` -> `dark:bg-gray-800` (Cards) or `dark:bg-gray-900` (Layout).
- **Text Colors**: `text-gray-900` -> `dark:text-white`, `text-gray-500` -> `dark:text-gray-400`.

## Functional Colors
- **Secondary**: `colors.gray`
- **Danger**: `colors.red` (Use for destructive actions)
- **Success**: `colors.green` (Use for positive outcomes/indicators)
- **Warning**: `colors.amber` (Use for pending/alert states)
- **Info**: `colors.blue`
