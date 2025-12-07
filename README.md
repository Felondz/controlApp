# 🎯 ControlApp: Collaborative Project Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel** and **React**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## 📈 Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Backend Tests** | 284 / 284 | ✅ **100% Stable** |
| **Frontend Tests** | 217 tests / 39 files | ✅ **100% Coverage** |
| **Total Tests** | 501 tests | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Backend Version** | v2.6.6 (UI/UX Refinements + Widget Fixes) | ✅ **Stable** |
| **Frontend Status** | ✅ Stable & Tested | 🔄 **Active Development** |

[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests%20(Develop)&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)

---

## 🛠️ Technology Stack (Demonstrated Skills)

ControlApp employs a **Modular Event-Driven Architecture**, ensuring strict separation of concerns and scalability.
 
 ### 🏗️ Modular Architecture (Core)
 - **Modules**: Independent units (Finance, Tasks, Chat) located in `app/Modules/`.
 - **Communication**: Strictly via **Event Bus** (`ModuleEventBus`). No direct dependencies between modules.
 - **Registry**: Automatic module discovery and dependency resolution via `ModuleRegistry`.
 - **Scalability**: New features are added as isolated modules without modifying the core.

### Backend (API REST)
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Laravel 12 (PHP 8.2+) | Expertise in MVC, Eloquent ORM, and modern PHP development. |
| **Authentication** | Laravel Sanctum | Implementation of **stateless JWT-style API tokens** and session management. |
| **Authorization** | Policies & Gates | **Granular access control** (e.g., Owner, Admin, Member) and **SuperAdmin** readiness. |
| **Input Security** | Form Requests | Strict input validation, data sanitization, and **Rate Limiting** (5 req/min on Auth). |
| **Testing** | PHPUnit | Deep understanding of testing architecture, **RefreshDatabase** isolation, and full test suite maintenance. |
| **Search** | Meilisearch + Scout | Fast, relevant, and secure full-text search implementation. |
| **PDF Export** | DomPDF + HTML2Canvas | High-quality PDF generation for financial reports and amortization schedules. |

### Frontend (Web/Mobile Readiness)
| Component | Technology | Status |
| :--- | :--- | :--- |
| **Framework** | React 18 + Inertia.js | ✅ **Active** |
| **Tooling** | Vite | ✅ **Configured** |
| **Localization (i18n)** | i18next + Custom Hook | ✅ **Implemented** |
| **UI/UX** | Tailwind CSS + React Components | ✅ **Standardized (Dark Mode Support)** |

---

## 🚀 Key Features

- **Project Management**:
  - Creation and administration of projects.
  - **NEW**: Custom themes (colors) and typography per project.
  - **NEW**: Customizable cover images for each project.
  - Member invitation and role management.
  - **NEW**: Dashboard with active module indicators.

- **Communication & Inbox (NEW)**:
  - **Inbox**: Centralized dropdown and page for unread messages.
  - **Chat**: Real-time project chat with private messaging support.
  - **Notifications**: Visual badges for unread messages.

- **Tasks Management**:
  - **Kanban Board**: Interactive drag-and-drop board.
  - **Task Tracking**: Status, Priority, Due Dates, and Assignees.
  - **Financial Tasks**: Mark tasks as financial obligations with amount and category.
  - **Payment Confirmation**: Mark financial tasks as paid directly from Finance dashboard.
  - **Integration**: Seamlessly integrated with Projects and Finance modules.

- **Financial Tools**:
  - **Financial Calculator**: Advanced loan and amortization calculator.
  - **Modes**: Basic (quick calculation) and Advanced (detailed breakdown with insurance).
  - **Export**: Generate professional PDF reports with amortization charts.
  - **Visualizations**: Interactive charts for principal vs. interest analysis.
  - **API**: RESTful endpoints for tool management (`GET /api/tools`, `POST /api/tools/toggle`).

