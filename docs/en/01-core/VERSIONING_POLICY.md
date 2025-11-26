# Software Versioning Policy

ControlApp follows **Semantic Versioning (SemVer 2.0.0)** principles, adapted for the full-stack nature of the project.

## Version Structure: `MAJOR.MINOR.PATCH`

### 1. MAJOR (`X`.0.0)
Incremented for **incompatible changes** or massive architectural milestones.
- **Criteria**:
  - Complete rewrite of Backend or Frontend.
  - API changes that break compatibility with existing mobile clients.
  - Base technology migration (e.g., switching from MySQL to PostgreSQL, or React to Vue).
  - **Example**: Moving from `1.x` to `2.0` upon launching the native Mobile App.

### 2. MINOR (1.`X`.0)
Incremented for **new functionality** in a backward-compatible manner.
- **Criteria**:
  - Implementation of a complete new module (e.g., Tasks Module, Chat).
  - Integration of major external services (e.g., Meilisearch, Payment Gateway).
  - Significant Frontend changes that improve UX but don't break flows (e.g., New Dashboard).
  - **Current Context**: Version `1.1.0` marks the consolidation of the Frontend and Global Search.

### 3. PATCH (1.0.`X`)
Incremented for **backward-compatible bug fixes**.
- **Criteria**:
  - Bug fixes (e.g., fixing logo redirect).
  - Minor UI/UX tweaks (e.g., changing icons, colors).
  - Translation or documentation updates.
  - Security dependency updates.

## Workflow
1.  **Development**: Work is done in `feature/` or `fix/` branches.
2.  **Release**: Upon merging to `main`/`dev` for deployment, the new version is determined.
3.  **Tagging**: A git tag is created (e.g., `v1.1.0`).
4.  **Changelog**: `CHANGELOG.md` is updated by moving "Unreleased" to the new version.
