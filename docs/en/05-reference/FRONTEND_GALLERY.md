# Frontend Component Gallery

> **Note**: For a detailed guide on the theming system (Global Themes, Project Themes, Dark Mode), please refer to the [Theming System Documentation](../02-development/THEMING_SYSTEM.md).

## Widgets

### SearchInput
- **Path**: `resources/js/Components/SearchInput.jsx`
- **Description**: A responsive search bar component integrated into the topbar.
- **Features**:
  - Real-time or submission-based search.
  - Theme-aware (Dark/Light mode).
  - Customizable width and padding via props (`inputClasses`).
- **Usage**:
  ```jsx
  <SearchInput className="w-full" inputClasses="py-0.5 text-xs" />
  ```

### ProjectCard
- **Path**: `resources/js/Components/Project/ProjectCard.jsx`
- **Description**: Displays a summary of a project on the dashboard.
- **Features**:
  - Shows project icon, name, and primary module.
  - **Security**: Displays a "Restricted Access" lock icon if the user is not an admin and the project has financial data.
  - **Quick Actions**: "Add Expense" button (only for admins).

### FinanceWidget
- **Path**: `resources/js/Components/Project/FinanceWidget.jsx`
- **Description**: A mini-dashboard for financial data within a project card.
- **Features**:
  - Shows total balance.
  - Visual indicator of financial health.
  - **Restricted**: Only rendered for admins.

## Form Components

### SecondaryLink
- **Path**: `resources/js/Components/SecondaryLink.jsx`
- **Description**: A link component (Inertia `Link`) with the same visual style as a `SecondaryButton`. Ideal for secondary navigation actions (e.g., "Cancel") alongside primary buttons.
- **Usage**:
  ```jsx
  <SecondaryLink href={route('home')}>
      Cancel
  </SecondaryLink>
  ```

### ImageUploader
- **Path**: `resources/js/Components/ImageUploader.jsx`
- **Description**: Reusable component for uploading and previewing images, supporting different shapes and validations.
- **Features**:
  - **Shapes**: Square (`square`) or Circle (`circle`).
  - **Sizes**: Predefined (`sm`, `md`, `lg`).
  - **Validation**: Configurable size limit and visual error feedback.
  - **Interaction**: Click to change, optional delete button.
- **Usage**:
  ```jsx
  <ImageUploader
      value={data.image}
      onChange={(file) => setData('image', file)}
      shape="square"
      size="lg"
      maxSizeMB={4}
  />
  ```

## Icons (`resources/js/Components/Icons.jsx`)

### Language Icons
- **IconES**: Monochromatic "ES" badge for Spanish language selection.
- **IconEN**: Monochromatic "EN" badge for English language selection.
- **Style**: Outline style with `currentColor` fill for text, adapting to theme.

### UI Icons
- **SearchIcon**: Magnifying glass for search inputs.
- **DashboardIcon**: Grid icon for the dashboard link.
- **MenuFoldIcon / MenuUnfoldIcon**: For sidebar toggling.
- **UserCircleIcon**: Fallback profile avatar.
- **EmptyStateIcon**: Used when no data is available (e.g., no projects found).

## Layout Components

### AuthenticatedLayout
- **Path**: `resources/js/Layouts/AuthenticatedLayout.jsx`
- **Updates**:
  - **Topbar**: Reduced height to `h-12`.
  - **Profile Dropdown**: Cleaned up, "Edit Profile" link.
  - **Search**: Integrated `SearchInput`.
  - **Logo**: Redirects to Dashboard.

### Sidebar
- **Path**: `resources/js/Components/Sidebar.jsx`
- **Updates**:
  - **Logo**: Redirects to Dashboard.
  - **Height**: Adjusted logo section to `h-12` to match topbar.