- **Finance Management**:
  - **Accounts**: Create and manage 6 types of accounts (cash, bank, credit, investment, loan, other).
  - **Multi-Currency**: Support for 8 currencies (COP, USD, EUR, MXN, PEN, CLP, ARS, BRL) - each account can have its own currency.
  - **Payroll Accounts**: Mark bank accounts as payroll accounts with payment day and estimated amount.
  - **Enhanced Account Cards**: Display detailed information based on account type:
    - Credit Cards: Limit, available credit, payment date, interest rate
    - Loans: Total amount, monthly payment, remaining installments, interest rate
    - Investments: Maturity date, expected return rate
    - Payroll: Payment day, estimated amount
  - **Secure Deletion**: Delete accounts with confirmation modal requiring account name typing.
  - **Scheduled Transactions (Bills)**: Create pending/scheduled transactions with recurrence support (daily/weekly/monthly/yearly).
  - **Transaction Status**: Track transactions as `completed`, `pending`, or `cancelled`.
  - **Transaction Tracking**: Record income and expenses per account with categorization.
  - **Financial Dashboard**: Visualize balances, cash flow charts, and upcoming obligations.
  - **Upcoming Obligations Widget**: 
    - View income (payroll) and expenses (loans, credit cards, pending bills) with color coding.
    - "Mark as Paid" functionality for pending transactions.
    - Alert indicators based on due date proximity.
    - Scrollable view showing all upcoming obligations.
  - **Owner Visual Differentiation** (Collaborative Projects):
    - **8 Color-Coded Badges**: Automatically assigned to each account owner for easy identification.
    - **Account Cards**: Display owner badges with initials + first name (e.g., "JP Juan").
    - **Transaction Rows**: Show owner initials next to account names.
    - **Smart Display**: Only visible in collaborative projects, hidden in personal finance.
  - **AccountFlowWidget** (Income/Expense Visualization):
    - **Dual Pie Charts**: Separate donut charts for income (green) and expenses (red).
    - **3D Effects**: Professional SVG shadow filters for depth.
    - **Owner Colors**: Uses owner palettes in collaborative projects.
    - **Interactive Legend**: Shows account names, owner badges, and amounts.
    - **Dashboard Integration**: Positioned after cash flow charts, configurable via settings.

## ✨ Características Principales

### 🏗️ Arquitectura Modular (v2.0.0)

- **Sistema de Módulos**
  - Auto-discovery de módulos desde `app/Modules/`
  - Resolución automática de dependencias
  - Lifecycle hooks (install/uninstall)
  - Configuración granular por proyecto

- **Event Bus**
  - Comunicación inter-módulo vía eventos
  - Soporte para wildcards (`tasks.*`, `finance.*`)
  - Ejecución async opcional
  - Logging de eventos para debugging

- **Plantillas de Proyecto**
  - Freelancer: Finance + Tasks
  - Startup: Finance + Tasks + Chat
  - Enterprise: Todos los módulos
  - Custom: Configuración manual

### 💰 Módulo Finance

- **Gestión Financiera Completa**
  - Múltiples cuentas bancarias
  - Categorías personalizables (8 por defecto)
  - Transacciones con filtros avanzados
  - Integración con tareas financieras

- **Eventos Finance**
  - `finance.transaction.created/updated/deleted`
  - `finance.account.balance_low`

### ✅ Módulo Tasks

- **Gestión de Tareas**
  - Tablero Kanban
  - Prioridades y fechas de vencimiento
  - Asignación de tareas
  - Tareas financieras con montos

- **Eventos Tasks**
  - `tasks.task.created/completed`
  - `tasks.financial_task.created`

### 💬 Chat en Tiempo Realt analysis.
- **Personal & Project Finance**:
  - Income and expense tracking.
  - Bank account and cash management.
  - Budgets and savings goals.
  - **NEW**: Financial Charts (Cash Flow Analysis).
  - **NEW**: Direct access to Personal Finance from Global Sidebar.

- **User Profile**:
  - Personal information management.
  - **NEW**: Profile photo upload and management.
  - Global theme preferences (Light/Dark/Custom).

- **Modern Interface**:
  - Responsive and adaptive design.
  - Full support for **Dark Mode**.
  - Internationalization (Spanish/English).

---

## 🧪 Testing

ControlApp maintains comprehensive test coverage to ensure code quality and reliability:

- **Backend Tests**: 100% coverage with PHPUnit
  - Feature tests for all API endpoints
  - **NEW**: `ChatSystemTest` for real-time messaging and online status
  - Unit tests for business logic
  - Database integration tests
  
