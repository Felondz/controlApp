# 🎯 ControlApp: Collaborative Proyect Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel** and **React**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## 📈 Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Backend Tests** | 163 / 163 | ✅ **100% Stable** |
| **Total Assertions** | 440+ | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Backend Version** | v1.0.0 (Production Ready) | ✅ **Stable** |
| **Frontend Status** | 🚧 In Development | 🔄 **Active Development** |

[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests%20(Develop)&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)

---

## 🛠️ Technology Stack (Demonstrated Skills)

ControlApp employs an **API-First** architecture, ensuring clear separation of concerns, which is critical for scalability and microservices readiness.

### Backend (API REST)
| Component | Technology |
| :--- | :--- | :--- |
| **Framework** | Laravel 11 (PHP 8.2+) | Expertise in MVC, Eloquent ORM, and modern PHP development. |
| **Authentication** | Laravel Sanctum | Implementation of **stateless JWT-style API tokens** and session management. |
| **Authorization** | Policies & Gates | **Granular access control** (e.g., Owner, Admin, Member) and **SuperAdmin** readiness. |
| **Input Security** | Form Requests | Strict input validation, data sanitization, and **Rate Limiting** (5 req/min on Auth). |
| **Testing** | PHPUnit | Deep understanding of testing architecture, **RefreshDatabase** isolation, and full test suite maintenance. |

### Frontend (Web/Mobile Readiness) - 🚧 In Development
| Component | Technology | Status |
| :--- | :--- | :--- |
| **Framework** | React 19 + Inertia.js | ✅ **Active** |
| **Tooling** | Vite | ✅ **Configured** |
| **Localization (i18n)** | i18next + Custom Hook | ✅ **Implemented** |
| **UI/UX** | Tailwind CSS + React Components | ✅ **Standardized (Dark Mode Support)** |

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
* **Continuous Integration**: The `tests.yml` workflow runs all 163 tests on every *push* to the `develop` branch, acting as a mandatory quality gate.
* **Controlled Deployment**: Deployment to the Homelab/Production environment is restricted to the **`main`** branch (`deploy.yml`), enforcing stability.

---

## 📚 Documentation

Complete documentation is available in **English** and **Spanish**:

| Language | Link | Contents |
| :--- | :--- | :--- |
| 🇬🇧 **English** | [`/docs/en/`](./docs/en/README.md) | Installation, API Reference, Architecture, Testing, and Development Guides |
| 🇪🇸 **Spanish** | [`/docs/es/`](./docs/es/README.md) | Instalación, Referencia de API, Arquitectura, Testing y Guías de Desarrollo |

### Quick Navigation

**For Developers:**
- ✅ [Installation Guide](./docs/en/02-development/INSTALLATION.md) (English)
- ✅ [Guía de Instalación](./docs/es/02-development/INSTALLATION.md) (Spanish)
- 📖 [API Documentation](./docs/en/02-development/API.md) (English)
- 📖 [Documentación de API](./docs/es/02-development/API.md) (Spanish)
**For QA & Testing:**
- 🧪 [Testing Architecture](./docs/en/04-testing/TESTING_ARCHITECTURE.md) (English)
- 🧪 [Arquitectura de Testing](./docs/es/04-testing/TESTING_ARCHITECTURE.md) (Spanish)

## 🧪 Testing

El proyecto utiliza **PHPUnit** con **SQLite en memoria** para una ejecución rápida y aislada.

```bash
# Ejecutar todos los tests
php artisan test

# O usando Sail
./vendor/bin/sail test
```

Para más detalles, ver [Testing Architecture](docs/es/04-testing/TESTING_ARCHITECTURE.md).

---

## ⚙️ Local Installation Guide (for Reviewers)

The project is easily runnable using Docker and Laravel Sail.

### Prerequisites
* Docker and Docker Compose (or Docker Desktop)
* Git

### Setup Steps
1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/Felondz/controlApp.git](https://github.com/Felondz/controlApp.git)
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
    # This must return 163 tests passing with a green output.
    ./vendor/bin/sail artisan test --testdox
    ```
* **Application URL**: `http://