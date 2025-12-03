# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-12-03

### Added - Testing & QA (Phase 7)

**Verification:**
- ✅ **Full Regression Testing:** 280 backend tests passing.
- ✅ **New Module Tests:** Added comprehensive tests for Analytics, Notifications, Marketplace, and Tasks modules.
- ✅ **Bug Fixes:** Resolved regression issues in NotificationService and ProjectAccount routes.

### Added - Module Marketplace (Phase 6)

**Features:**
- ✨ **Marketplace API:** Endpoints to list and manage modules per project.
- 🔌 **Module Toggling:** Enable/Disable modules dynamically.
- 🔗 **Dependency Resolution:** Automatic check for module dependencies.
- 🛡️ **Safety Checks:** Prevents disabling modules that others depend on.

**API Endpoints:**
- `GET /api/proyectos/{proyecto}/marketplace` - List available modules
- `POST /api/proyectos/{proyecto}/marketplace/{module}` - Toggle module status

---

## [2.2.0] - 2025-12-03

### Added - Notification System (Phase 5)

**Module Structure:**
- ✨ `NotificationsModule` - Multi-channel notification system
- ✨ `NotificationPreference` model for user preferences
- ✨ `NotificationService` for centralized notification logic
- ✨ `NotificationController` with API endpoints

**Notification Classes:**
- 📬 `TransactionCreatedNotification` - New transaction alerts
- 📬 `TaskAssignedNotification` - Task assignment alerts
- 📬 `MessageReceivedNotification` - Private message alerts

**Event Listeners:**
- 👂 Listens to Finance events (transaction.created, balance.low)
- 👂 Listens to Tasks events (task.created, task.completed)
- 👂 Listens to Chat events (message.sent)

**Features:**
- 📱 In-app notifications (database channel)
- 📧 Email notifications (mail channel)
- ⚙️ User-configurable preferences per event/channel
- 🔔 Real-time notification delivery
- 📊 Notification history and read status

**API Endpoints:**
- GET /api/notifications
- POST /api/notifications/{id}/read
- POST /api/notifications/read-all
- GET /api/notifications/preferences
- POST /api/notifications/preferences

**Database:**
- New table: `notifications` (Laravel built-in)
- New table: `notification_preferences`

---

## [2.1.0] - 2025-12-03

### Added - Analytics Module (Phase 4)

**Module Structure:**
- ✨ `AnalyticsModule` - Passive analytics module
- ✨ `AnalyticsMetric` model for storing aggregated metrics
- ✨ `MetricsCollector` service for processing events
- ✨ `ProcessAnalyticsEvent` job for async processing

**Event Listeners:**
- 👂 Listens to all Finance events (`finance.*`)
- 👂 Listens to all Tasks events (`tasks.*`)
- 👂 Listens to all Chat events (`chat.*`)

**Metrics Collected:**
- 📊 Finance: transactions/day, income/day, expense/day
- 📊 Tasks: created/day, completed/day, financial tasks/day
- 📊 Chat: messages/day, private/day, public/day

**Features:**
- ⚡ Async processing via queue jobs (no performance impact)
- 💾 Aggregated metrics (not raw events)
- 📈 Configurable retention (365 days default)
- 🔍 Wildcard event subscriptions

**Database:**
- New table: `analytics_metrics`

---

## [2.0.0] - 2025-12-03

### 🎉 Major Release - Modular Architecture

This release introduces a complete architectural transformation, moving from a monolithic structure to a fully modular, event-driven system.

#### Added - Core Infrastructure (Phase 0)

**Module System:**
- ✨ `ModuleInterface` - Contract for all modules
- ✨ `AbstractModule` - Base implementation with lifecycle hooks
- ✨ `ModuleRegistry` - Auto-discovery, dependency resolution, and caching
- ✨ `ModuleEventBus` - Pub/sub event system with wildcard support
- ✨ `BaseModuleEvent` - Abstract base for module events
- ✨ `ModuleServiceProvider` - Bootstrap and lifecycle management
- ✨ `config/modules.php` - Module registry and configuration

**Template System:**
- ✨ `ProjectTemplate` interface for pre-configured setups
- ✨ `FreelancerTemplate` - Example template with Finance + Tasks modules

