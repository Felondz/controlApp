# 🧪 Testing Strategy (Consolidated) - ControlApp

**This document merges the test architecture, database isolation and test execution commands.**

---

## 1. 🎯 Testing Philosophy and QA

* **Current Status**: 131 tests passing with 342 assertions (100% coverage of main modules).
* **Golden Rule (Quality Gate)**: If tests fail, the code has an error. **Do not commit/push until all pass**.
* **Convention**: Use descriptive test names: `test_admin_can_create_user`.

---

## 2. 🗄️ Database Isolation (Critical Strategy)

### The RefreshDatabase Trait
The test suite uses the `Illuminate\Foundation\Testing\RefreshDatabase` trait in each `TestCase`.

* **Purpose**: Ensure each test runs with a completely clean database, preventing data from one test affecting the next.
* **Mechanism**: Starts a transaction before each test and automatically rolls back on completion.
* **Setup**: Data is prepared using **Factories** to generate isolated and realistic instances for each test.

---

## 3. 🛠️ Execution Commands (Testing Scripts)

All tests must be run inside the application container through **Sail**.

| Purpose | Command |
| :--- | :--- |
| **Run all tests (Main)** | `./vendor/bin/sail artisan test --testdox` |
| **Run a specific file** | `./vendor/bin/sail artisan test tests/Feature/Auth/LoginTest.php` |
| **Run a specific test** | `./vendor/bin/sail artisan test --filter=can_user_login` |
| **Run tests in parallel** | `./vendor/bin/sail artisan test --parallel` |
| **Run testing migrations** | `./vendor/bin/sail artisan migrate --env=testing` |

---

## 4. 📝 Assertions and Structure

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

## 5. 🎯 Best Practices

- ✅ Each test should be independent
- ✅ Use descriptive test names
- ✅ Follow the AAA pattern
- ✅ Use Factories for test data
- ✅ Clean up after tests (RefreshDatabase handles this)
- ✅ Test both success and failure cases
- ✅ Run tests locally before pushing

---

**Last Updated**: November 16, 2025
**Status**: ✅ Testing strategy fully configured
