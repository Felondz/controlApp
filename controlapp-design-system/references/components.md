# Component Specifications

Guidelines for implementing and using core UI components.

## Buttons
Always use the specialized button components from `@/Components`.

### PrimaryButton
- **Purpose**: Main action on a view or form.
- **Style**: Subtle background (`bg-primary-50`) with strong text (`text-primary-700`).
- **Dark Mode**: `dark:bg-primary-900/20 dark:text-primary-400`.

### SecondaryButton
- **Purpose**: Alternative actions, cancellations.
- **Style**: White background with gray border.

### DangerButton
- **Purpose**: Destructive actions (Delete, Remove).
- **Style**: Red background/text.

## Dropdowns
Built using `@headlessui/react`.

- **Structure**:
  ```jsx
  <Dropdown>
      <Dropdown.Trigger> <Button /> </Dropdown.Trigger>
      <Dropdown.Content align="right" width="48">
          <Dropdown.Link href={route(...)}>Label</Dropdown.Link>
      </Dropdown.Content>
  </Dropdown>
  ```
- **Max Height**: For list-heavy dropdowns (like Inbox), use `max-h-80 overflow-y-auto scrollbar-thin`.
- **Links**: Use `Dropdown.Link` to ensure proper hover states and theme-aware styling.

## Modals
Built using `@headlessui/react` Dialog.

- **Overlay**: `bg-secondary-500/75 dark:bg-secondary-900/75`.
- **Panel**: `bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100`.
- **Widths**: `sm`, `md`, `lg`, `xl`, `2xl`. Default is `2xl`.
- **Animation**: Smooth ease-out entering, ease-in leaving.

## Form Inputs
- **Style**: `rounded-md shadow-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500`.
- **Dark Mode**: `dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300`.
- **Labels**: Always use `InputLabel`.
- **Errors**: Always use `InputError` below the input field.

## Widget Cards
- **Base classes**: `bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg`.
- **Interactive**: Add `transition-all duration-200 hover:shadow-lg`.
- **Themes**: Wrap content in a div with `getThemeStyle` if it needs to reflect a specific project's theme.