**Documentation:**
- 📚 `MODULES_ARCHITECTURE.md` - Complete architecture overview
- 📚 `MODULE_DEVELOPMENT_GUIDE.md` - Developer guide for creating modules
- 📚 `MODULE_EVENTS_REFERENCE.md` - Event catalog and cross-module communication

#### Added - Finance Module (Phase 1)

**Module Structure:**
- ✨ `FinanceModule` - Main module class with auto-installation
- ✨ Default categories creation (8 categories)
- ✨ Default account creation with configurable balance

**Events:**
- 🔔 `finance.transaction.created` - Dispatched on transaction creation
- 🔔 `finance.transaction.updated` - Dispatched on transaction update
- 🔔 `finance.transaction.deleted` - Dispatched on transaction deletion
- 🔔 `finance.account.balance_low` - Alert for low account balance

**Event Listeners:**
- 👂 `TaskEventListener` - Listens to task completion events

**Controllers:**
- 🔄 Migrated `TransaccionController` to `app/Modules/Finance/Controllers/`
- ➕ Added event dispatching to all CRUD operations

#### Added - Tasks Module (Phase 2)

**Module Structure:**
- ✨ `TasksModule` - Main module class
- ✨ Financial task integration

**Events:**
- 🔔 `tasks.task.created` - Dispatched on task creation
- 🔔 `tasks.task.completed` - Dispatched when task marked as done
- 🔔 `tasks.financial_task.created` - Dispatched for financial tasks

**Event Listeners:**
- 👂 `FinanceEventListener` - Listens to transaction creation events

**Controllers:**
- 🔄 Migrated `TaskController` to `app/Modules/Tasks/Controllers/`
- ➕ Added event dispatching for task lifecycle

#### Changed

**Architecture:**
- 🏗️ Modules communicate exclusively via events (no direct coupling)
- 🏗️ Event-driven architecture enables loose coupling
- 🏗️ Module auto-discovery from filesystem and configuration
- 🏗️ Dependency resolution with circular detection

**Backward Compatibility:**
- ✅ All existing API endpoints unchanged
- ✅ Database schema unchanged
- ✅ Frontend functionality preserved
- ✅ Old controllers remain functional during transition

#### Technical Details

**Event Bus Features:**
- Wildcard subscriptions (`tasks.*`, `finance.transaction.*`)
- Async execution support (configurable)
- Event logging for debugging (`MODULE_EVENT_LOG=true`)
- Error handling with graceful degradation

**Module Capabilities:**
- **Finance Module:**
  - Provides: transactions, accounts, categories, budgets, reports
  - Consumes: tasks.financial_tasks
  - Exposes: 3 API endpoints, 4 events, 5 widgets
  
- **Tasks Module:**
  - Provides: task_management, kanban_board, financial_tasks
  - Consumes: finance.transactions
  - Exposes: 1 API endpoint, 3 events, 2 widgets

**Performance:**
- Module caching in production
- Lazy loading of modules
- Optimized event dispatching

#### Migration Notes

**For Developers:**
1. Review `MODULES_ARCHITECTURE.md` for architecture overview
2. See `MODULE_DEVELOPMENT_GUIDE.md` for creating new modules
3. Check `MODULE_EVENTS_REFERENCE.md` for event catalog
4. Old code in `app/Features/` remains for reference

**For Deployment:**
- Run `composer dump-autoload` after pulling
- No database migrations required
- No breaking changes to API
- Optional: Set `MODULE_EVENT_LOG=true` for debugging

#### Future Roadmap

- Phase 3: Chat Module migration
- Phase 4: Analytics Module
- Phase 5: Notification System
- Phase 6: Module Marketplace

---

## [1.7.1] - 2025-12-03

### Added
- **Tasks-Finance Integration (Phase 2)**:
  - **Payment Confirmation Modal**: New `PaymentConfirmationModal` component for marking financial tasks as paid.
    - Pre-fills transaction form with task data (title, amount, category).
    - Allows editing before confirmation.
    - Automatically marks task as "done" upon payment confirmation.
  - **Upcoming Obligations Widget Enhancement**: Updated to display both financial tasks and transaction events.
    - Visual distinction with "Tarea" badge for task-based obligations.
    - "Mark as Paid" button (checkmark icon) appears on hover for admin users.
    - Unified list sorted by due date.
  - **Finance Dashboard Integration**: Financial tasks now appear in the Finance dashboard's Upcoming Obligations widget.
  - **Backend Task Completion**: `TransaccionController` now automatically marks tasks as "done" when creating linked transactions.

