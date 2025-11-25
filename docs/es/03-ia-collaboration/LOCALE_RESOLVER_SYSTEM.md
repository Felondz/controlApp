# ✅ LOCALE RESOLVER - Sistema de Cascada de Idiomas

**Fecha**: 19 de noviembre de 2025  
**Estado**: ✅ COMPLETADO Y LIMPIADO  
**Scope**: Solo para usuarios autenticados

## 📋 Resumen

Se implementó un **sistema de preferencia de idiomas** que permite a usuarios autenticados cambiar el idioma de la aplicación. La preferencia se persiste en la base de datos y se aplica automáticamente en cada request a través de un middleware.

---

## 🏗️ Arquitectura

### Cascada de Idiomas (Middleware)

```
Request
  ↓
SetUserLocale Middleware
  ├─ ¿Usuario autenticado con locale en DB? 
  │  └─ Sí → app()->setLocale(user.locale)
  └─ No → Usar config fallback ('es')
  ↓
HandleInertiaRequests inyecta traducciones
  ↓
Frontend renderiza en idioma correcto
```

---

## 🔧 Componentes Implementados

### 1. Backend - Middleware
- **Archivo**: `app/Http/Middleware/SetUserLocale.php`
- **Función**: Cascada de preferencias de idioma
- **Lógica**:
  - Si usuario autenticado y tiene `locale` → usar ese
  - Si no → usar fallback de configuración

### 2. Backend - Base de Datos
- **Migración**: `database/migrations/2025_11_19_211748_add_locale_to_users_table.php`
- **Campo**: `locale` VARCHAR(2) con default 'es'
- **Estado**: ✅ Ejecutada

### 3. Backend - Modelos
- **User.php**: Actualizado con `locale` en `$fillable` y PHPDoc
- **UserFactory.php**: Incluye `'locale' => 'es'` por defecto

### 4. Backend - API
- **Controlador**: `app/Http/Controllers/Api/UserController.php`
- **Método**: `updateLocale()`
- **Ruta**: `PUT /api/user/locale`
- **Auth**: Requiere `auth:sanctum`
- **Validación**: Locale debe ser: `es`, `en`, `pt`

### 5. Frontend - React Component
- **Archivo**: `resources/js/Components/Common/LocaleSelector.jsx`
- **Features**:
  - Botones para cambiar entre es, en, pt
  - Envía PUT request a `/api/user/locale`
  - Recarga página tras cambio exitoso
  - Manejo de errores

### 6. Frontend - Layouts
- **AuthenticatedLayout.jsx**: LocaleSelector integrado en dropdown del usuario
- **GuestLayout.jsx**: Limpio (sin locale selector)

### 7. Traducciones
- **es.json** y **en.json**: Incluyen claves:
  - `common.language`
  - `common.change_language`
  - `common.spanish`
  - `common.english`
  - `common.portuguese`

### 8. Tests
- **UserLocaleApiTest.php**: 5 tests para validar API
  - ✅ Usuario autenticado puede cambiar locale
  - ✅ Usuario no autenticado no puede acceder
  - ✅ Locale inválido es rechazado
  - ✅ Campo locale es requerido
  - ✅ Todos los locales válidos aceptados

---

## 🔄 Flujo de Uso

```
1. Usuario hace clic en LocaleSelector → selecciona "English"
2. React envía: PUT /api/user/locale { locale: "en" }
3. UserController valida y actualiza: User::locale = "en"
4. Respuesta: { success: true }
5. Frontend recarga: window.location.reload()
6. SetUserLocale middleware lee: User::locale = "en"
7. app()->setLocale("en")
8. HandleInertiaRequests inyecta traducciones en "en"
9. Frontend renderiza completamente en inglés
```

---

## 📁 Estructura de Archivos

```
app/Http/
├── Controllers/Api/
│   └── UserController.php (método updateLocale)
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
└── api.php (ruta PUT /api/user/locale)

tests/Feature/
└── UserLocaleApiTest.php

bootstrap/
└── app.php (SetUserLocale middleware registered)
```

---

## 🚀 Uso en Código

### Mostrar LocaleSelector
```jsx
import LocaleSelector from '@/Components/Common/LocaleSelector';

// En AuthenticatedLayout (ya está integrado en dropdown)
<LocaleSelector />
```

### Obtener locale actual en React
```jsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;
const userLocale = auth.user?.locale || 'es';
```

### Obtener locale en PHP
```php
// En controladores
$locale = auth()->user()?->locale ?? config('app.locale');
app()->setLocale($locale);
```

---

## 🔐 Seguridad

- ✅ Validación de locale (whitelist: es, en, pt)
- ✅ Protección con `auth:sanctum`
- ✅ CSRF middleware en PUT request
- ✅ Validación requerida del campo locale

---

## 🧪 Testing

### Ejecutar Tests
```bash
php artisan test tests/Feature/UserLocaleApiTest.php
```

### Tests Disponibles
1. Usuario autenticado puede actualizar locale
2. Usuario no autenticado no puede acceder
3. Locale inválido es rechazado
4. Campo locale es requerido
5. Todos los locales válidos son aceptados

---

## 📊 Estado de Implementación

| Componente | Estado | Tests |
|-----------|--------|-------|
| SetUserLocale Middleware | ✅ | ⏳ |
| Migración users.locale | ✅ | ✅ |
| User Model | ✅ | ✅ |
| UserFactory | ✅ | ✅ |
| UserController.updateLocale | ✅ | ✅ |
| API Route PUT /api/user/locale | ✅ | ✅ |
| LocaleSelector Component | ✅ | ⏳ |
| AuthenticatedLayout | ✅ | ⏳ |
| Traducciones es.json, en.json | ✅ | ⏳ |
| Tests Backend | ✅ | ✅ |

---

## 🎓 Cómo Funciona

1. **Usuario autenticado hace login**
   - Middleware `SetUserLocale` lee su `locale` de la DB
   - Si no tiene preferencia, usa default 'es'

2. **Usuario selecciona otro idioma**
   - Hace clic en LocaleSelector
   - React envía PUT `/api/user/locale`
   - UserController guarda en DB

3. **Página se recarga**
   - Middleware `SetUserLocale` lee la NEW preferencia
   - Frontend renderiza en nuevo idioma

---

## 🎯 Próximos Pasos (Opcional)

- Agregar más idiomas a la whitelist
- Detectar locale automático por navegador
- Incluir locale en responses de API
- Tests E2E con Cypress

---

**Implementado por**: GitHub Copilot  
**Última revisión**: 19 de noviembre de 2025
