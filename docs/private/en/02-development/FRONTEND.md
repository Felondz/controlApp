# Frontend Documentation

## Reusable Components

### Alert
Component for displaying status messages (info, warning, success, error) with standardized styles.

**Usage:**
```jsx
import Alert from '@/Components/Alert';

<Alert type="info" title="Note">
    This is an informational message.
</Alert>
```

**Props:**
- `type`: 'info' (blue), 'warning' (amber), 'success' (green), 'error' (red). Default: 'info'.
- `title`: Optional bold title.
- `children`: Message content.
- `className`: Additional CSS classes.

**Location:** `resources/js/Components/Alert.jsx`

## Icons
A hybrid strategy of reusable SVG icons and Heroicons is used.
- **Location:** `resources/js/Components/Icons.jsx`
- **New Icons:** `InfoIcon`, `BookOpenIcon`, `CodeIcon`.

## Theme and Colors
The system uses Tailwind CSS with CSS variables for dynamic theme support.
- **Primary**: Defined by the selected theme (purple, blue, green, etc.).
- **Secondary**: `colors.gray` to maintain an elegant and neutral dark mode.
- **Info**: `colors.blue` for informational and technical elements (e.g., developer card).

## UI Components

### QuantityInput
Component for numeric input with increment/decrement buttons, using theme colors.

**Usage:**
```jsx
import QuantityInput from '@/Components/UI/QuantityInput';

<QuantityInput
    value={term}
    onChange={setTerm}
    min={1}
    max={360}
    label="Term"
/>
```

**Props:**
- `value`: Current numeric value.
- `onChange`: Function to handle value changes.
- `min`: Minimum allowed value (default: 0).
- `max`: Maximum allowed value (default: Infinity).
- `step`: Increment/decrement step (default: 1).
- `label`: Optional label text.
- `className`: Additional CSS classes.

**Styling**: Uses `text-primary-600 dark:text-primary-400` for buttons to match the active theme.

**Location:** `resources/js/Components/UI/QuantityInput.jsx`

### InputGroup
Component for labeled text/number inputs with optional suffix and tooltip.

**Usage:**
```jsx
import InputGroup from '@/Components/UI/InputGroup';

<InputGroup
    label="Interest Rate"
    tooltip="Annual Effective Rate"
    type="number"
    value={rate}
    onChange={(e) => setRate(Number(e.target.value))}
    suffix="%"
/>
```

**Props:**
- `label`: Label text.
- `value`: Input value.
- `onChange`: Change handler function.
- `type`: Input type (default: 'text').
- `placeholder`: Placeholder text.
- `suffix`: Optional suffix text (e.g., '%', 'USD').
- `tooltip`: Optional tooltip text.
- `className`: Additional CSS classes.

**Styling**: Suffix uses `text-primary-600 dark:text-primary-400` with bold font weight.

**Location:** `resources/js/Components/UI/InputGroup.jsx`

---

## Responsive Design

### Breakpoint Strategy

The application uses a mobile-first responsive design approach with the following breakpoints:

- **Mobile**: `< 768px` - Bottom navigation, single column layouts, reduced spacing
- **Tablet**: `768px - 1024px` - Sidebar (collapsible), 2-column grids
- **Desktop**: `> 1024px` - Sidebar (expanded), multi-column grids, full spacing

### Tailwind Breakpoints

Consistent use of Tailwind CSS breakpoints across all views:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Navigation Components

#### Sidebar (Desktop & Tablet)
- **Visibility**: Hidden on mobile (`hidden md:flex`), visible on tablet and desktop
- **Location**: `resources/js/Components/Sidebar.jsx`
- **Features**:
  - Collapsible on desktop
  - Theme-aware with CSS variables
  - Project-aware navigation
  - Shows global tools when enabled

#### BottomNavigation (Mobile)
- **Visibility**: Visible on mobile (`md:hidden`), hidden on tablet and desktop
- **Location**: `resources/js/Components/BottomNavigation.jsx`
- **Features**:
  - Fixed at bottom of screen (`fixed bottom-0`)
  - Context-aware navigation (global vs project)
  - Dynamic grid layout (3-4 columns based on items)
  - Theme-aware using CSS variables

**Usage:**
```jsx
import BottomNavigation from '@/Components/BottomNavigation';

<BottomNavigation user={user} project={project} />
```

**Props:**
- `user`: Authenticated user object (required)
- `project`: Current project object (optional, for project-aware navigation)

**Navigation Items:**
- **Global Context**: Dashboard, Marketplace, Tools
- **Project Context**: Dashboard, Current Project, Finance (if enabled)

**Styling:**
- Active state: `text-primary-600 dark:text-primary-400`
- Inactive state: `text-gray-500 dark:text-gray-400`
- Hover: `hover:text-primary-600 dark:hover:text-primary-400`

### Layout Considerations

#### Main Content Padding
The `AuthenticatedLayout` adds bottom padding to prevent content overlap with bottom navigation:
```jsx
<div className="py-6 pb-20 md:pb-6">
```
- `pb-20` (80px) on mobile to clear bottom navigation
- `md:pb-6` (24px) on tablet and desktop

#### Floating Action Buttons (FAB)
FABs should be positioned above the bottom navigation on mobile:
```jsx
className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40"
```
- `bottom-20` on mobile (above bottom nav)
- `md:bottom-8` on desktop (normal position)
- `z-40` (bottom nav is `z-50`)

### Responsive Patterns

#### Grid Layouts
```jsx
// Dashboard projects grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">

// Project summary cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Theme selector
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```

#### Spacing
```jsx
// Padding: smaller on mobile, larger on desktop
<div className="p-4 sm:p-6">

// Gap: tighter on mobile, wider on desktop
<div className="gap-4 md:gap-6">

// Margin: reduced on mobile
<div className="pt-4 sm:pt-8 pb-4 sm:pb-6">
```

#### Typography
```jsx
// Headings: smaller on mobile
<h1 className="text-xl sm:text-2xl">

// Body text: smaller on mobile
<p className="text-xs sm:text-sm">
```

#### Flex Direction
```jsx
// Stack vertically on mobile, horizontal on desktop
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### Testing Responsive Design

Use browser DevTools device emulation to test:
1. **Mobile**: iPhone 12 Pro (390x844)
2. **Tablet**: iPad (768x1024)
3. **Desktop**: 1920x1080

**Checklist:**
- [ ] Bottom navigation visible and functional on mobile
- [ ] Sidebar visible and functional on tablet/desktop
- [ ] No horizontal scrolling on any breakpoint
- [ ] All interactive elements accessible
- [ ] Forms usable on mobile
- [ ] Charts responsive
- [ ] Images scale properly