### Changed
- **ProyectoUiWebController**: Updated `finance()` method to load and pass financial tasks to the dashboard.
- **StoreTransaccionRequest**: Added optional `task_id` validation rule for linking transactions to financial tasks.
- **UpcomingObligationsWidget**: Now accepts `financialTasks` and `onMarkAsPaid` props for enhanced functionality.
- **ProjectDashboard**: Integrated `PaymentConfirmationModal` with proper state management and data refresh.

### Technical Details
- Added `task_id` field to transaction creation flow for automatic task completion.
- Implemented event-driven data refresh using Inertia's partial reload.
- Maintained backward compatibility with existing transaction creation flow.

---

## [1.7.0] - 2025-12-03

### Added
- **Tasks Module (MVP)**:
  - **Kanban Board**: Drag-and-drop interface for managing tasks (Todo, In Progress, Done).
  - **Task Management**: Create, edit, assign, and prioritize tasks.
  - **Integration**: Optional module per project, accessible via Sidebar.
  - **Tech**: Built with `@hello-pangea/dnd` for React 18+ compatibility.
- **Finance Module Enhancements**:
  - **Financial Charts Widget**: Interactive bar chart showing Cash Flow (Income vs Expenses) for the last 6 months using `recharts`.
  - **Personal Finance Access**: Added direct link in Global Sidebar for quick access to personal financial dashboard.
  - **Dashboard Settings**: Toggle visibility of the new Charts widget.

### Fixed
- **Personal Finance**: Fixed `PersonalFinanceController` to correctly redirect to the project dashboard instead of rendering a legacy view.
- **Build System**: Fixed `npm run build` failure by replacing deprecated `react-beautiful-dnd` with `@hello-pangea/dnd`.

---

## [1.6.1] - 2025-12-02

### Fixed
- **Finance Module**:
  - **Consistency**: Unified `balance_inicial` to `saldo_inicial` across Factory, Model, and Migrations.
  - **API**: `DELETE /api/proyectos/{id}/cuentas/{id}` now returns `204 No Content` (standard REST).
  - **Filtering**: `GET /api/proyectos/{id}/cuentas` now supports filtering by `estado` (active/inactive) and `tipo`.
- **Frontend**:
  - **Dashboard**: Added filtering for active/inactive accounts and a toggle button in `ProjectDashboard.jsx`.
  - **Charts**: Added visual distinction (opacity/badge) for inactive accounts in `AccountChart.jsx`.
  - **Modals**: Added "Estado" dropdown in `AccountModal.jsx` to allow archiving/reactivating accounts.
  - **Cleanup**: Removed unused files `AccountsList.jsx`, `CreateAccount.jsx`, and `ProjectAccountUiWebController.php`.
- **Testing**:
  - Fixed `TransaccionesApiTest` SQL error by removing hardcoded `balance_inicial`.
  - Fixed `CuentasApiTest` failures related to filtering and status codes.
  - Added `AccountChart.test.jsx` to verify visual states of accounts.

## [1.6.0] - 2025-12-02

### Added
- **Chat System Overhaul**:
  - **Unread Counters**: Fixed global synchronization of unread message counters (Sidebar, Inbox, BottomBar).
  - **Online Status**: Implemented immediate "Offline" status upon logout by clearing cache.
  - **Infinite Loop Fix**: Resolved network request loop in ChatWidget using optimistic updates and robust dependency management.
  - **Mobile UI**: Improved mobile navigation with "Back to Chats" button and corrected icon orientation.
- **Security**:
  - **Auto-Logout**: Configured session lifetime to 20 minutes for enhanced security.
  - **Online Status**: Explicit cache clearing on `AuthenticatedSessionController::destroy`.
- **Financial Calculator**:
  - **UX**: Cleared default values and added placeholders for better user experience.
  - **Validation**: Added frontend validation to prevent API calls with empty inputs.
- **Testing**:
  - **Frontend Tests Refactoring**: Updated all frontend tests to use translation keys instead of hardcoded text, following the i18n system.
  - **Test Coverage**: Achieved 217 tests passing in 39 test files (100% component coverage).

