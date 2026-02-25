# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-25

### 🤖 FEATURE: AI Integration — LLM Chat Widget & Global Kill Switch (Feb 24, 2026)

**Type**: Major Feature
**Impact**: HIGH — Adds AI-powered assistance across the entire platform
**Tests Affected**: 28 new MCP tests, 350+ total backend tests passing

**Description**:
Completed end-to-end LLM integration, from user API key configuration to a fully functional global AI Chat Widget with recursive MCP tool execution. Implemented a global kill switch to instantly disable all AI features per user.

**Key Changes**:

- ✅ **AI Chat Widget** (`AiChatWidget.jsx`): Global widget injected into `AuthenticatedLayout`, supporting multi-provider LLM conversations with SSE streaming.
- ✅ **Agent Loop**: Native recursive MCP Tool execution (up to 5 levels of depth) — AI can autonomously invoke domain tools (query balances, create tasks, manage inventory).
- ✅ **Dynamic Model Selection**: Users can switch LLM provider and model at runtime from the chat widget header.
- ✅ **LLM Settings UI** (`UpdateLlmSettingsForm.jsx`): Premium UI for managing API keys with per-provider add/update/delete and encrypted storage (`UserLlmSetting` model).
- ✅ **LLM Models Proxy** (`LlmModelsController`): Backend proxy fetches available models from providers with 7-day cache to avoid rate limits.
- ✅ **Global AI Kill Switch**: New `is_ai_enabled` column on `users` table. Toggle in profile settings instantly disables all AI features (chat widget disappears, MCP tools inaccessible).
  - Flow: `router.post('/profile/toggle-ai')` → Backend inverts flag → Inertia recalculates `has_active_ai` → Widget dismounts.
- ✅ **MCP Test Suite** (28 tests, 56+ assertions): Automated coverage for all 25+ MCP Tools across 5 servers (`InventoryMcpTest`, `OperationsMcpTest`, `FinanceMcpTest`, `TasksMcpTest`, `ChatMcpTest`).
- 🐛 **Bug Fix**: Resolved AI widget visibility issue where deactivating one provider didn't hide the widget when other active providers existed.
- 🐛 **Bug Fix**: Fixed Ziggy route cache requiring regeneration after adding `profile.toggle-ai` route.
- 🐛 **Cleanup**: Removed 3 duplicate migration stubs for `add_is_ai_enabled_to_users_table`.

**Files Created/Modified**:
- `database/migrations/2026_02_24_225000_add_is_ai_enabled_to_users_table.php` (NEW)
- `app/Models/User.php` — Added `is_ai_enabled` to `$fillable`
- `app/Http/Middleware/HandleInertiaRequests.php` — `has_active_ai` now checks `is_ai_enabled && providers`
- `app/Http/Controllers/ProfileController.php` — New `toggleAi()` method
- `resources/js/Components/AiChatWidget.jsx`, `resources/js/Components/Icons.jsx` (SparklesAi icons)
- `resources/js/Pages/Profile/Partials/UpdateLlmSettingsForm.jsx`
- `tests/Feature/Mcp/*.php` (5 new test files)

---

### 🏗️ REFACTOR: Macro-Refactor — Actions/DTOs + GraphQL + MCP Architecture (Feb 23, 2026)

**Type**: Architecture Refactoring
**Impact**: CRITICAL — Complete backend architecture overhaul
**Tests Affected**: 323+ passing, 0 regressions

**Description**:
Decoupled all business logic from HTTP controllers into a clean Actions/DTOs pattern. Introduced GraphQL (Lighthouse) as the primary mobile data layer and MCP (Model Context Protocol) tools for AI integration. Applied across all 5 active modules. Deprecated and removed Analytics and Notifications modules.

**Module-by-Module Changes**:

#### Inventory Module (Pilot)
- ✅ `CreateInventoryItemDTO`, `UpdateInventoryItemDTO` — Strict readonly DTOs
- ✅ `CreateInventoryItemAction`, `UpdateInventoryItemAction`, `DeleteInventoryItemAction`
- ✅ `inventory.graphql` schema — Queries & Mutations resolved via `InventoryMutations.php`
- ✅ **3 MCP Tools**: `ConsultStockTool`, `CreateInventoryItemTool`, `UpdateInventoryItemTool` on `InventoryServer`

#### Operations Module
- ✅ **11 Actions**: Process CRUD, Lote lifecycle (Create/Update/Stage/Finish/Discard), Input management
- ✅ **11 DTOs**: Strict typed `readonly class` inputs for every action
- ✅ `operations.graphql` — Types, Queries, 10 Mutations via `OperationsMutations.php`
- ✅ **12 MCP Tools** on `OperationsServer`: Full process and lote lifecycle management for AI
- ✅ **PHPStan**: Generics added to all 6 model relationships and factories — zero errors

#### Finance Module
- ✅ **8 DTOs** + **12 Actions**: Transactions CRUD, Accounts CRUD + Estado + PayBill, Categories CRUD
- ✅ `finance.graphql` — Types `Transaccion`, `Cuenta`, `Categoria`, `BalanceResponse`, 12 Mutations via `FinanceMutations.php`
- ✅ **7 MCP Tools** on `FinanceServer`: Balance, Transactions, Accounts, Bills, Categories
- ✅ **Model `Transaccion`**: Generics on 9 relationships, typed factory — PHPStan clean
- ✅ 48 finance tests passing independently

#### Tasks Module
- ✅ **2 DTOs** (`CreateTaskDTO`, `UpdateTaskDTO`) + **3 Actions** (Create/Update/Delete)
- ✅ **4 MCP Tools** on `TasksServer`: List, Create, Update, Summary
- ✅ **Model `Task`**: Generics on 6 relationships, typed factory

#### Chat Module
- ✅ **1 DTO** (`SendMessageDTO`) + **1 Action** (`SendMessageAction`)
- ✅ **2 MCP Tools** on `ChatServer`: Send & List Messages
- ✅ **Model `Message`**: Generics on 3 relationships, typed factory

**Infrastructure**:
- ✅ **GraphQL**: `nuwave/lighthouse` with `Sanctum` auth guard, per-module schema imports
- ✅ **LLM Manager**: `UserLlmSetting` model (encrypted API keys), `LLMServiceInterface`, `LLMManager` for dynamic provider injection
- ✅ **API Strategy**: GraphQL → Mobile CRUD, REST → Streaming/SSE (LLM chat) + Web parity
- ✅ **Security**: `composer audit` — updated `phpunit` and symfony packages

**Cleanup — Deprecated Modules Removed**:
- 🗑️ **Deleted** `app/Modules/Analytics/` (8 files) and `app/Modules/Notifications/` (9 files)
- 🗑️ **Deleted** `tests/Unit/Modules/Analytics/MetricsCollectorTest.php`
- 🗑️ **Cleaned** `EnterpriseTemplate.php`: removed `analytics`/`notifications` references
- 🗑️ **Migration**: `drop_deprecated_analytics_notifications_tables` — drops `analytics_metrics`, `notification_preferences`, `notifications`
- 📐 **Decision**: Analytics will use query-time analytics from existing transactional tables

**Validation**:
- ✅ PHPStan Level 8: `[OK] No errors` across all modified modules and `app/Mcp/`
- ✅ 323 backend tests passing, 2 skipped
- ✅ Full suite: 350+ tests after MCP test addition

---

### 19 de Diciembre de 2025 (Operations Testing)

#### 🧪 FEATURE: Comprehensive Operations Module Tests

**Type**: Quality Assurance & Bug Fix
**Impact**: MEDIUM - Ensuring reliability of critical Production flows
**Tests Affected**: 8 new feature tests added

**Description**:
Implemented full feature test coverage for `ProductionProcess` (CRUD) and `LoteProduccion` (Lifecycle Flow), validating the core operations logic from recipe creation to batch completion.

**Key Changes**:
- ✅ **New Feature Tests**:
    - `ProductionProcessTest`: Validates admin creation, updates, and deletion of processes and stages.
    - `LoteProduccionFlowTest`: Simulates full production flow (Create -> Advance Stage -> Add Inputs -> Discard).
    - `LoteLifecycleTest`: Covers `finish` (with validation), `discard`, and `history` view (filters/search).
