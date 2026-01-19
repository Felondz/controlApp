# Developer Documentation

Welcome to the **controlApp** development hub. Here you will find standards, guides, and technical references to maintain and scale the platform.

## Project Architecture

The project follows a **Modular Monolith** architecture based on Laravel 12.

*   **Backend:** Laravel 12 (PHP 8.2+)
*   **Frontend:** React 18 + Inertia.js
*   **Database:** MySQL / MariaDB
*   **Styling:** Tailwind CSS 3.x

### Module Structure
Code is organized by domains within `app/Modules`. Each module encapsulates its logic (Models, Controllers, Services).

*   `Finance`: Account management, transactions, and budgeting.
*   `Operations`: Projects, tasks, and workflows.
*   `Core`: Authentication, users, and global settings.

## API Reference

Automatic API documentation generated with Scramble.

> [!TIP]
> **[View Interactive API Documentation](/docs/api)**
>
> Consult endpoints, request/response schemas, and test requests directly.

## Useful Commands

```bash
# Start development environment (Sail)
./vendor/bin/sail up -d

# Compile frontend assets (HMR)
pnpm dev

# Run tests
./vendor/bin/sail test
```

## Security

*   All new functionality must be protected by **Policies**.
*   Do not expose sensitive data in global JSON responses.
*   Use `Sanctum` for API authentication.
