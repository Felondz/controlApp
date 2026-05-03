# Security Policy

## Supported Versions

Only the latest major version of ControlApp receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| v3.x    | :white_check_mark: |
| < v3.x  | :x:                |

## Reporting a Vulnerability

We take the security of ControlApp seriously. If you discover a security vulnerability, please do NOT open a public issue. Instead, report it privately to ensure the safety of all users.

### Responsible Disclosure Process

1. **Contact**: Send a detailed report to security@controlapp.com (placeholder - please update with your official contact).
2. **Details**: Include a description of the vulnerability, steps to reproduce, and any potential impact.
3. **Response**: We will acknowledge receipt of your report within 48 hours and provide a timeline for resolution.
4. **Fix**: We will coordinate the release of a fix and provide credit (if desired) once the vulnerability is resolved.

## Security Features

ControlApp is built with several native security layers:
* **UUID-based Routing**: Primary resources are identified by UUIDs to prevent ID enumeration.
* **Granular RBAC**: Strict Policy-based authorization (Owner, Admin, Member).
* **Data Encryption**: Sensitive data (such as AI API keys) is stored using Laravel's native encryption.
* **Static Analysis**: Enforced PHPStan Level 8 to prevent type-related vulnerabilities.
* **Audit Logging**: Critical system events are automatically logged for forensic analysis.

Thank you for helping keep ControlApp secure.
