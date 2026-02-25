# ControlApp: Collaborative Project Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel 12** and **React 18**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Backend Tests** | 350+ | ✅ **100% Stable** |
| **Frontend Tests** | ~275 tests | ✅ **100% Coverage** |
| **Total Tests** | ~625+ tests | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Backend Version** | v3.0.0 (Actions/DTOs + GraphQL + MCP) | ✅ **Stable** |
| **Frontend Status** | ✅ Stable & Tested | 🔄 **Active Development** |

[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests%20(Develop)&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)

---

## Technology Stack (Demonstrated Skills)

ControlApp employs a **Modular Event-Driven Architecture** with an **Actions/DTOs** pattern, ensuring strict separation of concerns and scalability.

### Modular Architecture (Core)
- **Modules**: Independent units (Finance, Tasks, Chat, Inventory, Operations) located in `app/Modules/`.
- **Communication**: Strictly via **Event Bus** (`ModuleEventBus`). **Zero direct coupling** between modules.
- **Actions/DTOs Pattern**: All business logic lives in dedicated Action classes with strict DTO inputs, decoupled from HTTP/GraphQL/MCP protocols.
- **Registry**: Automatic module discovery and dependency resolution via `ModuleRegistry`.
- **Scalability**: New features are added as isolated modules without modifying the core system.

### Backend (API-First: REST + GraphQL + MCP)
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Laravel 12 (PHP 8.2+) | Expertise in MVC, Eloquent ORM, and modern PHP development. |
| **GraphQL** | Lighthouse (nuwave/lighthouse) | Primary mobile data layer for CRUD and nested relationship fetching. |
| **MCP (AI Tools)** | Laravel MCP (laravel/mcp) | 25+ domain-specific tools for AI-powered project management. |
| **Authentication** | Laravel Sanctum | Implementation of **stateless JWT-style API tokens** and session management. |
| **Authorization** | Policies & Gates | **Granular access control** (e.g., Owner, Admin, Member) and **SuperAdmin** readiness. |
| **Static Analysis** | PHPStan Level 8 | Mandatory zero-error policy on every PHP change. |
| **Testing** | PHPUnit | Deep understanding of testing architecture, **RefreshDatabase** isolation, and full test suite maintenance. |
| **Search** | Meilisearch + Scout | Fast, relevant, and secure full-text search implementation. |
| **PDF Export** | DomPDF + HTML2Canvas | High-quality PDF generation for financial reports and amortization schedules. |

### AI Integration
| Component | Technology | Description |
| :--- | :--- | :--- |
| **LLM Providers** | OpenAI, Google Gemini, Anthropic | Multi-provider support with encrypted per-user API keys. |
| **AI Chat Widget** | Global React Widget + SSE Streaming | Context-aware AI assistant with recursive MCP Tool execution (up to 5 levels). |
| **MCP Servers** | 5 servers (Inventory, Operations, Finance, Tasks, Chat) | 25+ tools exposing business logic to AI agents. |
| **Kill Switch** | Global `is_ai_enabled` toggle | Instantly disable all AI features per user. |

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
- **Customization**: Per-project themes (colors, typography) and cover images.
- **Team Management**: Invite members via email, manage roles/permissions.
- **Dashboard**: Centralized view with active module indicators and quick stats.

### Tasks Management (Kanban)
- **Kanban Board**: Interactive drag-and-drop board for task workflow.
- **Task Tracking**: Assignees, priorities, due dates, and status tracking.
- **Financial Integration**: Create financial tasks with monetary values.
- **Audit**: Automatic logging of task completion events.

### Operations & Production
- **Production Lines**: Manage complex workflows (e.g., Crops, Manufacturing) via `ProductionProcess`.
- **Batch Management**: Track `LoteProduccion` across stages with full traceability.
- **Recipe System**: Define input templates (ingredients/quantities) per stage, auto-cloned to batches.
- **Stage Automation**: Automatically trigger tasks, SOPs, and inventory consumption when batches advance.
- **Event-Driven Inventory Sync**: Consumption dispatches events; Inventory module deducts stock asynchronously.
- **History & Reports**: Dedicated view for analyzing finished/discarded batches with status filtering.

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

### AI-Powered Assistance
- **Global AI Chat Widget**: Context-aware assistant integrated into the main layout.
- **Multi-Provider LLM Support**: Configure OpenAI, Google Gemini, or Anthropic with encrypted per-user API keys.
- **Recursive Tool Execution**: AI can invoke MCP Tools (query balances, create tasks, manage inventory) up to 5 levels deep.
- **Dynamic Model Selection**: Switch provider and model at runtime from the chat widget.
- **Global Kill Switch**: Instantly disable all AI features with a single toggle.

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