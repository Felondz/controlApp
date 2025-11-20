# 🎯 ControlApp: Collaborative Proyect Management Platform

> A highly-rated **Full-Stack API-First** project built with **Laravel** and **React**, showcasing modern architecture, robust testing, and clean CI/CD practices.

---

## 📈 Project Status & Quality Assurance

This status reflects the stability achieved through **Continuous Integration (CI)** running on GitHub Actions.

| Metric | Value | Status |
| :--- | :--- | :--- |
| **Tests Passing** | 163 / 163 | ✅ **100% Stable** |
| **Total Assertions** | 440+ | ✅ **Robust Coverage** |
| **CI Workflow** | GitHub Actions | ✅ **Active & Automated** |
| **Branching Model** | Git Flow (develop/main) | ✅ **Enforced** |
| **Current Version** | v1.0.0 (Production Ready) | ✅ **Stable** |

**[![Tests Status](https://img.shields.io/github/actions/workflow/status/Felondz/controlApp/tests.yml?branch=develop&label=Tests&logo=github)](https://github.com/Felondz/controlApp/actions/workflows/tests.yml)**

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

### Frontend (Web/Mobile Readiness)
| Component | Technology |
| :--- | :--- | :--- |
| **Framework** | React 19 + Inertia.js | Building Single-Page Applications (SPA) with routing and data binding efficiency. |
| **Tooling** | Vite | Configuration and leverage of **Hot Module Replacement (HMR)** for rapid development. |
| **Localization (i18n)** | i18next + Custom Hook | Implementation of a sustainable **multilingual flow** with automatic debugging fallback. |

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