# Frontend Component Gallery

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