### Changed
- **ChatWidget**: Refactored `markAsRead` logic to use optimistic updates and reload specific props (`auth`, `proyecto`).
- **User Model**: Updated `getUnreadMessagesCountAttribute` and `getUnreadProjectsAttribute` to use robust DB queries for `last_read_at`.
- **ProjectMessageUiWebController**: Synchronized backend unread count logic with frontend expectations.
- **Frontend Tests**: 
  - Updated `TasksWidget.test.jsx`, `ProjectCard.test.jsx`, `TypographySelector.test.jsx` to use translation keys.
  - Fixed `ChatWidget.test.jsx` with proper route mocking and removed fake timers (component detects test mode).
  - All tests now verify translation keys (`t('key')`) instead of hardcoded Spanish/English text.

### Fixed
- **Infinite Loop**: Fixed recursive `markAsRead` calls in ChatWidget.
- **Unread Sync**: Fixed issue where Inbox dropdown showed stale unread counts for project owners.
- **Online Status**: Fixed issue where users remained "Online" after logging out.
- **Frontend Tests**: Fixed all 11 failing tests after frontend refactoring:
  - Fixed translation key assertions in `TasksWidget`, `ProjectCard`, `TypographySelector`.
  - Fixed timeout issues in `ChatWidget` tests by properly mocking `route()` and removing fake timers.
  - All 217 frontend tests now pass successfully.

---

## [1.5.2] - 2025-12-01

### Added
- **Full Frontend Test Coverage**: Achieved 100% component coverage.
  - 215 tests across 38 test suites.
  - Added tests for all remaining components (Navigation, UI/UX, Widgets).
- **Test Organization**:
  - Reorganized frontend tests into `tests/Frontend/Components` to mirror source structure.
  - Updated import aliases to use `@/Components`.

### Fixed
- **Mocking Issues**: Resolved complex mocking scenarios for `@inertiajs/react` (`usePage`) and `ziggy-js` (`route().current()`).
- **Accessibility**: Improved accessibility in `SelectGroup` and `QuantityInput` to support better testing.
- **Architecture**: Restored `useGlobalTheme` in `RangeSlider` to adhere to architectural standards.
- **Navigation & UI**:
  - Implemented scalable **BottomNavigation** with "Smart Slot" (Chat > Finance) and "Menu" sheet.
  - Added `NavigationSheet` for unified access to all modules and tools on mobile.
  - Updated Mobile Header to show User Profile icon instead of generic hamburger menu.
  - Added **Inbox** and **Language Switcher** to mobile navigation menu.
  - Fixed "Overview" text color in Project Show page.
  - Removed text labels from BottomNavigation for a cleaner, modern look.
- **CI/CD**:
  - Fixed `Vite HMR server` error in CI environment by adding `LARAVEL_BYPASS_ENV_CHECK=1` to `test:ci` script.

## [1.5.1] - 2025-12-01

### Added
- **Frontend Testing Infrastructure**: Comprehensive test suite for React components
  - 96 tests across 16 test suites (~50% component coverage)
  - Vitest + Testing Library integration
  - Global mocks centralized in `test-setup.js`
  - CI/CD integration with GitHub Actions
- **Component Tests**: Comprehensive test suites for:
  - **UI Core**: Checkbox, TextInput, PasswordInput, InputLabel, InputError, PrimaryButton, SecondaryButton, DangerButton, Dropdown, Modal, Alert
  - **Features**: ImageUploader, Sidebar, ProjectCard, ChatWidget
  - **Architecture**: ComponentStandards quality tests
- **Test Utilities**: Automated test execution with `npm run test:ci`

### Fixed
- JSX syntax errors in test files (escaped characters)
- Missing mocks for Inertia's `useForm` and `route().current()`
- `scrollIntoView` undefined error in JSDOM environment
- Multiple selector issues in component tests
- Translation key assertions in tests

---

## [1.5.0] - 2025-12-01

### Added
- **Inbox System**:
  - **Dropdown**: New Inbox Dropdown in Topbar for quick access to unread messages across all projects.
  - **Page**: Dedicated Inbox page (`/inbox`) listing projects with unread messages.
  - **Notifications**: Real-time unread message counts in Topbar and Project Cards.
