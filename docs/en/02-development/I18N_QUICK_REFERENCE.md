# 🌐 i18n Quick Reference - ControlApp

## ⚡ For AIs collaborating on the project

### Golden Rule
> **NEVER hardcode strings in React components**

All user-visible text must be:
1. In `resources/lang/es/es.json` and `resources/lang/en/en.json`
2. Accessed through the `useTranslate()` hook

---

## 🎯 IDEAL FLOW (Critical)

**This is the CORRECT order to avoid translation "technical debt":**

### BEFORE writing React, add to JSONs:

#### 1️⃣ Edit `resources/lang/es/es.json`
```json
{
  "accounts": {
    "balance": "Balance de Cuentas",
    "total": "Total"
  }
}
```

#### 2️⃣ Edit `resources/lang/en/en.json` (⚠️ NEVER omit)
```json
{
  "accounts": {
    "balance": "Account Balance",
    "total": "Total"
  }
}
```

#### 3️⃣ Then write React
```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function Accounts() {
    const t = useTranslate();
    return <h1>{t('accounts.balance')}</h1>;
}
```

### Auto-verification:
- ✅ If you see: "Account Balance" → Key exists ✓
- ❌ If you see: "accounts.balance" → Missing in JSON (fallback shows it)

---

## 💡 Fallback Automatic (Your Ally)

The `useTranslate()` hook has intelligent fallback:

```jsx
// If the key does NOT exist:
{t('accounts.missing')}

// Renders: "accounts.missing" (the key itself)
// This HELPS you identify errors quickly
```

**Benefit**: If you see weird text like "accounts.balance" on screen, you know:
- You forgot to add the key to `es/es.json`
- Or forgot to add to `en/en.json`
- The fallback is a CANARY for errors

---

## 🔧 5 Steps to Translate Any Component

### Step 1: Import the hook
```jsx
import { useTranslate } from '@/hooks/useTranslate';
```

### Step 2: Create translation instance
```jsx
export default function MyComponent() {
    const t = useTranslate();
    // ...
}
```

### Step 3: Replace strings
```jsx
// ❌ BEFORE (hardcoding)
<h1>My Projects</h1>
<button>Create Project</button>

// ✅ AFTER (with translations)
<h1>{t('dashboard.my_projects')}</h1>
<button>{t('projects.create')}</button>
```

### Step 4: If key does NOT exist
1. ✅ FIRST: Edit `resources/lang/es/es.json`
2. ✅ SECOND: Edit `resources/lang/en/en.json` (ALWAYS BOTH)
3. ✅ Then: Use in React component
4. ❌ NEVER: The opposite (code first, i18n later)

### Step 5: Test
- Vite HMR reloads automatically
- Changes appear instantly (<100ms)

---

## 📝 Practical Examples

### Translate an h1
```jsx
// ❌ NO (hardcoding)
<h1>Welcome to Dashboard</h1>

// ✅ YES (with translation)
<h1>{t('dashboard.welcome')}</h1>
```

### Translate a button
```jsx
// ❌ NO (hardcoding)
<button>Save Changes</button>

// ✅ YES
<button>{t('common.save')}</button>
```

### Translate conditional text
```jsx
// ❌ NO
<span>{user.active ? 'Active' : 'Inactive'}</span>

// ✅ YES
<span>{user.active ? t('common.active') : t('common.inactive')}</span>
```

### Translate a placeholder
```jsx
// ❌ NO
<input placeholder="Enter your name" />

// ✅ YES
<input placeholder={t('common.enter_name')} />
```

### Translate an aria-label
```jsx
// ❌ NO
<button aria-label="Delete project">X</button>

// ✅ YES
<button aria-label={t('projects.delete')}>X</button>
```

---

## 📋 Quick Checklist

Before committing:
- [ ] Are there hardcoded strings in JSX?
- [ ] Are all strings in the translation keys JSONs?
- [ ] Is `t()` used for all text?
- [ ] Are the keys added in es/es.json AND en/en.json?
- [ ] Did you test with Vite HMR?