- 🐛 **Bug Fixes**:
    - Fixed `IntegrityConstraintViolation` in `CreateReplenishmentTask` listener (typo in `project_id`).
    - Fixed `LoteController` error when optional fields (`assigned_to`, `notes`) were missing.
    - Standardized `LoteController` JSON responses (201 Created).
    - Fixed `BalanceTest` flakiness in Finance module (random account type generation).
- 🏗️ **Testing Architecture Update**:
    - Adopted `spy(\App\Core\Events\ModuleEventBus::class)` pattern for testing Module Events.
    - Implemented Frontend Tests with Vitest for `History.jsx`.

**Files Modified**:
- `tests/Feature/Modules/Operations/*`
- `tests/Frontend/Pages/Operations/Lotes/History.test.jsx` (NEW)
- `app/Modules/Operations/Controllers/LoteController.php`
- `resources/js/Pages/Operations/Lotes/History.jsx` (NEW)
- `app/Modules/Operations/Models/ProductionProcess.php`
- `app/Modules/Inventory/Listeners/CreateReplenishmentTask.php`
- `docs/private/es/04-testing/TESTING_ARCHITECTURE.md`

**Commit Simulado**: `test(ops): add feature tests for production process and lote flow`

---
### 12 de Diciembre de 2025 (Operations)

#### ✨ FEATURE: Stage-Based Task Automation (Operations)

**Type**: Feature & Critical Backend Fix
**Impact**: HIGH - Enables SOP automation for production lines
**Tests Affected**: 1 new test suite (partially passing due to env)

**Description**:
Implemented the core automation logic for the Operations module. Now, when a Production Batch (`Lote`) advances to a new `Stage`, the system automatically generates specific tasks based on pre-defined `StageTaskTemplates`.

**Features**:
- 🤖 **Auto-Task Generation**: Listener `GenerateStageTasks` clones templates into actionable tasks.
- 📅 **Smart Due Dates**: Tasks calculate due dates based on `days_due_offset` relative to stage start.
- 👤 **Auto-Assignment**: Tasks are automatically assigned to the batch owner.

**Bug Fixes**:
- 🐛 **Database Schema**: Fixed `QueryException` ("column current_stage_id not found"). Renamed model/factory attributes to `stage_id` to match migration.
- 🔧 **User Model**: Restored missing `Searchable` trait import that caused a Fatal Error during tests.

**Technical Details**:
- Created `EtapaProcesoFactory` and `StageTaskTemplateFactory`.
- Implemented `GenerateStageTasksTest` (Feature) and `GenerateStageTasksUnitTest` (Unit with Mocks).

**Files Modified**:
- `app/Modules/Tasks/Listeners/GenerateStageTasks.php`
- `app/Modules/Operations/Models/LoteProduccion.php`
- `database/factories/LoteProduccionFactory.php`
- `tests/Feature/Modules/Tasks/GenerateStageTasksTest.php`

**Documentation Updated**:
- `docs/development/operations_module_log.md`
- `walkthrough.md`

**Commit Simulado**: `feat(ops): implement stage task automation and fix column name bug`

---

8: ### 12 de Diciembre de 2025
9: 
10: #### 🧪 CRITICAL FIX: Frontend Test Suite Stability & Coverage
11: 
12: **Type**: Quality Assurance & Bug Fix
13: **Impact**: HIGH - Restored CI/CD reliability
14: **Tests Affected**: 275/275 ✅ (all passing)
15: 
16: **Description**:
17: Implemented comprehensive unit tests for the Inventory module widgets and fixed critical regression failures in existing tests caused by the recent modular refactoring. The entire frontend test suite is now passing locally and in CI environments.
18: 
19: **New Tests Implemented (Inventory)**:
20: - `InventorySummaryWidget.test.jsx`: Validates totals, inventory value, and low stock alerts.
21: - `LowStockWidget.test.jsx`: Checks rendering of low stock items and empty states.
22: - `InventoryItemsWidget.test.jsx`: Covers item listing, filtering, and badge display.
23: 
24: **Regression Fixes**:
25: - 🐛 **Import Paths**: Fixed broken imports in `ChatWidget`, `FinanceWidget`, `TasksWidget` tests pointing to old locations.
26: - 🐛 **Ziggy Mock**: Enhanced `test-setup.js` to mock `route().has()` method, resolving "Unhandled Rejection" errors.
27: - 🐛 **ProjectCard**: Fixed selector logic to correctly find the accent color line in the component structure.
28: 
29: **Documentation Updated**:
30: - `docs/private/es/04-testing/TESTING_ARCHITECTURE.md`
31: - `docs/private/en/04-testing/TESTING_ARCHITECTURE.md`
32: 
33: **Commit Simulado**: `test(frontend): add inventory widgets tests and fix regression failures`
34: 
35: ---
36: 
37: ### 11 de Diciembre de 2025 (Late)

#### ⚡ EventBus Async Migration: Operations & Inventory Modules

**Type**: Architecture Enhancement
**Impact**: MEDIUM - Event-driven async processing for all modules
**Tests Affected**: 62/62 ✅ (all passing)

**Description**:
Migrated Operations and Inventory modules to the async EventBus architecture, following the pattern established by Chat module. All inter-module communication now uses string-based events and async listeners via Redis queue.

**Events Migrated to `BaseModuleEvent`**:
- `operations.lote.stage_changed` (StageChanged.php)
- `operations.lote.finished` (LoteFinished.php)
- `inventory.stock.low` (InventoryLowStock.php)
- `finance.contract.executed` (SupplyContractExecuted.php)

**Listeners Converted to `ShouldQueue + Redis`**:
- `GenerateStageTasks` - Creates tasks from stage templates when batch moves to new stage
- `CreateFinishedGoodsEntry` - Adds finished goods to inventory when production batch completes
- `CreateInventoryDraftEntry` - Creates draft inventory entries when supply contract executes
- `CreateReplenishmentTask` - Creates replenishment task when item falls below minimum stock

**Module Updates**:
- `OperationsModule.php` - `getEventListeners()` now uses strings instead of class FQCN
- `InventoryModule.php` - `getEventListeners()` now uses strings instead of class FQCN

**Documentation Updated**:
- `docs/private/en/01-core/MODULES_ARCHITECTURE.md`
- `docs/private/es/01-core/MODULES_ARCHITECTURE.md`
- `docs/development/operations_module_log.md`

**Commit Simulado**: `feat(events): migrate operations and inventory to async eventbus`

---

### 11 de Diciembre de 2025

#### 🏗️ REFACTOR: Complete Backend Modular Architecture Migration (v2.8.0)

**Type**: Architecture Refactoring
**Impact**: HIGH - Major structural change to backend codebase
**Tests Affected**: 305/305 ✅ (all passing)

**Description**:
Completed the migration of all feature-specific code from `app/Models/`, `app/Http/Controllers/`, and `app/Features/` into their respective module directories under `app/Modules/`. This enforces strict modular architecture boundaries and improves codebase scalability.

**Files Moved**:

1. **Finance Module** (`app/Modules/Finance/`):
   - **Models**: `Cuenta.php`, `Transaccion.php`, `Categoria.php`
   - **Controllers**: `TransaccionController.php`, `CuentaController.php`
   - **Requests**: `StoreTransaccionRequest.php`, `UpdateTransaccionRequest.php`
   - **Jobs**: `ProcessAutoBills.php`, `ProcessRecurringBills.php`, `ProcessInterestAccrual.php`
   - **Services**: `CreditCardBillingService.php`, `FinancialCalculatorService.php`, `InvestmentInterestService.php`, `LoanDisbursementService.php`
   - **Policies**: `CuentaPolicy.php`, `CategoriaPolicy.php`, `TransaccionPolicy.php`
   - **Observers**: `TransaccionObserver.php`
   - **Commands**: `CheckUpcomingObligations.php`

2. **Tasks Module** (`app/Modules/Tasks/`):
   - **Models**: `Task.php`
   - **Controllers**: `TaskController.php`

3. **Chat Module** (`app/Modules/Chat/`):
   - **Models**: `Message.php`

**Namespace Updates**:
- All moved files updated to new namespaces (e.g., `App\Modules\Finance\Models\Cuenta`)
- Global search and replace across `app/`, `tests/`, `database/`, `routes/`
- Updated route files (`api.php`, `web.php`) with new controller imports
- Updated `Proyecto.php` model with new relationship imports

