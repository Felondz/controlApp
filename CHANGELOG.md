# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Fixed
- **Critical Crash**: Resolved `BindingResolutionException` in `bootstrap/app.php` caused by an incorrect middleware alias (`verified`).
- **API Validation**: Restored `StoreProyectoRequest` and `UpdateProyectoRequest` in `ProyectoController` to ensure proper validation for projects.
- **Test Environment**: Fixed `Facade root has not been set` error by bypassing `ParallelTesting` callbacks in `TestCase.php`.
- **Tests**:
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