---

## 🎯 Available Keys by Category

### Dashboard
```
dashboard.title
dashboard.welcome
dashboard.my_projects
dashboard.activity_summary
dashboard.recent_transactions
dashboard.no_projects
dashboard.create_project
```

### Projects
```
projects.title
projects.create
projects.personal
projects.collaborative
projects.name
projects.edit
projects.delete
```

### Common
```
common.save
common.cancel
common.delete
common.edit
common.add
common.search
common.loading
common.error
common.success
common.yes
common.no
common.open
common.close
```

See `resources/lang/es/es.json` for the complete list.

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: See key on screen

```jsx
{t('dashboard.titulo')}

// On screen: "dashboard.titulo"
// Means: KEY DOESN'T EXIST in JSONs
```

**How to find the error (Fallback is your friend)**:
```
If you see "dashboard.titulo" on screen:
1. Check es/es.json: does "dashboard.titulo" exist?
2. Check en/en.json: does "dashboard.titulo" exist?
3. Is there a typo? (dashboard.titilo vs dashboard.titulo)

The fallback SHOWS exactly what key is missing.
```

### ❌ Mistake 2: Key with typo
```jsx
{t('dashboard.titel')}  // ← typo: "titel" vs "title"

// Screen shows: "dashboard.titel"
// Tells you: THIS KEY doesn't exist
```

### ❌ Mistake 3: Forgot one language
```json
// es/es.json - HAS the key ✓
"proyectos.crear": "Crear"

// en/en.json - DOESN'T HAVE the key ✗
// (you forgot to copy it)

// Result in English: See "proyectos.crear"
```

**Solution**: 
```
ALWAYS add BOTH languages:
- Add to es/es.json
- THEN add to en/en.json
- NEVER skip one

If you see a key on screen, it means:
└─ It's missing in at least one JSON
```

### ❌ Mistake 4: Mix strings and variables
```jsx
// ❌ BAD (mixed)
<p>{t('usuario')}: {usuario.nombre}</p>

// ✅ GOOD (separated)
<p>{usuario.nombre}</p>  // Only variable
// If you need label:
<label>{t('common.name')}: {usuario.nombre}</label>
```

### ❌ Mistake 5: Hardcode instead of translate
```jsx
// ❌ NEVER
<h1>"My Projects"</h1>

// ✅ ALWAYS
<h1>{t('dashboard.my_projects')}</h1>

// If key DOESN'T EXIST in JSON:
// See: "dashboard.my_projects" (fallback)
// Solution: Add to es/es.json and en/en.json first
```

---

## 💡 Fallback System (Your Debug Tool)

The fallback is intelligent: if you see the key on screen, something is wrong.

```
FLOW:
1. See weird text: "dashboard.missing"
   ↓
2. It's FALLBACK (key doesn't exist)
   ↓
3. Add to both JSONs
   ↓
4. Reload page
   ↓
5. Done!

ADVANTAGE:
- Fallback tells you exactly what's broken
- Like an automatic translation test
- No need to check console
```

---

## 🚀 Add New Language

1. Create `resources/lang/pt/pt.json` (Portuguese)
2. Copy structure from `es/es.json`
3. Translate all keys
4. In backend: `app()->setLocale('pt')`
5. Done! Middleware loads automatically

No frontend changes needed.

---

## 📞 Quick Help

**Where is the translation I need?**
→ Search in `resources/lang/es/es.json`

**How do I add a new translation?**
→ Follow the template in "Template for New Translations"

**Why doesn't my translation work?**
→ Check it exists in BOTH JSONs and review the key spelling

**How to change language dynamically?**
→ Implementation pending (v1.1.0)

---

**Last Updated**: November 19, 2025  
**Version**: i18n v1.0  
**Status**: ✅ Production Ready