- **Dashboard Enhancements**:
  - **Project Cards**: Now display icons for active modules (Finance, Tasks, Chat).
  - **Badges**: Chat icon in project cards shows a pulsating red badge for unread messages.
- **API**:
  - `POST /api/proyectos/{id}/messages/read`: Endpoint to mark messages as read.
  - **Private Messaging**: Added support for private messaging in `Api/MessageController` (previously only in Web).
- **Translations**:
  - Added comprehensive translations for Inbox and Chat features in `es.json` and `en.json`.

### Changed
- **API Synchronization**:
  - Synchronized `Api/MessageController` with `ProjectMessageUiWebController`.
  - API now supports private messaging (filtering by `recipient_id`) and `markAsRead` functionality.
- **Chat UI**:
  - Updated `ChatWidget` to use `ChatIcon` instead of hardcoded emojis.
  - Applied theme-aware styles (`text-primary-600`) to Chat header and icons.
  - Improved placeholder and empty state text with translations.

---

## [1.4.1] - 2025-11-29

### Added
- **Authentication**: Added password visibility toggle (eye icon) to all password inputs.
- **Authentication**: Added "Resend Verification Email" functionality on login page for unverified users.
- **Security**: Public endpoint `/api/email/resend-verification` with rate limiting (3/min) and automatic invalidation of previous verification links.
- **UX**: Improved error handling for unverified email login attempts.
- **API**: Synchronized API login logic with Web login. Unverified users now receive a 403 error before token issuance.
- **UI**: Updated application favicon to use the app logo (SVG).
- **Feature**: Added optional Project Messaging Module (Team Chat).
    - Enabled via Project Settings -> Modules.
    - Real-time communication for project members.
    - Integrated into Project Dashboard.
- **Feature**: Enhanced Project Settings to configure active modules (Finance, Tasks, Chat).

### Fixed
- **Authentication**: Fixed 403 error when verifying email by removing signed URL requirement for verification link.
  - Overrode `verificationUrl()` in `VerificacionEmailNotification` to generate simple hash URLs
  - Removed signed URL signature parameter that was causing validation conflicts
  - Email verification now uses only `id` and `hash` parameters for validation
- **Authentication**: Fixed bug where "Email not verified" error was not appearing on Login page.
  - Refactored `LoginRequest` to check verification before `Auth::attempt` to preserve session flash data.
  - Updated `HandleInertiaRequests` to share `old` input, preventing email field clearing on redirect.

### Technical Details
- Modified `app/Notifications/VerificacionEmailNotification.php` to override `verificationUrl()` method
- URLs now generated as `/api/email/verify/{id}/{hash}` without signature parameter
- Maintains SHA1 hash validation in `EmailVerificationController` for security
- Eliminates dependency on `APP_URL` configuration for email verification

---

## [1.4.0] - 2025-11-29

### Added
- **Mobile & Tablet Responsive Design**:
  - Comprehensive responsive design implementation across all major views
  - Bottom navigation bar for mobile devices (< 768px)
  - Project-aware navigation showing context-specific items
  - Proper breakpoint handling (mobile < 768px, tablet 768-1024px, desktop > 1024px)
  - Hamburger menu for Welcome page on mobile devices
- **Icons**:
  - `MenuIcon` - Hamburger menu icon for mobile navigation
  - `XIcon` - Close icon for mobile menu
  - `LoginIcon` - Login icon for mobile authentication button
  - `UserPlusIcon` - Register icon for mobile authentication button

### Changed
- **BottomNavigation Component**:
  - Modernized to use CSS variables directly (`text-primary-600 dark:text-primary-400`)
  - Removed dependency on `navStyles.js` helper function
  - Added dynamic navigation based on context (global vs project)
  - Now accepts `user` and `project` props for context-aware navigation
  - Flexible grid layout (3-4 columns based on navigation items)
  - Smart route matching with `matchRoutes` for accurate active states
- **AuthenticatedLayout**:
  - Added `BottomNavigation` rendering for mobile devices
  - Added bottom padding (`pb-20 md:pb-6`) to main content to prevent overlap with bottom navigation
