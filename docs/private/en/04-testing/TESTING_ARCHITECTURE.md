# 🧪 Testing Strategy (Consolidated) - ControlApp

**This document merges the test architecture, database isolation and test execution commands.**

---

## 1. 🎯 Testing Philosophy and QA

*   **Current Status**: 
    - **Backend**: 280 tests passing with 1000+ assertions (100% coverage)
    - **Frontend**: 217 tests passing in 39 test files (100% component coverage)
    - **Total**: 497 tests with comprehensive coverage
*   **Golden Rule (Quality Gate)**: If tests fail, the code has an error. **Do not commit/push until all pass**.
*   **Convention**: Use descriptive test names: `test_admin_can_create_user` (backend), `renders correctly` (frontend).
*   **CI/CD**: All tests run automatically on GitHub Actions for every push/PR.

---

## 2. 🗄️ Backend Testing (PHPUnit)

### Database Isolation (Critical Strategy)

The test suite uses the `Illuminate\Foundation\Testing\RefreshDatabase` trait in each `TestCase`.

* **Setup**: Data is prepared using **Factories** to generate isolated and realistic instances for each test.

### 2. Directory Structure

- **Backend Tests**: `tests/Unit`, `tests/Feature`
- **Frontend Tests**: `tests/Frontend` (Mirroring `resources/js` structure)
- **E2E Tests**: `tests/Browser` (Dusk)

### Test Organization

Tests are organized by type in `tests/Feature`:

- **Api**: API endpoint tests (`tests/Feature/Api`)
- **Web**: Web/Inertia controller tests (`tests/Feature/Web`)
- **Auth**: Authentication flow tests (`tests/Feature/Auth`)
- **Mail**: Email content and sending tests (`tests/Feature/Mail`)
- **Database**: Seeder and migration tests (`tests/Feature/Database`)

### Execution Commands

All tests must be run inside the application container through **Sail**.

| Purpose | Command |
| :--- | :--- |
| **Run all tests (Main)** | `./vendor/bin/sail artisan test --testdox` |
| **Run a specific file** | `./vendor/bin/sail artisan test tests/Feature/Auth/LoginTest.php` |
| **Run a specific test** | `./vendor/bin/sail artisan test --filter=can_user_login` |
| **Run tests in parallel** | `./vendor/bin/sail artisan test --parallel` |
| **Run testing migrations** | `./vendor/bin/sail artisan migrate --env=testing` |

### Assertions and Structure

* **Test Structure (AAA)**:
    1.  `Arrange`: Prepare data with Factories.
    2.  `Act`: Execute the action (ex. `$this->postJson(...)`).
    3.  `Assert`: Validate the result (`assertStatus`, `assertDatabaseHas`, `assertJson`, etc.).

* **Common Assertions**:
    * `$response->assertStatus(200)` or `assertStatus(201)` (Created)
    * `$response->assertStatus(403)` (Forbidden) or `assertStatus(404)` (Not Found)
    * `$this->assertDatabaseHas('users', [...])`
    * `$this->assertDatabaseMissing('users', [...])`
    * `Mail::assertSent(...)` (To validate emails)

---

## 3. 🎨 Frontend Testing (Vitest + Testing Library)

### Test Coverage

**Statistics:**
- **Total Tests**: 217 tests across 39 test files
- **Coverage**: 100% of React components (39/39 test files)
- **Framework**: Vitest + @testing-library/react

**Test Categories:**

1. **UI Core Components**
   - Checkbox, TextInput, PasswordInput, InputLabel, InputError
   - PrimaryButton, SecondaryButton, DangerButton
   - Dropdown, Modal, Alert
   - RangeSlider, QuantityInput, SelectGroup, ToggleGroup, InputGroup

2. **Feature Components**
   - ImageUploader, Sidebar, ProjectCard, ChatWidget
   - BottomNavigation, ToolsSheet, TypographySelector, ThemeToggle
   - ApplicationLogo, LocaleSelector, SummaryCard, AccountsList, ToolCard
   - FinanceWidget, TasksWidget

3. **Architecture Tests**
   - ComponentStandards quality checks

### Execution Commands

| Purpose | Command |
| :--- | :--- |
| **Run all frontend tests** | `npm run test` |
| **Run tests in CI mode** | `npm run test:ci` |
| **Run tests in watch mode** | `npm run test:watch` |
| **Run specific test file** | `npx vitest run ComponentName.test.jsx` |

### Test Infrastructure

**Global Mocks** (`test-setup.js`):
- `@inertiajs/react` (usePage, router, Link, useForm)
- `@/hooks/useTranslate`
- `@/Contexts/GlobalThemeContext`
- `global.route` (Ziggy)
- `axios`
- `Element.prototype.scrollIntoView`

**Test Location**: `tests/Frontend/Components` (Mirroring `resources/js/Components`)

### Best Practices

- ✅ Use semantic queries (`getByRole`, `getByLabelText`)
- ✅ Test user behavior, not implementation details
- ✅ Wait for async operations with `waitFor`
- ✅ Verify translation keys, not translated text
- ✅ Keep tests isolated and independent
- ✅ Follow AAA pattern (Arrange, Act, Assert)

---

## 4. 🎯 General Best Practices

- ✅ Each test should be independent
- ✅ Use descriptive test names
- ✅ Follow the AAA pattern
- ✅ Use Factories/Mocks for test data
- ✅ Clean up after tests (RefreshDatabase/cleanup)
- ✅ Test both success and failure cases
- ✅ Run tests locally before pushing
- ✅ All tests must pass in CI/CD

---

**Last Updated**: December 6, 2025
**Status**: ✅ Testing strategy fully configured (Backend + Frontend)
**Note**: All frontend tests have been updated to use translation keys instead of hardcoded text, following the new i18n system.
