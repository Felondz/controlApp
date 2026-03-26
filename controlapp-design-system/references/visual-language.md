# Visual Language & UI Patterns

Standardized visual language for ControlApp to ensure consistency across all modules.

## Spacing & Layout
- **Containers**: Use `sm:rounded-lg` for card-like containers.
- **Padding**: Standard padding for widgets is `p-4` or `p-6`.
- **Gaps**: Use `gap-4` or `gap-6` for grid systems.
- **Borders**: Standard border is `border border-gray-200 dark:border-gray-700`.

## Interactive States (Hovers & Active)
- **Primary Buttons**: 
  - Hover: `hover:bg-primary-100 hover:text-primary-800` (Light), `dark:hover:bg-primary-900/30 dark:hover:text-primary-300` (Dark).
  - Active: `active:bg-primary-200` (Light), `dark:active:bg-primary-900/40` (Dark).
- **Secondary Buttons**:
  - Hover: `hover:bg-gray-50` (Light), `dark:hover:bg-gray-700` (Dark).
- **Cards/Items**:
  - Use `transition-all duration-200` for smooth transitions.
  - Hover: `hover:shadow-lg hover:-translate-y-1`.
  - Border Hover: `hover:border-primary-300 dark:hover:border-primary-800`.

## Iconography
- **Library**: Always import from `@/Components/Icons`.
- **Stroke**: Use `strokeWidth={2}` for standard icons, `1.5` for complex ones.
- **Color**: Use `stroke="currentColor"` to allow color propagation via Tailwind text classes.
- **Sizing**: 
  - Nav/Sidebar: `h-6 w-6`.
  - Buttons/Inline: `h-4 w-4` or `h-5 w-5`.
  - Status/Indicators: `h-3 w-3`.

## Scrollbars
- Use `.scrollbar-thin` utility.
- Colors: `scrollbar-thumb-primary-300` (Light), `dark:scrollbar-thumb-primary-700` (Dark).
- Track should remain `transparent`.