**Factory Resolution Fixes**:
- Added `newFactory()` method to all moved models
- Added `$model` property to corresponding factories
- Created new `TaskFactory.php`

**Documentation Updated**:
- `docs/private/ARCHITECTURE_MODULES.md`
- `docs/private/en/01-core/MODULES_ARCHITECTURE.md`
- `docs/private/es/01-core/MODULES_ARCHITECTURE.md`

**Validation**:
- ✅ 305 backend tests passing
- ✅ All namespaces correctly resolved
- ✅ Factory resolution working for all moved models

**Commit Simulado**: `refactor(arch): complete backend modular architecture migration v2.8.0`

---

## [2.7.1] - 2025-12-10

### Changed - Code Cleanup & Architecture Refactoring
- ♻️ **Finance Module**: Removed dead code (`TaskEventListener`) related to obsolete `tasks.financial_task.created` integration.
- ♻️ **Architecture Verification**: Confirmed modular boundaries and event-driven patterns in `architecture_analysis.md`.
- 📚 **Documentation**: Updated README to reflect v2.7.0 status.

## [Unreleased]
### Added
- [Frontend] Indicador de "Tasa E.A." en tarjetas de cuentas de ahorro.
- [Frontend] Semáforo de colores en tarjetas de cuenta para estado de pago (Verde/Ámbar/Rojo) y porcentaje de uso de TC.
- [Frontend] Manejo automático de errores 419 (CSRF) con recarga de página.
- [Backend] Lógica de pago espejo para Tarjetas de Crédito (genera transacción de abono automáticamente).

### Changed
- [Backend] Aumento del límite de carga de transacciones a 300 en dashboard para mejorar visibilidad histórica.
- [Backend] Ajuste en timestamp de transacciones creadas "hoy" para usar hora actual exacta.
- [Backend] Corrección en cálculo de deuda pendiente de TC (resta pagos del ciclo actual).
- [Backend] Validación de bloqueos financieros restringida correctamente a cuentas de inversión.

### Fixed
- [Frontend] Ordenamiento de transacciones widget por ID descendente.
- [Frontend] Comparación de tipos en AccountDetailsModal.

## [2.7.0] - 2025-12-07

### Added - Interest Accrual & Loan Management

**Automated Interest Accrual:**
- 📈 **Yield Logic**: `ProcessInterestAccrual` job calculates and registers monthly interest for Savings and Investment accounts.
- ⏰ **Scheduler**: Runs daily at 00:01 (executes logic on 1st of month).
- 💰 **Yield Projection**: `UpcomingObligationsWidget` now displays projected next-month yields/interests for investments.

**Loan Management Improvements:**
- 🏦 **Installment Projection**: `UpcomingObligationsWidget` now displays upcoming loan installments calculated by backend.
- 💸 **Loan Payment**: Added "Pay Installment" button directly in the widget.
- 🔒 **CDT Protection**: Validation blocks withdrawals from Investment accounts (CDTs) before maturity date.

**Credit Card Payment Refinements:**
- 🐛 **Payment Fix**: Fixed "category_id required" error when paying credit cards via modal.
- 🐛 **Validation Fix**: Fixed critical bug where all accounts with expiration dates (like CCs) were blocked for withdrawals. Now restricted correctly to 'inversion' type.
- 🏷️ **Auto-Category**: Backend automatically creates/assigns "Pagos de Tarjeta" category if missing.
- 🔧 **Endpoint Dedicated**: `CreditCardPaymentModal` now uses the dedicated `pay-credit-card` endpoint for robust balance updates.

**Translations (ES + EN):**
- Added keys: `pay_loan`, `yield`, `loan_installment`, `yield_rate_annual`.

**Files Modified:**
- `app/Jobs/ProcessInterestAccrual.php` (NEW)
- `app/Http/Controllers/ProyectoUiWebController.php`
- `app/Http/Controllers/Api/CuentaController.php`
- `resources/js/Pages/Projects/Finance/ProjectDashboard.jsx`
- `resources/js/Components/Finance/Widgets/UpcomingObligationsWidget.jsx`
- `resources/js/Components/Finance/Modals/CreditCardPaymentModal.jsx`
- `routes/console.php`

## [2.6.7] - 2025-12-07

### Fixed - Translations & Mobile Responsiveness

**Missing Translations Added (ES + EN):**
- `finance.category` - "Categoría" / "Category"
- `finance.description` - "Descripción" / "Description"
- `finance.concept` - "Concepto" / "Concept"  
- `finance.new_bill` - "Nueva Factura" / "New Bill"
- `finance.bills_and_services` - "Facturas y Servicios" / "Bills & Services"
- `finance.no_pending_bills` - "No hay facturas pendientes" / "No pending bills"
- `finance.income_desc`, `finance.other_desc`, `finance.bill_desc` - Placeholder translations
- `finance.categories.*` - Default category name translations (8 keys)
- `widgets.tasks_users_load` - "Carga de Trabajo" / "Workload"
- `common.optional` - "(Opcional)" / "(Optional)"
- `common.days`, `common.today`, `common.yesterday`, `common.tomorrow`, `common.overdue`

**Component Improvements:**
- 🔧 **InputLabel**: `optional` prop now uses translation system instead of hardcoded Spanish text
- 📊 **TransactionsWidget**: Category names now translated via `translateCategoryName` helper
- 📊 **BillsWidget**: Category names now translated via `translateCategoryName` helper

**Mobile Responsiveness Improvements:**
- 📱 **AccountModal**: Loan fields grid now responsive (1 column on mobile, 3 columns on desktop)
- Fixed truncated labels for "Installment Value" and "Paid Installments" on small screens

**Files Modified:**
- [es.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/es/es.json) - Added 20+ translation keys
- [en.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/en/en.json) - Added 20+ translation keys
- [InputLabel.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/InputLabel.jsx) - Uses `t()` for optional text
- [TransactionsWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/TransactionsWidget.jsx) - Category translation
- [BillsWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/BillsWidget.jsx) - Category translation
- [AccountModal.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Modals/AccountModal.jsx) - Responsive grid fix
- [categoryHelpers.js](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Utils/categoryHelpers.js) - NEW: Helper for translating default category names

### Added - Credit Card & Loan Management

**Credit Card (TC) Improvements:**
- 💳 **Installments (Cuotas)**: Transactions now support 1-48 installments for credit card purchases
- 📊 **Billing Cycle Tracking**: Transactions are grouped by billing cycle (`ciclo_facturacion`)
- 🧮 **CreditCardBillingService**: Calculates minimum payment, interest charges, and deferred installments
- 🎯 **CreditCardPaymentModal**: Smart payment modal with Minimum/Total/Custom payment options

**Loan/Personal Credit Improvements:**
- 💰 **Loan Disbursement**: Track where loan funds were deposited on account creation
- 🏦 **LoanDisbursementService**: Creates automatic income transaction to destination account

**Investment Interest:**
- 📈 **InvestmentInterestService**: Calculates and registers monthly interest for investment/savings accounts

**New Translations (ES + EN):**
- `finance.installments`, `finance.with_interest`, `finance.no_interest`
- `finance.credit_card_bill`, `finance.minimum_payment`, `finance.total_payment`
- `finance.pay_from`, `finance.pay_now`, `finance.credit_card_payment`
- `finance.loan_disbursement`, `finance.destination_account`, `finance.amount_to_deposit`

**Backend:**
- NEW: `2025_12_07_150000_add_installments_to_transacciones_table.php`
- NEW: `2025_12_07_150001_add_loan_disbursement_to_cuentas_table.php`
- NEW: `app/Services/CreditCardBillingService.php`
- NEW: `app/Services/InvestmentInterestService.php`
- NEW: `app/Services/LoanDisbursementService.php`
- MOD: `Transaccion.php` - Added cuotas, ciclo_facturacion, transaccion_origen_id
- MOD: `Cuenta.php` - Added monto_desembolsado, cuenta_destino_id

