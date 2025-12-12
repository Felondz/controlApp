# ControlApp: Collaborative Project Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel 12** and **React 18**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Backend Tests** | 284 / 284 | ✅ **100% Stable** |
| **Frontend Tests** | 217 tests / 39 files | ✅ **100% Coverage** |
| **Total Tests** | 501 tests | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Backend Version** | v2.8.0 (Modular Architecture) | ✅ **Stable** |
| **Frontend Status** | ✅ Stable & Tested | 🔄 **Active Development** |

[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests%20(Develop)&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)

---

## Technology Stack (Demonstrated Skills)

ControlApp employs a **Modular Event-Driven Architecture**, ensuring strict separation of concerns and scalability.

### Modular Architecture (Core)
- **Modules**: Independent units (Finance, Tasks, Chat) located in `app/Modules/`.
- **Communication**: Strictly via **Event Bus** (`ModuleEventBus`). **Zero direct coupling** between modules.
- **Registry**: Automatic module discovery and dependency resolution via `ModuleRegistry`.
- **Scalability**: New features are added as isolated modules without modifying the core system.

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

## Key Features

### Project Management
- **Creation & Admin**: Manage projects with custom settings.
- **Customization (NEW)**: Per-project themes (colors, typography) and cover images.
- **Team Management**: Invite members via email, manage roles/permissions.
- **Dashboard**: Centralized view with active module indicators and quick stats.

### Tasks Management (Kanban)
- **Kanban Board**: Interactive drag-and-drop board for task workflow.
- **Task Tracking**: Assignees, priorities, due dates, and status tracking.
- **Financial Integration**: Create financial tasks with monetary values.
- **Audit**: Automatic logging of task completion events.

### Finance Management
- **Accounts**: Manage 6 account types (Cash, Bank, Credit, Investment, Loan, Other).
- **Multi-Currency Global**: Support for 8 currencies (USD, COP, EUR, etc.) per account.
- **Credit Card Management**: Track billing cycles, cutoff dates, and minimum payments (Debt as negative).
- **Loans & Investments**:
    - **Amortization**: Automatic calculation of installments.
    - **Interest Accrual**: Daily jobs for calculating monthly interest yields.
    - **CDT Protection**: Withdrawal locks until maturity date.
- **Recurring Bills**: Schedule payments (daily/weekly/monthly/yearly).
- **Financial Dashboard**:
    - **Cash Flow**: Income/Expense analysis.
    - **AccountFlow Widget**: 3D Pie charts for visual distribution.
    - **Upcoming Obligations**: Predictive view of expenses, loan installments, and yields.

### Communication & Inbox
- **Real-time Chat**: Private and project-based messaging.
- **Inbox**: Centralized unread message tracking.
- **Notifications**: Visual badges and real-time alerts.

### 🛠️ Strategic Tools
- **Financial Calculator**: Advanced loan simulator with amortization charts.
- **PDF Reports**: Generate and export detailed financial schedules.

---

## 🧪 Testing Strategy

ControlApp maintains comprehensive test coverage to ensure code quality and reliability:

- **Backend Tests (100% Coverage)**:
  - Feature tests for all API endpoints using `RefreshDatabase`.
  - Unit tests for complex business logic (Interest, Amortization).
  - Integration tests for Module Event Bus.
  
- **Frontend Tests (100% Component Coverage)**:
  - Vitest + React Testing Library.
  - Snapshot testing for UI consistency.

Run tests locally:
```bash
# Backend tests
./vendor/bin/sail test

# Frontend tests
pnpm test
```

---

## Architectural Highlights

### 1. Robust Testing Architecture (QA)
All feature tests utilize the `RefreshDatabase` trait to ensure **zero data contamination** between tests. This guarantees that every test runs in a pristine environment.

### 2. CI/CD Pipeline
- **Continuous Integration**: `tests.yml` runs on every push to `develop`.
- **Automated Deployment**: `deploy.yml` handles deployment to Homelab/Production environments via self-hosted runners.

### 3. Security & Data Integrity
- **Authorization Layer**: Centralized **Laravel Policies** for scalable security.
- **Soft Deletes**: Data recovery handling for non-critical models.
- **Observers**: Automatic data synchronization (e.g., updating account balances on transaction changes).

---

## Documentation

> **Security Note**: Detailed technical documentation is only shared with verified collaborators.

| Language | Link | Contents |
| :--- | :--- | :--- |
| **English** | [`/docs/private/en/`](./docs/private/en/01-core/INDEX.md) | Installation, API Reference, Architecture, Testing, and Development Guides |
| **Spanish** | [`/docs/private/es/`](./docs/private/es/01-core/INDEX.md) | Instalación, Referencia de API, Arquitectura, Testing y Guías de Desarrollo |

---

## Local Installation Guide (for Reviewers)

### Prerequisites
* Docker & Docker Compose
* Git
* **PNPM** (Mandatory)

### Setup Steps

1.  **Clone & Configure**:
    ```bash
    git clone https://github.com/Felondz/controlApp.git
    cd controlApp
    cp .env.example .env
    ```

2.  **Start Environment**:
    ```bash
    ./vendor/bin/sail up -d
    ```

3.  **Install & Migrate**:
    ```bash
    ./vendor/bin/sail composer install
    ./vendor/bin/sail artisan migrate --seed
    ```

4.  **Verify**:
    ```bash
    ./vendor/bin/sail test
    ```

* **Application URL**: `http://localhost`