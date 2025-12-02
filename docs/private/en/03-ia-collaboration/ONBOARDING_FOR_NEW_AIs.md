# 🤖 Onboarding for New AIs - ControlApp

Welcome, new AI! This document is your **source of truth** for collaborating on ControlApp.

> **Critical Instruction**: Read this document COMPLETELY before writing a single line of code.

---

## 1. 🌍 Project Context

**ControlApp** is a collaborative project management platform.
- **Current State**: Financial management features (accounts, transactions) implemented.
- **Goal**: Expand to comprehensive project management.
- **Philosophy**: Clean code, solid architecture, and **premium aesthetics**.

---

## 2. 🛠️ Tech Stack

| Layer | Technology | Version / Detail |
|-------|------------|------------------|
| **Backend** | Laravel | 11+ (PHP 8.2+) |
| **Frontend** | React | 18+ (Inertia.js) |
| **Styles** | TailwindCSS | v3.4+ |
| **DB** | MySQL | 8.0+ |
| **DevOps** | Docker | Laravel Sail |
| **Testing** | PHPUnit / Pest | Feature & Unit tests | vitest and react testing library

---

## 3. 🚦 Workflow Rules

### 3.1 Agent Mode (`task_boundary`)
- **ALWAYS** use `task_boundary` when starting a complex task.
- **NEVER** leave `TaskStatus` empty or generic. It must describe the **next step**.
- **GRANULARITY**: A `TaskName` must correspond to an item in `task.md`.

### 3.2 Artifacts
- **`task.md`**: Your living checklist. Update it constantly.
- **`implementation_plan.md`**: MANDATORY in PLANNING mode. Ask for approval before executing.
- **`walkthrough.md`**: MANDATORY upon completion. Show visual proofs and results.

### 3.3 Commits
Use **Conventional Commits**:
- `feat(auth): add google login`
- `fix(user): fix email validation`
- `docs(readme): update installation instructions`
- `refactor(api): optimize project query`

---

## 4. 📚 Documentation Rules

> **🔴 GOLDEN RULE**: Do not create new documents unless STRICTLY necessary.
> **🌐 BILINGUAL RULE**: Documentation must ALWAYS be in both English (`docs/en/`) and Spanish (`docs/es/`).

### Structure
- `docs/en/01-core/`: Indexes, Changelog.
- `docs/en/02-development/`: Technical guides (API, DB, Auth).
- `docs/en/03-ia-collaboration/`: YOUR guides (this file).
- `docs/en/04-testing/`: Testing strategies.
- `docs/en/05-reference/`: Frontend reference, mailpit, mailtrap, etc.

### Decision Flow
1. Is it a code change? -> Update `CHANGELOG.md`.
2. Is it a rule clarification? -> Update `AI_GUIDELINES.md`.
3. Is it a new procedure? -> Ask before creating file.

---

## 5. 💻 Coding Standards

### PHP (Laravel)
- **PSR-12**: Strict.
- **Types**: Use `declare(strict_types=1);` and type hints everywhere.
- **Controllers**: Keep them thin. Use `FormRequest` for validation and `Policies` for authorization.
- **Models**: Use `$fillable` or `$guarded` explicitly.

### React (Frontend)
- **Components**: Functional with Hooks.
- **Names**: `PascalCase` for components (`UserProfile.jsx`).
- **Props**: Validate with PropTypes or TypeScript (if applicable).
- **Inertia**: Use `useForm` for forms.

### CSS (Tailwind)
- **Utilities**: Use utility classes whenever possible.
- **Config**: Use semantic colors (`bg-primary`, `text-danger`) defined in `tailwind.config.js`.
- **Responsive**: Mobile-first (`w-full md:w-1/2`).

### 5.1 Strict UI/UX Rules
- **No Hardcoded Text**: ALL user-facing text MUST use `useTranslate` hook or `t()` function.
- **Theme Adherence**: MUST use `getThemeStyle` or CSS variables (e.g., `text-primary-600`). NEVER hardcode hex colors for main elements.
- **No Hardcoded Colors**: Do NOT use arbitrary Tailwind colors like `bg-blue-500` or `text-green-600` unless they are semantic (e.g., `success`, `danger`, `warning`, `info`). Use `primary` and `secondary` for branding.
- **Icon Usage**: MUST use icons from `Icons.jsx`. Do NOT use emojis or raw SVGs in components unless adding them to `Icons.jsx` first.
- **Images vs Icons**: If a project has an image, it takes precedence over the icon.

---

## 6. 🧪 Testing

- **Rule**: "If it's not tested, it's not finished".
- **Command**: `php artisan test` (o `docker compose exec laravel.test php artisan test`).
- **Coverage**: Prioritize Feature tests for critical flows.
- **Frontend**: Use vitest and react testing library.
- **Backend**: Use phpunit.
- **Clear**: clear all files from previous tests.

---

## 7. 🚀 Quick Start for your Session

1. **Read** `task.md` (if exists) to see current state.
2. **Read** `CHANGELOG.md` to see latest changes.
3. **Verify** environment with `php artisan test`.
4. **Start** your task with `task_boundary`.

Good luck! 🚀

## Rigorous Documentation Policy
All code modifications must be documented immediately:
1. **CHANGELOG.md**: Record changes under the corresponding version (Added, Changed, Fixed).
2. **README**: Update if installation, configuration, or general usage changes.
3. **Specific Documentation**: Update the corresponding file (e.g., `API.md`, `FRONTEND.md`) with technical details.
4. **Public Documentation**: Update only when changing versions or under explicit instruction.