- **Welcome Page**:
  - Made header fully responsive for mobile devices
  - Added icon-only buttons for Login/Register on mobile (LoginIcon and UserPlusIcon)
  - ThemeToggle now always visible on mobile (moved from dropdown)
  - Hamburger menu uses theme-aware colors (`text-primary-600 dark:text-primary-400`)
  - Mobile menu simplified to show only documentation link
  - Improved spacing with `space-x-2` for better icon alignment
  - All icons now use consistent theme colors
  - Improved logo sizing for mobile (`text-xl sm:text-2xl`)
- **Dashboard**:
  - Adjusted FAB (Floating Action Button) position from `bottom-4` to `bottom-20` on mobile
  - Changed FAB z-index from `z-50` to `z-40` (bottom nav is `z-50`)
- **Projects/Show**:
  - Removed excessive `py-12` wrapper for better mobile spacing
  - Updated grid spacing from `gap-6` to `gap-4 md:gap-6`
  - Simplified structure for better mobile rendering
- **Projects/Edit**:
  - Made forms fully responsive with single column on mobile
  - Updated card padding from `p-6` to `p-4 sm:p-6`
  - Changed theme selector grid from `grid-cols-3` to `grid-cols-2 sm:grid-cols-3`
  - Updated theme text size from `text-sm` to `text-xs sm:text-sm`
- **Financial Calculator**:
  - Made header fully responsive with vertical stacking on mobile
  - Updated title size from `text-2xl` to `text-xl sm:text-2xl`
  - Updated subtitle size from `text-sm` to `text-xs sm:text-sm`
  - Changed layout to stack controls vertically on mobile
  - Made toggle full-width on mobile with `flex-1`
  - Made export button full-width on mobile `w-full sm:w-auto`
  - Updated content padding from `p-8` to `p-4 sm:p-8`
  - Adjusted min-height from `min-h-[600px]` to `min-h-[400px] sm:min-h-[600px]`

