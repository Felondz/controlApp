# ✅ LOCALE RESOLVER - Language Cascade System

**Date**: November 19, 2025  
**Status**: ✅ COMPLETED AND CLEANED  
**Scope**: For authenticated users only

## 📋 Summary

A **language preference system** was implemented that allows authenticated users to change the application language. The preference is persisted in the database and automatically applied in each request through middleware.

---

## 🏗️ Architecture

### Language Cascade (Middleware)

```
Request
  ↓
SetUserLocale Middleware
  ├─ Is user authenticated with locale in DB? 
  │  └─ Yes → app()->setLocale(user.locale)
  └─ No → Use config fallback ('es')
  ↓
HandleInertiaRequests injects translations
  ↓
Frontend renders in correct language
```

---

## 🔧 Implemented Components

### 1. Backend - Middleware
- **File**: `app/Http/Middleware/SetUserLocale.php`
- **Function**: Language preference cascade
- **Logic**:
  - If authenticated user has `locale` → use that
  - If not → use configuration fallback

### 2. Backend - Database
- **Migration**: `database/migrations/2025_11_19_211748_add_locale_to_users_table.php`
- **Field**: `locale` VARCHAR(2) with default 'es'
- **Status**: ✅ Executed

### 3. Backend - Models
- **User.php**: Updated with `locale` in `$fillable` and PHPDoc
- **UserFactory.php**: Includes `'locale' => 'es'` by default

### 4. Backend - API
- **Controller**: `app/Http/Controllers/Api/UserController.php`
- **Method**: `updateLocale()`
- **Route**: `PUT /api/user/locale`
- **Auth**: Requires `auth:sanctum`
- **Validation**: Locale must be: `es`, `en`, `pt`

### 5. Frontend - React Component
- **File**: `resources/js/Components/Common/LocaleSelector.jsx`
- **Features**:
  - Buttons to switch between es, en, pt
  - Sends PUT request to `/api/user/locale`
  - Reloads page after successful change
  - Error handling

### 6. Frontend - Layouts
- **AuthenticatedLayout.jsx**: LocaleSelector integrated in user dropdown
- **GuestLayout.jsx**: Clean (no locale selector)

### 7. Translations
- **es.json** and **en.json**: Include keys:
  - `common.language`
  - `common.change_language`
  - `common.spanish`
  - `common.english`
  - `common.portuguese`

### 8. Tests
- **UserLocaleApiTest.php**: 5 tests to validate API
  - ✅ Authenticated user can change locale
  - ✅ Unauthenticated user cannot access
  - ✅ Invalid locale is rejected
  - ✅ Locale field is required
  - ✅ All valid locales accepted

---

## 🔄 Usage Flow

```
1. User clicks LocaleSelector → selects "English"
2. React sends: PUT /api/user/locale { locale: "en" }
3. UserController validates and updates: User::locale = "en"
4. Response: { success: true }
5. Frontend reloads: window.location.reload()
6. SetUserLocale middleware reads: User::locale = "en"
7. app()->setLocale("en")
8. HandleInertiaRequests injects translations in "en"
9. Frontend renders completely in English
```

---

## 📁 File Structure

```
app/Http/
├── Controllers/Api/
│   └── UserController.php (updateLocale method)
├── Middleware/
│   └── SetUserLocale.php

resources/
├── js/
│   ├── Components/Common/
│   │   └── LocaleSelector.jsx
│   └── Layouts/
│       └── AuthenticatedLayout.jsx
├── lang/
│   ├── es.json
│   └── en.json

database/
├── migrations/
│   └── 2025_11_19_211748_add_locale_to_users_table.php
└── factories/
    └── UserFactory.php

routes/
└── api.php (PUT /api/user/locale route)

tests/Feature/
└── UserLocaleApiTest.php

bootstrap/
└── app.php (SetUserLocale middleware registered)
```

---

## 🚀 Usage in Code

### Show LocaleSelector
```jsx
import LocaleSelector from '@/Components/Common/LocaleSelector';

// In AuthenticatedLayout (already integrated in dropdown)
<LocaleSelector />
```

### Get current locale in React
```jsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;
const userLocale = auth.user?.locale || 'es';
```

### Get locale in PHP
```php
// In controllers
$locale = auth()->user()?->locale ?? config('app.locale');
app()->setLocale($locale);
```

---

## 🔐 Security

- ✅ Locale validation (whitelist: es, en, pt)
- ✅ Protected with `auth:sanctum`
- ✅ CSRF middleware on PUT request
- ✅ Required field validation

---

## 🧪 Testing

### Run Tests
```bash
php artisan test tests/Feature/UserLocaleApiTest.php
```

### Available Tests
1. Authenticated user can update locale
2. Unauthenticated user cannot access
3. Invalid locale is rejected
4. Locale field is required
5. All valid locales are accepted

---

## 📊 Implementation Status

| Component | Status | Tests |
|-----------|--------|-------|
| SetUserLocale Middleware | ✅ | ⏳ |
| Migrations users.locale | ✅ | ✅ |
| User Model | ✅ | ✅ |
| UserFactory | ✅ | ✅ |
| UserController.updateLocale | ✅ | ✅ |
| API Route PUT /api/user/locale | ✅ | ✅ |
| LocaleSelector Component | ✅ | ⏳ |
| AuthenticatedLayout | ✅ | ⏳ |
| Translations es.json, en.json | ✅ | ⏳ |
| Backend Tests | ✅ | ✅ |

---

## 🎓 How It Works

1. **Authenticated user logs in**
   - Middleware `SetUserLocale` reads their `locale` from DB
   - If no preference, uses default 'es'

2. **User selects another language**
   - Clicks LocaleSelector
   - React sends PUT `/api/user/locale`
   - UserController saves to DB

3. **Page reloads**
   - Middleware `SetUserLocale` reads the NEW preference
   - Frontend renders in new language

---

## 🎯 Next Steps (Optional)

- Add more languages to whitelist
- Auto-detect locale from browser
- Include locale in API responses
- E2E tests with Cypress

---

**Implemented by**: GitHub Copilot  
**Last Review**: November 19, 2025