**Frontend:**
- NEW: `CreditCardPaymentModal.jsx` - Smart TC payment with min/total/custom options
- MOD: `QuickTransactionModal.jsx` - Installment selector (1-48) for credit card expenses
- MOD: `AccountModal.jsx` - Disbursement fields for loans, 18+ hint translations
- MOD: `UpcomingObligationsWidget.jsx` - Now shows calculated CC bills with minimum payment
- MOD: `DraggableWidgetGrid.jsx` - Passes creditCardBills to widgets
- MOD: `ProjectDashboard.jsx` - Receives and passes creditCardBills

**API:**
- NEW: `GET /api/proyectos/{id}/finance/credit-card-bills` - Returns calculated CC bills

## [Unreleased] - Pre-Release Security Fixes

### Added
- New professional Dashboard with drag-and-drop widget system
- `DraggableWidgetGrid` component using `@hello-pangea/dnd`
- Widget registry system in `resources/js/Utils/widgetRegistry.js`
- New widgets: Finance Summary, Tasks Summary, Chat Recent, Members Summary, Project Info
- `WidgetSettingsModal` for customizing dashboard layout
- Role-based widget visibility (Finance widgets restricted to Admins)

### Changed
- Refactored `Show.jsx` to use the new widget system
- Updated `es.json` and `en.json` with dashboard translations
- Enhanced `Icons.jsx` with new icons for widgets

### Security
- Enforced strict `isAdmin` checks for finance widget visibility

### Fixed - Critical Security & CI/CD

**Package Manager Security Enforcement:**
- 🔒 **CRITICAL FIX**: Enforced PNPM-only policy across all environments (CI/CD, local, production)
- ✅ **CI/CD Workflows**: Updated `.github/workflows/tests.yml` to use PNPM instead of NPM in both backend and frontend test jobs
- 🗑️ **Removed package-lock.json**: Eliminated NPM lockfile to prevent accidental NPM usage
- 📝 **.gitignore Update**: Added `package-lock.json`, `npm-debug.log*`, and `yarn.lock` to prevent future NPM/Yarn usage
- 📚 **Documentation Updated**: README.md and INSTALLATION.md now explicitly require PNPM with security rationale

**Security Rationale**: 
- NPM packages have historically been vulnerable to supply chain attacks and malware
- PNPM provides better security through content-addressable storage and strict dependency isolation
- This change aligns with documented security policy in `ONBOARDING_FOR_NEW_AIs.md`