### Technical Details
- All responsive changes follow mobile-first approach
- Consistent use of Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`)
- No breaking changes to existing functionality
- All views maintain theme system integration
- Build successful with no errors

---

## [1.3.1] - 2025-11-29

### Added
- **Tools API**:
  - `Api/ToolController` with `index` and `toggle` methods for managing user tool preferences via API.
  - `GET /api/tools`: Returns list of available tools with translation keys and enabled status.
  - `POST /api/tools/toggle`: Enables/disables tools for authenticated users.
- **Tests**:
  - `Feature/Api/ToolTest` for Tools API endpoints.
- **Translations**:
  - Added `common.language` and related keys to `en.json` for language selection UI.
  - Synchronized missing sections between `es.json` and `en.json` (`calculator`, `currency`, `preferences`, `docs`, `finance`).

### Changed
- **Financial Calculator UI**:
  - Updated `QuantityInput` component to use semantic theme colors (`text-primary-600`) for +/- buttons.
  - Updated calculator title to use theme colors (`text-primary-600 dark:text-primary-400`).
  - Updated `InputGroup` suffix (%) to use theme colors with bold styling.

---

## [1.3.0] - 2025-11-29

### Added
- **Financial Calculator**:
  - **Backend**: `FinancialCalculatorService` for reusable loan logic (Amortization, Interest, Rates).
  - **API**: `POST /api/tools/calculator/calculate` endpoint for external integrations.
  - **Frontend**: `FinancialCalculator.jsx` tool with Basic (Visual) and Advanced (Detailed) modes.
  - **Export**: Ability to export amortization tables to **CSV** and **PDF** (including charts).
- **Tests**:
  - Unit tests for `FinancialCalculatorService`.
  - Feature tests for Calculator API endpoint.

### Changed
- **PDF Export**: Optimized layout for compact reports and fixed chart rendering issues in Dark Mode.
- **Workflows**: Updated `tests.yml` to include `bcmath`, `dom`, `xml`, and `gd` extensions for PDF generation support.

## [1.2.4] - 2025-11-29

### Added
- **Components**: Created reusable `Alert` component (`resources/js/Components/Alert.jsx`) for standardized information, warning, success, and error messages.
- **Icons**: Added `InfoIcon` to `Icons.jsx`.

### Changed
- **Documentation Hub**:
  - Refactored `DevDocs.jsx` to use the new `Alert` component for security notes.
  - Updated `Hub.jsx` to use specific `info` colors for the Developer card, ensuring visual distinction without affecting the global theme.
- **Theme**: Reverted `secondary` color in `tailwind.config.js` to `colors.gray` to fix dark mode background issues.
- **Welcome Page**: Improved "Documentation" link hover style to use `primary` color for better visibility.

## [1.2.3] - 2025-11-29

### Changed
- **Auth UI**: Refactored all authentication views (`Login`, `Register`, `ForgotPassword`, etc.) to use the project's semantic color system (`primary`, `success`, `danger`) instead of hardcoded colors.
- **Components**: Replaced hardcoded HTML elements (`input`, `label`) in auth views with reusable React components (`TextInput`, `InputLabel`).
- **Styling**: Fixed disproportionate button sizes in auth forms by introducing `SecondaryLink` for "Cancel" actions, matching `PrimaryButton` dimensions.

### Added
- **SecondaryLink**: New component for rendering links with `SecondaryButton` styling.

## [1.2.2] - 2025-11-28
- **Critical Crash**: Resolved `BindingResolutionException` in `bootstrap/app.php` caused by an incorrect middleware alias (`verified`).
- **API Validation**: Restored `StoreProyectoRequest` and `UpdateProyectoRequest` in `ProyectoController` to ensure proper validation for projects.
- **Test Environment**: Fixed `Facade root has not been set` error by bypassing `ParallelTesting` callbacks in `TestCase.php`.
- **Testing**: Added `ChatSystemTest` (Backend) and updated Frontend tests (`ProjectCard`, `FinanceWidget`, `TasksWidget`) to align with translation fallbacks. Fixed `ProyectoWebTest` deletion logic.
  - Updated `ProyectosApiTest` to handle `SoftDeletes` and `UserObserver` side effects.
  - Fixed `ProfilePhotoTest` assertions by handling stale user instances and ensuring unique filenames.
  - Updated `ProfilePhotoValidationTest` to reflect the new 4MB upload limit.

## [1.2.1] - 2025-11-28

### Fixed
- **Project Updates**: Resolved critical bug where project updates failed due to incorrect unique name validation (`mis_proyecto` route parameter).
- **Image Uploads**: Increased upload limit to 4MB (was 2MB) for both Projects and Profile to accommodate modern image sizes.
- **Form Submission**: Unified project edit form to always use `POST` with `_method: put` and `forceFormData: true` for consistent file handling.

### Added
- **Components**: New reusable `ImageUploader` component with support for square/circle shapes and configurable sizes.

### Changed
- **Profile UI**:
  - Updated profile photo uploader to match Project style (square, large).
  - Centered profile edit view (`max-w-4xl`) for consistency with Project views.
  - Disabled email editing in profile form for security/stability.
- **Refactoring**: Refactored `Projects/Edit.jsx` and `UpdateProfileInformationForm.jsx` to use the new `ImageUploader` component, removing ~120 lines of duplicated code.

## [1.2.0] - 2025-11-28

### Added
- **Project Themes**: Projects can now have a custom color theme (`theme`) and typography (`typography`), independent of the user's global theme.
- **Project Images**: Added support for uploading custom cover images (`image_path`) for projects, replacing static icons.
- **Profile Photo**: Users can now upload, update, and delete their profile photo via Web and API.
- **API Endpoints**:
  - `POST /api/profile/photo`: Upload profile photo.
  - `DELETE /api/profile/photo`: Remove profile photo.
- **Global Theme System**:
  - `GlobalThemeContext` now supports `forceTheme` to override global settings (used in Project views).
  - `AuthenticatedLayout` accepts `projectTheme` prop.
- **UI Components**:
  - `CreateProject.jsx`: Completely redesigned with image upload, theme selector, and typography selector.
  - `ProjectCard.jsx`: Updated to display project cover image and use project-specific colors.
  - `TypographySelector.jsx`: New component for selecting fonts with preview.

### Changed
- **Database**: Added `image_path`, `theme`, and `typography` columns to `proyectos` table.
- **Styles**: Standardized all primary colors to use CSS variables (`--color-primary-*`), enabling dynamic theming.
- **Landing Page**: Fixed rendering issues and hardcoded texts.
- **Tests**: Added validation tests for profile photo upload (`ProfilePhotoValidationTest`).

### Fixed
- **Landing Page**: Resolved `useGlobalTheme` context error by moving provider to `app.jsx`.
- **Migrations**: Resolved conflict with duplicate migration files for project themes.

---

## [1.1.0] - 2025-11-25

### Added
- **Search System**: Integrated Meilisearch with Laravel Scout.
  - Global search bar in topbar (`SearchInput.jsx`).
  - Search results page (`SearchResults.jsx`).
  - Automated indexing via `composer.json` and CI/CD.
- **Security**: Strict Role-Based Access Control for Financial Data.
  - **Backend**: `ProyectoUiWebController` and `Api\ProyectoController` only load financial data (`cuentas`, `transacciones`) for project admins.
  - **Frontend**: `ProjectCard` and `Projects/Show` hide financial widgets/sections for non-admin members.
- **UI/UX**:
  - New monochromatic language icons (`IconES`, `IconEN`).
  - Refined Profile Dropdown (removed header, renamed "Edit Profile").
  - Redirected Logo click to Dashboard for authenticated users.
- **Documentation**:
  - `SEARCH_IMPLEMENTATION.md` (Core).
  - `FRONTEND_GALLERY.md` (Reference).
  - Updated `INSTALLATION.md` and `TESTING_ARCHITECTURE.md`.

### Changed
- **Dashboard**: Resized search widget for a more compact look.
- **Sidebar**: Adjusted logo height and redirection logic.
- **Translations**: Added missing keys for Search, Finance Security, and Profile.

### Fixed
- **Logo Redirect**: Clicking the logo now correctly redirects authenticated users to the Dashboard instead of the Landing page.

---

## [1.0.0] - 2025-11-19

### Added - November 19, 2025

#### Internationalization System (i18n)
- ✅ Complete i18n implementation with i18next + react-i18next
- ✅ Language preference cascade: Database → Session → Config
- ✅ `SetUserLocale` middleware to resolve language on every request
- ✅ `locale` field in `users` table (new migration)
- ✅ API Endpoint `PUT /api/user/locale` to change user language
- ✅ React `LocaleSelector` component integrated into authenticated layouts
- ✅ 136 translation keys synchronized (Spanish and English)
- ✅ Tests: `UserLocaleApiTest` with full coverage

#### Codebase Audit
- ✅ Comprehensive audit of API controllers and CRUD operations.
- ✅ Identification and documentation of technical improvements.

#### Validation Fixes
- ✅ Removed invalid `'uppercase'` rule in `StoreProyectoRequest`
- ✅ Removed validation conflict: `'max:1'` + `'min:3'`
- ✅ Reordered validation rules for clarity

#### Problem Resolution
- ✅ Removed ghost folder `tests/Feature/Feature/` (causing IDE errors)
- ✅ Disabled false Intelephense diagnostics
- ✅ Cleared Pylance and VSCode caches

### Changed - November 19, 2025

- 🔄 `ProyectoUiWebController::store()` - Temporary change to manual validation for diagnosis
  - ⚠️ NOTE: Must revert to Form Request injection
- 🔄 `User` model - Added `locale` field and access methods
- 🔄 Translations - Synchronized all keys between es.json and en.json

### Removed - November 19, 2025

- ❌ Invitation logic for unauthenticated users
  - Acknowledgment: Guests must create an account to accept invitations
- ❌ `LocaleController` - Removed public locale endpoints
- ❌ Locale tests for guests (out of scope)

### Fixed - November 19, 2025

- 🔧 Project validation: min/max rule conflicts removed
- 🔧 IDE cache errors: false diagnostics disabled
- 🔧 Desynchronized translation: both languages now have 136 keys



---

## [v0.1.0] - 2025-11-19 (Initial Setup)

### Added

- 🎯 Initial project structure
- 🎯 Setup Laravel 12.38.1 + React 19 + Inertia
- 🎯 Authentication with Laravel Sanctum
- 🎯 Base models: User, Project, Account, Category, Transaction, Invitation
- 🎯 CRUD API Controllers for Projects, Accounts, Categories
- 🎯 Role system for project members (admin/member)
- 🎯 Web layouts with Inertia (Authenticated, Guest)
- 🎯 Email verification and password reset
- 🎯 is_super_admin field in users
- 🎯 Artisan command to assign super admin

---

**Last updated**: November 25, 2025
**Next release**: TBD
