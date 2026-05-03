# Contributing to ControlApp

Thank you for your interest in contributing to ControlApp. We maintain strict standards to ensure the reliability and scalability of the platform.

## Technical Standards

To maintain consistency across the codebase, all contributions must adhere to the following standards:

### Backend (PHP/Laravel)
* **Strict Typing**: All PHP files must declare `strict_types=1`.
* **Static Analysis**: All code must pass PHPStan analysis at **Level 8** with zero errors.
* **Architecture**: Follow the **Actions/DTOs** pattern. Business logic must be decoupled from controllers.
* **Inter-module Communication**: All communication between modules (e.g., Finance to Inventory) must be conducted via the `ModuleEventBus` using asynchronous events.
* **UUID Routing**: All primary models must use UUIDs for route model binding.

### Frontend (React/Inertia)
* **Functional Components**: Use only functional components with Hooks.
* **Styling**: Use Tailwind CSS and maintain compatibility with the global Design System and Dark Mode.
* **Internationalization**: All user-facing text must be wrapped in `useTranslate` hooks and defined in the respective JSON localization files.

## Development Workflow

1. **Fork & Branch**: Create a feature branch from the `develop` branch.
2. **Setup**: Use `composer install` and `pnpm install` to ensure your environment is synchronized.
3. **Implementation**: Ensure your work is modular and does not introduce direct coupling between existing modules.
4. **Verification**: 
   * Run the full test suite: `./vendor/bin/sail test` and `pnpm test`.
   * Run static analysis: `./vendor/bin/phpstan analyse`.
5. **Documentation**: Update relevant Markdown files in `docs/` if your change introduces new features or architectural shifts.

## Pull Request Guidelines

When submitting a Pull Request:
* Provide a clear description of the problem solved and the implementation approach.
* Include a list of modified files and any new dependencies introduced.
* Ensure all CI/CD checks pass successfully.

We value quality over speed. Thank you for your collaboration.
