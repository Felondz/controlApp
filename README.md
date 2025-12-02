# 🎯 ControlApp: Collaborative Project Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel** and **React**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## 📈 Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Backend Tests** | 240 / 240 | ✅ **100% Stable** |
| **Frontend Tests** | 215 tests / 38 suites | ✅ **100% Coverage** |
| **Total Assertions** | 1000+ | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Backend Version** | v1.5.0 (Inbox & Chat Sync) | ✅ **Stable** |
| **Frontend Status** | ✅ Stable & Tested | 🔄 **Active Development** |

[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests%20(Develop)&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)

---

## 🛠️ Technology Stack (Demonstrated Skills)

ControlApp employs an **API-First** architecture, ensuring clear separation of concerns, which is critical for scalability and microservices readiness.

### Backend (API REST)
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Laravel 11 (PHP 8.2+) | Expertise in MVC, Eloquent ORM, and modern PHP development. |
| **Authentication** | Laravel Sanctum | Implementation of **stateless JWT-style API tokens** and session management. |
| **Authorization** | Policies & Gates | **Granular access control** (e.g., Owner, Admin, Member) and **SuperAdmin** readiness. |
| **Input Security** | Form Requests | Strict input validation, data sanitization, and **Rate Limiting** (5 req/min on Auth). |
| **Testing** | PHPUnit | Deep understanding of testing architecture, **RefreshDatabase** isolation, and full test suite maintenance. |
| **Search** | Meilisearch + Scout | Fast, relevant, and secure full-text search implementation. |
| **PDF Export** | DomPDF + HTML2Canvas | High-quality PDF generation for financial reports and amortization schedules. |

### Frontend (Web/Mobile Readiness)
| Component | Technology | Status |
| :--- | :--- | :--- |
| **Framework** | React 19 + Inertia.js | ✅ **Active** |
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

- **Financial Tools**:
  - **Financial Calculator**: Advanced loan and amortization calculator.
  - **Modes**: Basic (quick calculation) and Advanced (detailed breakdown with insurance).
  - **Export**: Generate professional PDF reports with amortization charts.
  - **Visualizations**: Interactive charts for principal vs. interest analysis.
  - **API**: RESTful endpoints for tool management (`GET /api/tools`, `POST /api/tools/toggle`).

- **Personal & Project Finance**:
  - Income and expense tracking.
  - Bank account and cash management.
  - Budgets and savings goals.

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
  - Unit tests for business logic
  - Database integration tests
  
- **Frontend Tests**: 100% Component Coverage
| **Frontend** | Vitest + React Testing Library | **215 tests / 38 suites** |
| **Coverage** | Component Coverage | **100% (38/38 components)** |
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
npm run test

# CI mode (both)
npm run test:ci
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

---

## ⚙️ Local Installation Guide (for Reviewers)

The project is easily runnable using Docker and Laravel Sail.

### Prerequisites
* Docker and Docker Compose (or Docker Desktop)
* Git

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