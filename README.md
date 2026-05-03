# ControlApp
## Unified Business Operations & Project Ecosystem

ControlApp is a robust, modular platform designed to unify every aspect of business operations—from complex financial management and industrial production lines to real-time inventory and team collaboration. Engineered with an API-first philosophy and a strictly decoupled modular architecture, it serves as a high-performance backbone for scalable business ecosystems.

---

### Core Business Pillars

#### 1. Intelligent Financial Management
ControlApp provides a high-precision financial core capable of managing complex fiscal operations:
* **Account Ecosystem**: Native support for 6 account types including Cash, Bank, Credit Cards, Investments, and Loans.
* **Credit Cycle Intelligence**: Advanced tracking of billing cycles, cutoff dates, and minimum payments for credit products.
* **Investment & Yields**: Automatic monthly interest accrual for savings and investment accounts (e.g., CDTs) with maturity protection.
* **Predictive Cash Flow**: Integrated "Upcoming Obligations" engine that forecasts expenses, installments, and projected yields.
* **Reporting**: High-fidelity PDF financial reports and CSV data exports for external auditing.

#### 2. Industrial Operations & Traceability
The Operations module is built for precision manufacturing and production tracking:
* **Production Life-cycles**: Define multi-stage production processes with inherited "Recipe" templates (ingredients and quantities).
* **Batch (Lote) Tracking**: Full traceability of production batches from creation to completion or discard.
* **Stage Automation**: Intelligent stage progression that automatically triggers Standard Operating Procedures (SOPs), creates tasks, and consumes inventory.
* **Performance Analysis**: Detailed history of batch efficiency and status transitions.

#### 3. Real-Time Unified Inventory
An event-driven inventory system that ensures stock integrity across the platform:
* **Asynchronous Synchronization**: Automatic stock deduction triggered by production events or sales via the Module Event Bus.
* **Replenishment Intelligence**: Automated task generation when items fall below safety stock levels.
* **Global Registry**: Unified item management with per-project cost and sale price tracking using the localized `CurrencyInput` system.

#### 4. Agile Collaboration & Messaging
Built-in tools to keep teams aligned and workflows moving:
* **Kanban Task Management**: Dynamic drag-and-drop board for task tracking with priority, assignment, and due-date management.
* **Contextual Communication**: Real-time private and project-based messaging system integrated into the core workflow.
* **Centralized Inbox**: Unified view of unread notifications and cross-project interactions.

---

### The AI Advantage: Model Context Protocol (MCP)

ControlApp integrates a state-of-the-art AI layer that goes beyond simple chat. It features a contextual assistant capable of interacting directly with business logic:
* **Autonomous Agents**: Powered by the Model Context Protocol (MCP), the AI assistant can invoke over 25 domain-specific tools to query balances, update inventory, or manage tasks autonomously.
* **Multi-Provider Support**: Seamlessly switch between OpenAI, Google Gemini, and Anthropic providers with per-user encrypted API key management.
* **Security First**: A global "Kill Switch" allows instant deactivation of all AI features at the user level, ensuring total control over data exposure.

---

### Engineering & Reliability Standards

Designed for mission-critical reliability, ControlApp adheres to strict engineering principles:
* **Modular Event-Driven Architecture**: Total decoupling between modules (Finance, Inventory, etc.) ensures that the failure of one component never compromises the integrity of the system.
* **Enterprise Static Analysis**: 100% compliance with PHPStan Level 8, enforcing strict type-safety across the entire backend.
* **Comprehensive Test Suite**: A robust infrastructure of 625+ automated tests (Backend PHPUnit & Frontend Vitest) ensuring 100% stability of critical business flows.
* **High Performance**: Optimized with Laravel Octane and Swoole, achieving sub-second response times for high-concurrency environments.
* **Security & Auditing**: Granular role-based access control (RBAC), UUID-based routing to prevent enumeration, and automatic audit logging of critical events.

---

### Technical Specification

| Layer | Technology |
| :--- | :--- |
| **Backend Core** | Laravel 12 (PHP 8.2+) |
| **Frontend Web** | React 18 + Inertia.js + Vite |
| **Performance** | Laravel Octane + Redis |
| **Primary APIs** | REST + GraphQL (Mobile Layer) + MCP (AI Layer) |
| **Observability** | Laravel Pulse |
| **Static Analysis** | PHPStan (Level 8) |
| **Security** | UUID Routing + Sanctum Auth |

---

### Deployment & Installation

ControlApp is designed for containerized environments using Docker.

#### Prerequisites
* Docker & Docker Compose
* PNPM (Package Manager)

#### Setup Steps

1. **Environment Initialization**:
   ```bash
   cp .env.example .env
   # Update your database and APP_URL settings
   ```

2. **Infrastructure Launch**:
   ```bash
   ./vendor/bin/sail up -d
   ```

3. **Dependency Management**:
   ```bash
   ./vendor/bin/sail composer install
   pnpm install
   pnpm run build
   ```

4. **Database & Seeding**:
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

5. **Stability Verification**:
   ```bash
   ./vendor/bin/sail test
   ```

---

### Roadmap & Future
* **Mobile Ecosystem**: Native iOS and Android clients leveraging the GraphQL data layer.
* **Advanced Analytics**: Real-time business intelligence dashboards.
* **Marketplace Expansion**: Pluggable modules for external integrations.

---

© 2026 ControlApp. Built for enterprise scalability and operational excellence.