- **Frontend Tests**: 100% Component Coverage
| **Frontend** | Vitest + React Testing Library | **217 tests / 39 files** |
| **Coverage** | Component Coverage | **100% (39/39 test files)** |
| **E2E** | Laravel Dusk | **Pending** |
  - Unit tests for core UI components
  - Integration tests for complex features
  - Automated CI/CD validation
  - **Missing tests**: None

Run tests locally:
```bash
# Backend tests
./vendor/bin/sail test

# Frontend tests
pnpm test

# CI mode (both)
pnpm test:ci
```

---

## 💡 Best Practices and Architectural Highlights

### 1. Robust Testing Architecture (QA)
* **100% Isolation**: All feature tests utilize the `RefreshDatabase` trait to ensure **zero data contamination** between individual tests.
* **Full Coverage**: All critical API endpoints (Auth, CRUD operations) are covered by automated tests.

### 2. Security & Data Integrity
* **Authorization Layer**: Access control logic is centralized in **Laravel Policies** (demonstrating the Open/Closed Principle), making security easy to audit and maintain.
* **Database Schema**: Use of **Soft Deletes** (`deleted_at`) for non-critical models to ensure data recovery and historical integrity.
* **Data Flow**: Use of **Observers** (e.g., `TransaccionObserver`) to automatically synchronize related data (like account balances) on model changes, maintaining data consistency.

### 3. CI/CD Pipeline
* **Continuous Integration**: The `tests.yml` workflow runs all tests on every *push* to the `develop` branch, acting as a mandatory quality gate.
* **Controlled Deployment**: Deployment to the Homelab/Production environment is restricted to the **`main`** branch (`deploy.yml`), enforcing stability.

---

## 📚 Documentation

> **Security Note**: Detailed technical documentation is only shared with verified collaborators.

Complete documentation is available in **English** and **Spanish**:

| Language | Link | Contents |
| :--- | :--- | :--- |
| 🇬🇧 **English** | [`/docs/private/en/`](./docs/private/en/01-core/INDEX.md) | Installation, API Reference, Architecture, Testing, and Development Guides |
| 🇪🇸 **Spanish** | [`/docs/private/es/`](./docs/private/es/01-core/INDEX.md) | Instalación, Referencia de API, Arquitectura, Testing y Guías de Desarrollo |

### Quick Navigation

**For Developers:**
- ✅ [Installation Guide](./docs/private/en/02-development/INSTALLATION.md) (English)
- ✅ [Guía de Instalación](./docs/private/es/02-development/INSTALLATION.md) (Spanish)
- 📖 [API Documentation](./docs/private/en/02-development/API.md) (English)
- 📖 [Documentación de API](./docs/private/es/02-development/API.md) (Spanish)

**For QA & Testing:**
- 🧪 [Testing Architecture](./docs/private/en/04-testing/TESTING_ARCHITECTURE.md) (English)
- 🧪 [Arquitectura de Testing](./docs/private/es/04-testing/TESTING_ARCHITECTURE.md) (Spanish)
- 🏗️ [Arquitectura Modular](./docs/private/es/01-core/MODULES_ARCHITECTURE.md) (Spanish)

---

## ⚙️ Local Installation Guide (for Reviewers)

The project is easily runnable using Docker and Laravel Sail.

### Prerequisites
* Docker and Docker Compose (or Docker Desktop)
* Git
* **PNPM** (Required - see below)

### Package Manager Requirement

> **IMPORTANT**: This project exclusively uses **PNPM** for security reasons. Do NOT use `npm` or `yarn`.

```bash
# Install PNPM globally (if not already installed)
npm install -g pnpm

# Verify installation
pnpm --version
```

### Setup Steps
1.  **Clone Repository:**
    ```bash
    git clone https://github.com/Felondz/controlApp.git
    cd controlApp
    ```
2.  **Configure Environment:**
    ```bash
    cp .env.example .env
    # Start the containers (App, MySQL, Redis, Mailpit)
    ./vendor/bin/sail up -d
    ```
3.  **Install Dependencies and Run Migrations:**
    ```bash
    # Install PHP dependencies inside the container
    ./vendor/bin/sail composer install

    # Run Migrations and Seeders
    ./vendor/bin/sail artisan migrate --seed
    ```
4.  **Verify Quality Gate:**
    ```bash
    # This must return 240 tests passing with a green output.
    ./vendor/bin/sail test
    ```
* **Application URL**: `http://localhost`