**Files Modified:**
- [tests.yml](file:///home/guarox/Documentos/proyectos-personales/controlApp/.github/workflows/tests.yml) - Lines 56-69, 134-147
- [.gitignore](file:///home/guarox/Documentos/proyectos-personales/controlApp/.gitignore) - Added NPM/Yarn lockfile exclusions
- [README.md](file:///home/guarox/Documentos/proyectos-personales/controlApp/README.md) - Added PNPM requirement section, updated test commands
- [INSTALLATION.md](file:///home/guarox/Documentos/proyectos-personales/controlApp/docs/private/es/02-development/INSTALLATION.md) - Replaced all npm commands with pnpm

**Breaking Changes**: ⚠️ Developers must have PNPM installed (`npm install -g pnpm`)

### Fixed - Chat Widget Performance

**Removed Heavy Page Reloads**:
- 🔧 **ChatWidget.jsx**: Removed `router.reload()` completely - was causing slow interactions project-wide
- ⚡ **Lightweight Updates**: `markAsRead()` now only updates local state, no page reloads
- 📖 **Mark as Read**: Messages marked as read on channel entry and when new messages arrive while viewing that channel
- 🔔 **NotificationDropdown**: Changed polling interval from 30s to 20s for faster navbar updates

**Technical Details**:
- Removed `scheduleGlobalUpdate()` and `reloadTimeoutRef` entirely
- Navbar counter updates naturally when navigating to other pages
- Trade-off: Navbar counter doesn't update in real-time while in chat (acceptable since user is viewing chat directly)

### Fixed - Mobile Layout in Finance Widgets

**Card Layout Optimization**:
- 📱 **TransactionsWidget**: Compact single-row layout with icon, truncated info, amount right-aligned
- 📱 **BillsWidget**: Same layout + yellow background theme matching bill button
- 📱 **UpcomingObligationsWidget**: Same layout with calendar icon, date + source info

**Translation Bug Fix**:
- 🔧 **TransactionsWidget**: Fixed `:count` placeholder not being replaced

### Added - API Endpoints for Mobile Apps

**New Endpoints**:
- 🔌 `PUT /api/proyectos/{proyecto}/settings` - Update project settings (widgets, preferences)
- 🔌 `POST /api/proyectos/{proyecto}/transfer-ownership` - Transfer project ownership to another admin
- 🔌 `POST /api/proyectos/{proyecto}/bills/{t}/pay-direct` - Pay bill directly with default account
- 🔌 `GET /api/proyectos/{proyecto}/export/csv` - Export transactions/accounts to CSV
- 🔌 `POST /api/proyectos/{proyecto}/export/pdf` - Export financial report to PDF

**Files Created**:
- `app/Http/Controllers/Api/ExportController.php`
- `resources/views/exports/project-pdf.blade.php`

**Files Modified**:
- `app/Http/Controllers/Api/ProyectoController.php` - Added `updateSettings()` and `transferOwnership()`
- `routes/api.php` - Added 5 new API routes

### Fixed - Account Deletion Balance Validation

**Critical Fix for Balance Integrity**:
- 🔒 **API Controller**: Now validates `saldo != 0` before allowing delete/deactivate
- 🔒 **Web Controller**: Synchronized logic with API controller
- 🔒 **Frontend Modal**: Shows current balance when deletion blocked, disables input
- ⚠️ **Breaking Change**: Accounts with non-zero balance cannot be deleted or deactivated

**Behavior**:
- `saldo ≠ 0` → HTTP 422 + error message with current balance
- `saldo = 0` + has transactions → Mark as "inactiva" (soft-delete)
- `saldo = 0` + no transactions → Permanent delete

### Changed - Sidebar Toggle Button Location

**UI Improvement**:
- 🎨 **Sidebar Toggle**: Moved hamburger button from top header INTO the sidebar itself
- 🎨 **Cleaner Header**: Top bar now only shows back button and page title
- 🎨 **Better UX**: Toggle button always visible at sidebar top, regardless of collapse state

---

## [2.6.6] - 2025-12-06

### Fixed - UI/UX Refinements

**Layout & Navigation:**
- 🎨 **Sidebar Toggle**: Moved toggle button to the top navigation bar for easier access and cleaner sidebar header.
- 🖼️ **Sidebar Logo**: Improved logo behavior - shows icon only when collapsed, full logo when expanded.
- 📱 **Task Cards**: Optimized layout for responsiveness - horizontal row on desktop, stacked on mobile.

**Finance Widgets:**
- 🐛 **Account Flow**: Fixed rendering crash when accounts are missing or deleted.
- ⚡ **Performance**: Disabled Recharts animations in `AccountFlowWidget` to prevent infinite render loops.
- 📏 **Widget Sizing**: Adjusted default width of Transactions and Bills widgets to `medium` (half-width).
- 🔄 **Settings Sync**: Fixed widget settings persistence in Finance Dashboard (`finance_dashboard` key).

### Changed
- 🗑️ **Project Templates**: Removed "Personal Finance" template from creation flow (now auto-created).
- 🌐 **Translations**: Added missing translations for project themes (`modern`, `nature`, `ocean`, etc.).
- 🔧 **Linting**: Fixed duplicate translation keys in `es.json` and `en.json`.

---

## [2.6.5] - 2025-12-05

### Fixed - Mobile Responsiveness & Cleanup

**Kanban Board Optimization:**
- 📱 **Mobile Layout**: Implemented horizontal scrolling with snap points for better mobile experience.
- 🔍 **Responsive Search**: Search bar and filters now stack vertically on small screens.
- 🎨 **Compact Design**: Reduced padding and card sizes on mobile for better information density.
- 🚫 **Scrollbar**: Hidden default scrollbar on mobile for a cleaner look (`scrollbar-hide`).

**Dashboard Improvements:**
- 👆 **Touch Interactions**: Improved drag handles on `WidgetCard` to be always visible and have larger touch targets on mobile.
- 📱 **Grid Layout**: Optimized `DraggableWidgetGrid` for mobile screens.

**Code Cleanup:**
- 🗑️ **Deprecated Modules**: Removed unused tests and code related to legacy Analytics and Notifications modules.
- 🧪 **Test Fixes**: Resolved failures in `DraggableWidgetGrid` (mock fix) and `NavigationSheet` (disabled state logic).

---

## [2.6.4] - 2025-12-05

### Added - Bills Payment Automation System

**Payment Automation**:
- 💳 **Default Payment Account**: Bills can now have a pre-assigned payment account for quick payments
- ⚡ **Direct Payment**: One-click payment for bills with associated accounts (no modal needed)
- 🤖 **Automatic Debit**: Credit card bills can enable auto-debit (pays 3 days before due date)
- 📅 **Scheduled Payments**: ProcessAutoBills job runs daily at 6:00 AM to process auto-debits

**Database Changes**:
- 📊 **New Fields**: `cuenta_predeterminada_id`, `debito_automatico`, `fecha_autopago` in `transacciones` table
- 🔗 **Relationships**: Added `cuentaPredeterminada()` relationship to Transaccion model
- 📈 **Migration**: `2025_12_05_153815_add_payment_automation_to_transaccions_table.php`

**Backend Implementation**:
- ✅ **Validation**: Updated `StoreTransaccionRequest` with payment automation fields
- 🧮 **Auto-calculation**: `fecha_autopago` calculated automatically (due_date - 3 days) for CC auto-debit
- 🔐 **Security**: Auto-debit restricted to credit cards only
- 🛣️ **New Endpoint**: `POST /mis-proyectos/{proyecto}/transactions/{transaccion}/pay-direct`
- ⏰ **Scheduler**: Registered `ProcessAutoBills` job in `routes/console.php`

**Frontend Implementation**:
- 🎨 **BillModal**: Added account selector dropdown (optional)
- ✅ **Auto-Debit Toggle**: Checkbox appears only for credit card accounts
- 📝 **Conditional UI**: Auto-debit hint shows "Pago automático 3 días antes del vencimiento"
- 🌐 **i18n**: Added 7 translation keys (ES + EN) for payment automation

**Payment Flow Logic** (3 conditional paths):
1. **No account**: Opens TransactionModal (existing behavior)
2. **Has account (non-CC)**: Shows confirmation → Creates payment transaction directly
3. **CC + auto-debit enabled**: Scheduled autopay, shows "Already scheduled" message

**Translation Keys**:
- `finance.default_account`: "Cuenta Predeterminada" / "Default Account"
- `finance.no_account`: "Sin cuenta (pago manual)" / "No account (manual payment)"
- `finance.auto_debit`: "Débito Automático" / "Automatic Debit"
- `finance.auto_debit_hint`: "Pago automático 3 días antes del vencimiento"
- `finance.confirm_direct_payment`: "¿Pagar directamente desde la cuenta asociada?"
- `finance.already_scheduled`: "Pago programado para 3 días antes del vencimiento"
- `finance.scheduled_payment`: "Pago Programado" / "Scheduled Payment"

### Fixed - Chat Real-time Read Status

**Issue**: Messages didn't mark as read until page reload/channel exit  
**Root Cause**: `markAsRead()` waited for `unreadCounts` state update (3s polling delay)  
**Solution**: Removed conditional check - now always calls API immediately when viewing channel

**Implementation**:
- 🔧 **ChatWidget.jsx**: Simplified `markAsRead()` callback to always execute API call
- ⚡ **Immediate Response**: Messages mark as read instantly when channel viewed
- 🔄 **Optimistic Updates**: UI updates immediately, background refresh for consistency

**Files Modified**:
- [ChatWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Project/ChatWidget.jsx#L37-L64) - Removed `hasUnread` check
- [BillModal.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Modals/BillModal.jsx) - Added account selector + auto-debit
- [TransaccionController.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Features/Finanzas/Controllers/TransaccionController.php) - Added `payDirectly()` method
- [StoreTransaccionRequest.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Features/Finanzas/Requests/StoreTransaccionRequest.php) - New validation rules
- [Transaccion.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Models/Transaccion.php) - New fillable fields + relationship
- [ProcessAutoBills.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Jobs/ProcessAutoBills.php) - New scheduled job
- [routes/web.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/routes/web.php) - Added payDirectly route
- [routes/console.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/routes/console.php) - Registered scheduler
- [es.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/es/es.json) + [en.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/en/en.json) - 7 new keys each

**Testing**:
- ✅ Chat messages mark as read without reload
- ✅ Bill creation with account assignment
- ✅ Auto-debit checkbox visible for TC only
- ⏳ Direct payment flow (requires front-end button logic completion)
- ⏳ Scheduled job processing (requires testing after migration)

**Known Limitations**:
- Pay Bill button logic not yet implemented (10 min remaining work)
- `cuentas` prop not yet passed to BillModal in ProjectDashboard
- Migration pending execution

---

## [2.6.3] - 2025-12-05

### Fixed - Mobile UI/UX Hotfixes (QA Round 1) + Follow-up Improvements

**Responsive Design**:
- 📱 **ToggleGroup Component**: Added `flex-wrap gap-2` for mobile responsiveness, preventing button overlapping in narrow viewports
- 🧮 **Financial Calculator - Basic Mode**: Fixed payment terms selector overlapping on mobile by making ToggleGroup responsive
- ✅ **Account Grid**: Verified proper responsive grid configuration (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`)

**Component Refactor**:
- 🎨 **ProjectCard**: Removed unnecessary "..." (EllipsisVerticalIcon) menu button
- ✨ **ProjectCard**: Added missing module icons for Analytics (`ChartBarIcon`), Notifications (`BellIcon`), and Marketplace (`PuzzleIcon`)
- 🔒 **ProjectCard**: Made all module icons non-clickable and informational only (removed hover effects and `group/icon` interactivity)
- 📊 **ProjectCard**: Moved module icons below title row and centered them for better visual coordination
- 🔧 **Module Icons**: All 6 modules (Finance, Tasks, Chat, Analytics, Notifications, Marketplace) now display correctly

**Mobile Header Enhancements**:
- 🔔 **Notification Icon**: Added `NotificationDropdown` to mobile header for parity with desktop
- 📬 **Inbox Icon**: Added `InboxIcon` link with unread count badge to mobile header
- 📲 **Mobile UX**: Users can now access notifications and inbox directly from mobile header

**UX Improvements**:
- 💬 **Inactive Accounts Toggle**: Added comprehensive tooltip system with proper i18n
  - Desktop: Full descriptive tooltip on hover
  - Mobile: Visible explanatory text (no reliance on title attribute which doesn't work on mobile)
  - Text explicitly mentions "cuentas activas/inactivas" for clarity
- ℹ️ **Accessibility**: Mobile users see "Viendo cuentas activas/inactivas" text next to toggle
- 🎨 **Currency Badge**: Moved to separate row below bank name in AccountChart for better organization and no overlapping
- 📍 **Badge Layout**: Currency badge first, then account type and status badges in second row

**Localization**:
- 🌐 **Translation Fix**: Added root-level `invitations` object to `en.json` to match Spanish structure
- ✅ **invitations.title**: Fixed "Invitaciones" not translating to "Invitations" in English mode
- 🔧 **Standardized Keys**: Ensured consistent translation structure between ES (`invitations.title`) and EN (`invitations.title`)
- 📝 **Tooltip Translations**: Added 11 new comprehensive tooltip translation keys with English fallbacks (not Spanish):
  - Account creation: `account_name_hint`, `bank_hint`, `account_type_hint`, `currency_hint`
  - Loan fields: `term_hint`, `installment_hint`, `paid_installments_hint`
  - Credit card: `cutoff_day_hint`, `payment_day_hint`, `due_date_hint`
  - Balance: `bank_balance_hint`, `investment_balance_hint`, `credit_balance_hint`, `loan_balance_hint`
  - Payroll: `payroll_value_hint`
  - Toggle: `toggle_showing_active_hint`, `toggle_showing_inactive_hint`, `toggle_showing_active_mobile`, `toggle_showing_inactive_mobile`

**Code Quality**:
- 🧹 **Console Cleanup**: Removed debug console.log statements from `UpcomingObligationsWidget`
- ✅ **GoalsMode Verification**: Confirmed all strings use translation keys (`t()`), no hardcoded text or default zeros
- 🔐 **i18n Compliance**: All tooltips now use `t()` hook with proper fallbacks (English, not Spanish)

**Components Modified**:
- [ProjectCard.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Project/ProjectCard.jsx) - Icon refactor, repositioning
- [ToggleGroup.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/UI/ToggleGroup.jsx) - Added flex-wrap for mobile
- [AuthenticatedLayout.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Layouts/AuthenticatedLayout.jsx) - Added mobile notification/inbox icons
- [ProjectDashboard.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Pages/Projects/Finance/ProjectDashboard.jsx) - Toggle with visible mobile text
- [AccountChart.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/AccountChart.jsx) - Reorganized badge layout
- [AccountModal.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Modals/AccountModal.jsx) - Added 15 field tooltips
- [UpcomingObligationsWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/UpcomingObligationsWidget.jsx) - Removed console.log
- [en.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/en/en.json) - Added invitations + 15 tooltip translations
- [es.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/es/es.json) - Added 15 tooltip translations
- [GoalsMode.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Pages/Tools/Partials/GoalsMode.jsx) - Verified (no changes needed)

**Testing**:
- 🧪 Manual verification required in mobile viewports (<768px)
- ✅ All components using `t()` translation function
- ✅ No hardcoded strings or default zero values
- ✅ Tooltips work on all account types (banco, efectivo, credito, prestamo, inversion)

---


## [2.6.2] - 2025-12-05 00:26:00 -05:00

### Fixed - Account Architecture & UI

**Account Ownership Refactor:**
- 🏗️ **Architecture Change**: Personal accounts are now User-owned (`propietario_type = 'usuario'`) instead of Project-owned, with auto-linking to Personal Finance projects via the `cuenta_proyecto` pivot table.
- 🔗 **Auto-Link Logic**: Accounts created in Personal Finance projects are automatically linked to the project upon creation.
- 🔍 **Account Visibility**: Updated `FinanzasPersonalesController::cuentas` to return both owned and linked accounts, fixing the "0 accounts" bug.
- ✅ **Test Updates**: Updated `PersonalFinanceApiTest` to expect morph alias `'usuario'` instead of full class name, and added test for auto-link behavior.

**Transaction Widget Fix:**
- 🎨 **Income Display**: Fixed bug where income transactions displayed in red with negative values. Now uses dual detection (category type OR monto sign) to correctly identify income vs expense.
- ✅ **Icon Consistency**: Updated both icon and amount display logic to use the same income detection method.

**UI/UX Improvements:**
- 🔒 **Personal Project Protection**: Hidden "Project Settings" from Sidebar and BottomNavigation for personal finance projects (non-editable).

### Changed - Backend

**Files Modified:**
- [CuentaController.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Http/Controllers/Api/CuentaController.php) - Updated `index`, `store`, `verificarCuenta`, and `balance` to support User-owned accounts and pivot-based linking
- [FinanzasPersonalesController.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Http/Controllers/Api/FinanzasPersonalesController.php) - Fixed `cuentas` method to merge owned and linked accounts
- [PersonalFinanceApiTest.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/tests/Feature/Modules/Finance/PersonalFinanceApiTest.php) - Updated to use `'usuario'` morph alias and added auto-link test

### Changed - Frontend

**Files Modified:**
- [TransactionsWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/TransactionsWidget.jsx) - Fixed income detection and display logic
- [Sidebar.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Sidebar.jsx) - Hidden settings for personal projects
- [NavigationSheet.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/NavigationSheet.jsx) - Hidden settings for personal projects

---

## [2.6.0] - 2025-12-04 19:30:00 -05:00

## [2.6.1] - 2025-12-04 20:15:00 -05:00

### Fixed - Critical Logic & UI

**Account Management:**
- 🐛 **Admin Account Linking**: Fixed logic to allow Project Admins to see and link **BOTH** their own personal accounts AND the Project Owner's accounts (previously was exclusive or broken).
- 🛡️ **Safe Deletion**: Enforced strict rule that accounts must have **0 balance** to be deleted. Added backend validation and frontend UI blocking/warnings.
- 💰 **Payroll Logic**: Fixed bug where `valor_nomina` (estimated future value) was incorrectly added to the initial account balance. Now `saldo_actual` starts strictly equal to `saldo_inicial`.

**Transactions UI:**
- 🎨 **Color Coding**: Fixed regression where income transactions were not displaying in green.
- 📱 **Mobile Layout**: Fixed overlapping issues in transaction rows on small screens by preventing flex item compression (`shrink-0`).

### Added - Collaborative Finance Features

**Account Owner Visual Differentiation:**
- 👥 **Owner Identification System**: Implemented comprehensive visual system to differentiate account owners in collaborative projects
- 🎨 **Color-Coded Badges**: 8 distinct color palettes automatically assigned to owners for easy identification
- 📊 **AccountChart Enhancement**: Account cards now display owner badges with initials + first name (e.g., "JP Juan")
- 💸 **TransactionsWidget Enhancement**: Transaction rows show owner initials badges next to account names
- 🔄 **Smart Display**: Badges only appear in collaborative projects (`!proyecto.es_personal`), hidden in personal finance
- 🛠️ **Owner Utilities**: Created `ownerHelpers.js` with functions for color generation, name extraction, initials, and contribution calculations
- 🌐 **Translations**: Added `finance.owner` key in both ES and EN

**AccountFlowWidget - Income/Expense Visualization:**
- 📈 **New Widget**: Created dedicated widget showing income and expense distribution by account using pie charts
- 🥧 **Dual Pie Charts**: Separate donut charts for income (green tones) and expenses (red tones)
- 💎 **3D Effects**: SVG shadow filters (`feGaussianBlur` + `feOffset`) for professional depth
- 🎨 **Smart Coloring**: Uses owner colors in collaborative projects, standard palettes in personal projects
- 📊 **Interactive Legend**: Shows account names, owner badges, and amounts with tooltips
- 💯 **Percentage Labels**: Fixed NaN% bug, displays accurate percentages on chart slices
- 🎯 **Dashboard Integration**: Positioned after FinancialChartsWidget, before TransactionsWidget
- ⚙️ **Configurable**: Added to DashboardSettingsModal as toggle settings
- 🌐 **Translations**: Added `finance.account_flow`, `finance.income_by_account`, `finance.expense_by_account`, `finance.net_flow`

### Changed - Backend & Frontend Updates

**Backend:**
- 🔧 **ProyectoUiWebController**: Added eager-loading of `propietario` relationship for `cuentas` and `cuentasAsociadas`
- 🔧 **Transaction Loading**: Added `cuenta.propietario` to transaction eager-loading

**Frontend Components:**
- 🎨 **Theme Consistency**: AccountFlowWidget matches FinancialChartsWidget styling (dark tooltips, consistent borders, rounded corners)
- 🚫 **Removed Emojis**: Replaced hardcoded emojis with proper SVG icons (`ChartBarIcon`)
- 📱 **Responsive Design**: Grid layout adapts (2 columns desktop, 1 column mobile)
- 🌙 **Dark Mode**: Full dark mode support with appropriate color adjustments

### Fixed

**Build & Code Quality:**
- 🐛 **Icon Import**: Fixed missing `ChartPieIcon` - changed to existing `ChartBarIcon`
- 🐛 **Duplicate Key**: Removed duplicate `proyecto_id` in QuickTransactionModal useForm initialization
- ✅ **Build Status**: All builds passing without errors
- ✅ **Scheduled Transactions**: Added backend tests verifying pending/completed transaction logic and balance updates.
- ✅ **QuickTransactionModal**: Fixed accessibility issues and updated tests to match component logic.
- ✅ **Validation**: Fixed `UpdateTransaccionRequest` to correctly validate accounts owned by the user (not just project-owned).
- 🐛 **TaskController**: Fixed undefined `$request` variable in `destroy` method by injecting `Request` dependency.
- 🔧 **CI/CD**: Fixed `setup-node` failure by adding `pnpm/action-setup` step to install PNPM before Node caching configuration.
- 🐳 **Docker**: Updated `Dockerfile` to use `pnpm` for frontend build stage, replacing `npm ci` with `pnpm install --frozen-lockfile`.

**Components Modified:**
- [ProyectoUiWebController.php](file:///home/guarox/Documentos/proyectos-personales/controlApp/app/Http/Controllers/ProyectoUiWebController.php)
- [ownerHelpers.js](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Utils/ownerHelpers.js) (NEW)
- [AccountChart.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/AccountChart.jsx)
- [TransactionsWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/TransactionsWidget.jsx)
- [AccountFlowWidget.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Widgets/AccountFlowWidget.jsx) (NEW)
- [ProjectDashboard.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Pages/Projects/Finance/ProjectDashboard.jsx)
- [DashboardSettingsModal.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Modals/DashboardSettingsModal.jsx)
- [QuickTransactionModal.jsx](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/js/Components/Finance/Modals/QuickTransactionModal.jsx)
- [es.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/es/es.json), [en.json](file:///home/guarox/Documentos/proyectos-personales/controlApp/resources/lang/en/en.json)

---

## [2.5.1] - 2025-12-04 17:40:00 -05:00

### Added - Bill Management Refactoring

**Dedicated Bill Workflow:**
- ✨ **BillModal**: Created a dedicated modal (`BillModal.jsx`) for creating and editing pending bills, separating this logic from standard transactions.
- 🔧 **BillsWidget**: Refactored to handle "Add", "Edit", "Pay", and "Delete" actions directly, delegating to parent dashboard handlers.
- 🛣️ **Routes**: Added `finance.transactions.store` and `finance.transactions.update` named routes in `web.php` for clearer API usage.

### Fixed - Transaction & UI Improvements

**UI/UX Fixes:**
- 🐛 **QuickTransactionModal**: Removed the "Bill" tab to streamline the modal for Income/Expense only.
- ⚡ **Auto-Fill Description**: Selecting a category in `QuickTransactionModal` now auto-fills the description (except for "Other").
- 🗑️ **TransactionsWidget**: Removed the redundant "Rápido" (Quick) button.
- 🐛 **MethodNotAllowed Error**: Fixed 405 error when editing transactions/bills by ensuring correct PUT routes are defined and used.
- 🎨 **Styling**: Standardized button styles (using `PrimaryButton`) across widgets.

---

## [2.5.0] - 2025-12-04 14:30:00 -05:00

### Added - Multi-Currency System

**Currency Standardization:**
- 💱 **Centralized Currency Utilities**: Created `currencyHelpers.js` with standardized formatting for 19+ currencies.
- 🌍 **Proper Currency Symbols**: Each currency now displays its correct symbol ($ for USD/COP, € for EUR, £ for GBP, etc.).
- 📍 **Locale-Aware Formatting**: Automatic locale detection and number formatting per currency (e.g., COP uses Colombian formatting).
- 🔢 **Smart Decimals**: Currencies without decimals (COP, JPY, KRW, CLP) show whole numbers, others show 2 decimals.
- 🎨 **Color-Coded Balances**: Green for positive, red for negative balances across all widgets.

**Components Updated (13 total):**
- ✅ `AnalyticsWidget` - Trend charts with proper currency formatting
- ✅ `FinanceWidget` - Balance display without module icon, badge repositioned
- ✅ `UpcomingObligationsWidget` - Obligations with correct currency symbols
- ✅ `BalanceSummaryWidget` - Assets/liabilities/net worth with color coding
- ✅ `SavingsGoalWidget` - Goal progress with proper formatting
- ✅ `CreditSimulationWidget` - Loan calculations with correct symbols
- ✅ `TransactionsWidget` - Transaction list with standardized display
- ✅ `AccountChart` - Pie chart with proper currency labels
- ✅ `FinancialChartsWidget` - All charts use centralized formatting
- ✅ `PersonalDashboard` - Dashboard overview with consistent currency display

### Enhanced - Project Card UI

**Visual Improvements:**
- 🎨 **Header Layout**: Icon/image now displays beside title (row layout) instead of above, with top alignment
- 🏷️ **Module Badges**: Dynamic counters for chat (red) and tasks (orange) with pulse animations
- 💰 **Balance Display**: 
  - Removed CurrencyDollar icon for cleaner look
  - Green/red color coding for positive/negative balances
  - Currency badge below balance, aligned left with project colors
- ✨ **Maintained**: All original styling, project colors, transition effects, and functionality

**Technical Details:**
- Files: `currencyHelpers.js`, `ProjectCard.jsx`, `FinanceWidget.jsx`, 11 financial widgets
- Functions: `getCurrencySymbol()`, `getCurrencyLocale()`, `shouldShowDecimals()`, `formatCurrency()`
- Future-ready for multi-currency conversion system

---

## [2.4.0] - 2025-12-04 04:20:00 -05:00

### Added - Scheduled Transactions (Bills)

**Major Feature:**
- ✨ **Scheduled Transactions**: Added support for pending/scheduled transactions (bills) with recurrence capabilities.
- 📅 **Transaction Status**: Transactions now have `status` field (`completed`, `pending`, `cancelled`).
- 🔄 **Recurring Transactions**: Support for recurring bills (daily/weekly/biweekly/monthly/yearly).
- 📊 **Database Schema**: Added `status`, `is_recurring`, `recurrence_interval`, `recurrence_day`, `next_occurrence` to `transacciones` table.
- 🔔 **Obligation Tracking**: Pending transactions appear in `UpcomingObligationsWidget` with "Mark as Paid" functionality.
- 🎯 **Alert System**: Visual indicators for upcoming bills based on due date proximity.

### Fixed - Currency Display

**Critical Fixes:**
- 🐛 **Currency Conversion**: Fixed "inflated values" across all financial widgets by correctly dividing backend cents by 100.
- 💱 **Dynamic Decimals**: Implemented currency-aware decimal formatting (0 decimals for COP/MXN, 2 for USD/EUR).
- 🎨 **Widget Consistency**: Updated all financial widgets (`BalanceSummaryWidget`, `TransactionsWidget`, `FinancialChartsWidget`, etc.) to use consistent formatting.

### Enhanced - Upcoming Obligations Widget

**UI/UX Improvements:**
- 🎨 **Compact Layout**: Reduced height and padding, optimized for density.
- 📜 **Scrollbar**: Added scrollbar with max-height (~8 items visible), removed 5-item limit.
- 🏷️ **Color Coding**: Removed text badges, now uses green (income) and red (expense) visual indicators.
- 🏦 **Account Context**: Added account name display in subtitles for all obligation types.
- 🔍 **Task Categories**: Shows specific task category names (e.g., "Personal", "Business") instead of generic "Task".
- 👆 **Clickable Rows**: Prepared for future calendar integration with click handlers.

**Technical Details:**
- Components: `UpcomingObligationsWidget.jsx`, `TransactionsWidget.jsx`, `BalanceSummaryWidget.jsx`, `FinancialChartsWidget.jsx`
- Migration: `2025_12_04_041955_add_status_and_recurrence_to_transacciones_table.php`
- Documentation: Updated `FRONTEND.md` with currency handling strategy

---

## [2.3.4] - 2025-12-04 01:30:00 -05:00

### Fixed - Account Management

**Critical Bug Fixes:**
- 🐛- **Account Creation Validation**: Fixed issue where payroll validation rules were applied to non-payroll accounts, preventing creation.
- **Currency Display**: Fixed bug where currency values were multiplied by 100 in account cards and widgets (missing cents division).
- **Upcoming Obligations**: Fixed widget to correctly include credit card cut-offs and loan payments (corrected field names and logic).
- **Input Field Reset**: Fixed issue where input fields in `AccountAdminModal` were not resetting correctly when switching accounts.
- **Delete Modal Hang**: Fixed issue where the delete account modal would hang or crash after successful deletion.
- **False Positive Deletion Error**: Fixed issue where a successful deletion (204 No Content) was interpreted as a failure.
- **Unlink 404 Error**: Fixed 404 error when unlinking accounts by ensuring the correct route and parameters are used.
- **Delete Modal Focus Trap**: Fixed focus trap issue in `DeleteAccountModal` preventing interaction with other elements.
- **ReferenceError Fix**: Resolved `ReferenceError: onSuccess is not defined` in `DeleteAccountModal`. and added a slight delay to `router.reload` to ensure smooth modal closing.
- ♻️ **Modal Architecture:** Improved modal state management by passing `onDelete` callbacks and handling success states more cleanly.

---

## [2.3.3] - 2025-12-03 19:05:00 -05:00

### Added - Multiple Payroll Dates

**Payroll Enhancement:**
- ✨ **Multiple Payment Dates:** Payroll accounts can now have multiple payment dates per month (e.g., biweekly: 15th and 30th).
- 🎨 **Multi-Select UI:** Replaced single day input with interactive 7x5 grid for selecting 1-4 payment days.
- 📊 **Database Schema:** Changed `dia_nomina` from `integer` to `json` array with automatic data migration.
- 📅 **Widget Enhancement:** `UpcomingObligationsWidget` now generates separate events for each payroll date.
- 🔢 **Display:** `AccountChart` shows all payroll days as comma-separated list.

**Technical Details:**
- Migration: `modify_dia_nomina_to_json_in_cuentas_table` with bidirectional data migration
- Validation: Array of 1-4 distinct integers between 1-31
- Frontend: Multi-select button grid with primary color highlighting for selected days

---

## [2.3.2] - 2025-12-03 18:58:00 -05:00

### Added - Finance Module Enhancements

**Payroll Account Feature:**
- ✨ **Payroll Accounts:** Added ability to mark savings accounts as payroll accounts with payment day and estimated amount.
- 📊 **Database Fields:** Added `es_nomina` (boolean), `dia_nomina` (integer), and `valor_nomina` (bigInteger) to `cuentas` table.
- 🎨 **UI Integration:** Updated `AccountModal` to support payroll account inputs with conditional visibility.
- 📅 **Upcoming Obligations:** Enhanced widget to display both income (payroll) and expenses (loans, credit cards) with color coding.

**Account Deletion System:**
- 🗑️ **Secure Deletion Modal:** Implemented `DeleteAccountModal` requiring users to type account name for confirmation.
- 🔒 **Smart Validation:** Modal displays transaction count and warns users about data loss.
- 🛡️ **Backend Safety:** Controller checks account ownership and manually deletes transactions before account deletion.
- 🚨 **Error Display:** Added backend error visualization in modal for constraint violations and validation errors.
- 🔗 **Route Integration:** Added `finance.accounts.destroy` route with proper authorization.

**Account Information Display:**
- 💳 **Enhanced Account Cards:** Added detailed information display based on account type:
  - Credit Cards: Credit limit, available credit, payment date, interest rate
  - Loans: Total amount, monthly payment, remaining installments, interest rate
  - Investments: Maturity date, expected return rate
  - Payroll: Payment day, estimated amount
- 🎨 **Type Badges:** Added visual badges for account types with appropriate icons.
- 🌈 **Color Coding:** Implemented color-coded balance display (green for positive, red for negative).

### Fixed - Navigation & UX

**Project Context Navigation:**
- 🐛 **Sidebar/BottomBar Fix:** Fixed navigation links incorrectly pointing to Personal Finance instead of Project Finance.
- 🔧 **Layout Integration:** Added missing `project` prop to `AuthenticatedLayout` in `ProjectDashboard`.
- 📱 **Mobile Navigation:** Corrected BottomNavigation to properly detect project context and show correct finance links.

**UI/UX Improvements:**
- 🎯 **Action Button Encapsulation:** Moved edit/delete buttons inside `AccountChart` component for better modularity.
- 🔄 **State Management:** Improved modal state handling for account deletion workflow.
- 📝 **Translation Keys:** Added Spanish and English translations for all new features.

**Dashboard Settings:**
- ⚙️ **Settings Icon:** Styled settings button with proper theme-aware colors.
- 🔧 **Widget Toggle:** Fixed "Mostrar Inactivas" (Show Inactive) text and functionality.

### Changed - Architecture

**Component Refactoring:**
- ♻️ **AccountChart Props:** Added `onEdit` and `onDelete` props for better event handling.
- 🏗️ **Separation of Concerns:** Removed action button overlays from `ProjectDashboard` in favor of component encapsulation.
- 🎨 **Icon Exports:** Added `BanknotesIcon`, `CreditCardIcon`, and `ExclamationTriangleIcon` to Icons component.

**Database Schema:**
- 📊 **Loan Fields:** Added missing `plazo`, `valor_cuota`, and `cuotas_pagadas` columns for loan accounts.
- 💰 **Payroll Fields:** Extended schema to support payroll account functionality.

### Technical Details

**Routes Added:**
- `DELETE /mis-proyectos/{proyecto}/accounts/{account}` - Delete project account
- `DELETE /mis-proyectos/{proyecto}/accounts/{account}/unlink` - Unlink shared account

**Components Modified:**
- `ProjectDashboard.jsx` - Added project prop, integrated deletion modal
- `AccountChart.jsx` - Encapsulated action buttons, added detailed info display
- `AccountModal.jsx` - Added payroll account inputs, improved validation
- `UpcomingObligationsWidget.jsx` - Added income/expense differentiation
- `DeleteAccountModal.jsx` - New component for secure account deletion

**Controllers Modified:**
- `ProjectAccountUiWebController.php` - Added `destroy` and `unlink` methods
- `ProyectoUiWebController.php` - Enhanced finance dashboard data loading

**Migrations:**
- `add_payroll_fields_to_cuentas_table.php` - Payroll account support
- `add_missing_loan_fields_to_cuentas_table.php` - Loan account completion

---

## [2.3.1] - 2025-12-03

### Fixed - Finance Module

**Account Creation System:**
- 🐛 **Database Schema:** Changed `tipo` column from ENUM to VARCHAR(20) to support all 6 account types (efectivo, banco, credito, inversion, prestamo, otro).
- 🐛 **Missing Fields:** Added `moneda` (currency) field with 8 currency support (COP, USD, EUR, MXN, PEN, CLP, ARS, BRL).
- 🐛 **Credit Cards & Loans:** Added missing `fecha_vencimiento` field for credit cards and loans.
- 🐛 **Inertia Response:** Fixed controller to return `back()` instead of JSON for proper Inertia integration.
- 🐛 **State Sync:** Fixed PersonalDashboard to sync local state when accounts are created.
- 🐛 **Chart Warnings:** Eliminated Recharts dimension warnings by using fixed heights.

**Currency Refactoring:**
- ♻️ **Architecture:** Currency is now at account level (not project level) - each account can have its own currency.
- ♻️ **Project Settings:** Made `moneda_default` optional, expanded to 8 currencies.
- 🎨 **UX:** Removed confusing '0.00' default values from account form.

**Dependencies:**
- ➕ Added `doctrine/dbal` for database schema modifications.

**Important Note:**
- ⚠️ Always use `./vendor/bin/sail artisan` with Laravel Sail (not raw `php artisan`) as database host `mysql` is only resolvable inside Docker containers.

---

## [2.3.0] - 2025-12-03

### Added - Testing & QA (Phase 7)

**Verification:**
- ✅ **Full Regression Testing:** 280 backend tests passing.
- ✅ **New Module Tests:** Added comprehensive tests for Analytics, Notifications, Marketplace, and Tasks modules.
- ✅ **Bug Fixes:** Resolved regression issues in NotificationService and ProjectAccount routes.
- ✅ **Login Stability:** Fixed race condition where users saw "Email not verified" error immediately after verification due to DB lag. Added smart retry logic.
- ✅ **Project Creation:** Fixed missing modules (Analytics, Notifications) in project creation form and enabled Tasks module selection.
- ✅ **Frontend Stability:** Resolved React Error #31 by correcting translation keys for Analytics and Notifications modules to prevent object rendering crashes.
- ✅ **API Routing:** Fixed missing Ziggy routes for Notifications and Analytics modules, ensuring correct API communication from the frontend.
- ✅ **Database Schema:** Resolved 500 Internal Server Error on notifications endpoint by running missing migrations in the Sail environment.
- ✅ **Notification API:** Updated `NotificationController` to return `unread_count` in response meta, fixing frontend `TypeError`.
- ✅ **Project Creation:** Restored "Template" vs "Custom" mode in project creation. Added templates for "Personal Finance", "Team Collaboration", and "Full Suite".
- ✅ **Localization:** Removed hardcoded text in `CreateProject.jsx` and updated `es.json` with new keys for templates and UI elements.

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
