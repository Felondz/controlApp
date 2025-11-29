# 📚 ControlApp - Documentación Completa

Bienvenido a la documentación de **ControlApp** - Plataforma de gestión de proyectos colaborativos.

> **ControlApp** utiliza Laravel 11 (API-first) + React/Inertia.js (frontend).

---

## 🗂️ Estructura de Documentación (Consolidada y Limpia)
docs/ ├── 01-core/ # 📍 Referencia general, Changelogs │ ├── INDEX.md (este archivo) │ ├── CHANGELOG.md (historial público de versiones) │ └── QUICK_REFERENCE.md (comandos y atajos) │ ├── 02-development/ # 💻 Guías técnicas y APIs │ ├── INSTALLATION.md (cómo instalar) │ ├── API.md (endpoints REST) │ ├── AUTHENTICATION.md (sistema de auth y tokens) │ ├── AUTHORIZATION_VALIDATION.md (Policies, FormRequest, Rate Limiting) │ ├── DATABASE.md (esquema de BD y modelos) │ ├── CONTRIBUTING.md (cómo contribuir) │ ├── I18N_IMPLEMENTATION.md (Implementación técnica de i18n) │ └── I18N_QUICK_REFERENCE.md (Flujo i18n para desarrolladores) │ ├── 03-ia-collaboration/ # 🤖 Archivo único de onboarding │ └── ONBOARDING_FOR_NEW_AIs.md (Copia-Pega ÚNICO: Contexto, Normas y Flujos) │ └── 04-testing/ # 🧪 Estrategia de Testing y Comandos ├── TESTING_ARCHITECTURE.md (Estrategia de QA y aislamiento) └── TESTING_SCRIPTS.md (Comandos de ejecución de tests)
---

## 🎯 Selecciona tu rol (Flujo Rápido)

### 💻 Soy desarrollador o QA
* **Empezar:** Lee `../02-development/INSTALLATION.md`.
* **Arquitectura de BD:** `../02-development/DATABASE.md`.
* **API y Seguridad:** `../02-development/API.md` y `../02-development/AUTHORIZATION_VALIDATION.md`.
* **Testing:** `../04-testing/TESTING_ARCHITECTURE.md`.
* **Contribuir:** `../02-development/CONTRIBUTING.md`.
* **Traducciones (i18n):** `../02-development/I18N_QUICK_REFERENCE.md`.

### 🤖 Soy IA colaborando en el proyecto
* **🚀 Quick Start:** **Copia completamente `../03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md`** y pégalo en el chat.
* **Documentos para leer (Solo si el onboarding no basta):** `CHANGELOG.md` (últimas entradas).

---

## 📌 Resumen de Consolidación
* **`ONBOARDING_FOR_NEW_AIs.md`** ahora contiene: Contexto técnico completo, Normas de Trabajo, Flujo Ideal i18n, y la Filosofía de Desarrollo.
* **Archivos eliminados**: `AI_GUIDELINES.md`, `PROJECT_CONTEXT_FOR_BROWSER_AI.md`, `HOW_TO_SWITCH_TO_NEW_AI.md`, `TESTING.md` y todos los archivos redundantes de i18n y testing.
* **Archivos movidos**: La documentación técnica de i18n se movió de `03-ia-collaboration/` a `02-development/`.

---

## 📅 Última Actualización

- **Fecha**: 20 de noviembre de 2025
- **Reorganización**: Consolidación y limpieza total de la documentación.
- **Estado**: ✅ Estructura Sostenible.