# 🌐 i18n Quick Reference - ControlApp

## ⚡ Para IAs que colaboren en el proyecto

### Regla de Oro
> **NUNCA hardcodear strings en componentes React**

Todo texto visible al usuario debe estar:
1. En `resources/lang/es.json` y `resources/lang/en.json`
2. Accedido a través del hook `useTranslate()`

---

## 🎯 FLUJO IDEAL (Crítico)

**Este es el orden CORRECTO para evitar "deuda técnica" de traducciones:**

### ANTES de escribir React, agregar a JSONs:

#### 1️⃣ Editar `resources/lang/es.json`
```json
{
  "accounts": {
    "balance": "Balance de Cuentas",
    "total": "Total"
  }
}
```

#### 2️⃣ Editar `resources/lang/en.json` (⚠️ NUNCA omitir)
```json
{
  "accounts": {
    "balance": "Account Balance",
    "total": "Total"
  }
}
```

#### 3️⃣ Luego escribir React
```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function Accounts() {
    const t = useTranslate();
    return <h1>{t('accounts.balance')}</h1>;
}
```

### Verificar automáticamente:
- ✅ Si ves: "Balance de Cuentas" → Clave existe ✓
- ❌ Si ves: "accounts.balance" → Falta en JSON (fallback te lo muestra)

---

## 💡 Fallback Automático (Tu Aliado)

El hook `useTranslate()` tiene fallback inteligente:

```jsx
// Si la clave NO existe:
{t('accounts.missing')}

// Renderiza: "accounts.missing" (la clave misma)
// Esto te AYUDA a identificar errores rápidamente
```

**Beneficio**: Si ves texto raro como "accounts.balance" en pantalla, sabes que:
- Olvidaste agregar la clave a `es.json`
- O olvidaste agregar a `en.json`
- El fallback es un CANARIO de errores

---

## 🔧 5 Pasos para Traducir Cualquier Componente

### Paso 1: Importar el hook
```jsx
import { useTranslate } from '@/hooks/useTranslate';
```

### Paso 2: Crear instancia de traducción
```jsx
export default function MiComponente() {
    const t = useTranslate();
    // ...
}
```

### Paso 3: Reemplazar strings
```jsx
// ❌ ANTES (hardcoding)
<h1>Mis Proyectos</h1>
<button>Crear Proyecto</button>

// ✅ DESPUÉS (con traducciones)
<h1>{t('dashboard.my_projects')}</h1>
<button>{t('projects.create')}</button>
```

### Paso 4: Si la clave NO existe
1. ✅ PRIMERO: Editar `resources/lang/es.json`
2. ✅ SEGUNDO: Editar `resources/lang/en.json` (SIEMPRE AMBOS)
3. ✅ Luego: Usar en componente React
4. ❌ NUNCA: Lo contrario (no code first, i18n después)

### Paso 5: Testear
- Vite HMR recargará automáticamente
- Los cambios aparecen al instante (<100ms)

---

## 📝 Plantilla de Nueva Clave

Cuando necesites agregar una nueva sección de traducciones:

**En `resources/lang/es.json`:**
```json
{
  "mi_seccion": {
    "titulo": "Título",
    "subtitulo": "Subtítulo",
    "boton_crear": "Crear",
    "boton_editar": "Editar",
    "mensaje_exito": "Operación completada",
    "mensaje_error": "Ocurrió un error",
    "sin_datos": "No hay datos"
  }
}
```

**En `resources/lang/en.json`:**
```json
{
  "mi_seccion": {
    "titulo": "Title",
    "subtitulo": "Subtitle",
    "boton_crear": "Create",
    "boton_editar": "Edit",
    "mensaje_exito": "Operation completed",
    "mensaje_error": "An error occurred",
    "sin_datos": "No data"
  }
}
```

---

## 💡 Ejemplos Prácticos

### Traducir un h1
```jsx
// ❌ NO (hardcoding)
<h1>Bienvenido al Dashboard</h1>

// ✅ SÍ (con traducción)
<h1>{t('dashboard.welcome')}</h1>
```

### Traducir un botón
```jsx
// ❌ NO (hardcoding)
<button>Guardar Cambios</button>

// ✅ SÍ
<button>{t('common.save')}</button>
```

### Traducir un span condicional
```jsx
// ❌ NO
<span>{usuario.activo ? 'Activo' : 'Inactivo'}</span>

// ✅ SÍ
<span>{usuario.activo ? t('common.active') : t('common.inactive')}</span>
```

### Traducir un placeholder
```jsx
// ❌ NO
<input placeholder="Escribe tu nombre" />

// ✅ SÍ
<input placeholder={t('common.enter_name')} />
```

### Traducir un aria-label
```jsx
// ❌ NO
<button aria-label="Eliminar proyecto">X</button>

// ✅ SÍ
<button aria-label={t('projects.delete')}>X</button>
```

---

## 📋 Checklist Rápido

Antes de hacer commit:
- [ ] ¿Hay strings hardcodeados en JSX?
- [ ] ¿Están todos los strings en las claves JSON?
- [ ] ¿Se usa `t()` en todos los textos?
- [ ] ¿Se agregaron las claves en es.json Y en.json?
- [ ] ¿Testeé con Vite HMR?

---

## 🎯 Claves Disponibles por Categoría

### Dashboard
```
dashboard.title
dashboard.welcome
dashboard.my_projects
dashboard.activity_summary
dashboard.recent_transactions
dashboard.no_projects
dashboard.create_project
dashboard.total_projects
dashboard.active_members
dashboard.total_balance
```

### Projects
```
projects.title
projects.create
projects.personal
projects.collaborative
projects.name
projects.description
projects.currency
projects.members
projects.edit
projects.delete
projects.my_role
```

### Common
```
common.save
common.cancel
common.delete
common.edit
common.add
common.search
common.filter
common.loading
common.error
common.success
common.warning
common.info
common.yes
common.no
common.open
common.close
```

Ver `resources/lang/es.json` para la lista completa.

---

## ⚠️ Errores Comunes

### ❌ Error 1: Ver la clave en pantalla

```jsx
{t('dashboard.titulo')}

// En pantalla ves: "dashboard.titulo"
// Significa: LA CLAVE NO EXISTE en los JSONs
```

**Causa probable**: 
- Olvidaste agregar a `es.json`
- O olvidaste agregar a `en.json`
- O typo en la clave

**Cómo encontrar el error (Fallback es tu amigo)**:
```
Si ves "dashboard.titulo" en pantalla:
1. Verifica es.json: ¿existe "dashboard.titulo"?
2. Verifica en.json: ¿existe "dashboard.titulo"?
3. ¿Hay typo? (dashboard.titilo vs dashboard.titulo)

El fallback te MUESTRA exactamente qué clave falta.
```

### ❌ Error 2: Clave con typo
```jsx
{t('dashboard.titel')}  // ← typo: "titel" vs "title"

// Pantalla mostrará: "dashboard.titel"
// Te dice: Esta clave NO existe
```
**Solución:** Verificar la clave exacta en el JSON vs el código

### ❌ Error 3: Olvidar agregar a un idioma
```json
// es.json - TIENEN la clave ✓
"proyectos.crear": "Crear"

// en.json - NO TIENEN la clave ✗
// (olvidaste copiarla)

// Resultado en inglés: Verás "proyectos.crear"
```

**Solución:** 
```
SIEMPRE agregar AMBOS idiomas:
- Agregar a es.json
- LUEGO agregar a en.json
- NUNCA omitir uno

Si ves una clave en pantalla, significa:
└─ Falta en al menos uno de los JSONs
```

### ❌ Error 4: Mezclar strings y variables
```jsx
// ❌ MALO (mixto)
<p>{t('usuario')}: {usuario.nombre}</p>

// ✅ BIEN (separado)
<p>{usuario.nombre}</p>  // Solo variable
// Si necesitas etiqueta:
<label>{t('common.name')}: {usuario.nombre}</label>
```

### ❌ Error 5: Hardcodear en lugar de traducir
```jsx
// ❌ NUNCA
<h1>"Mis Proyectos"</h1>

// ✅ SIEMPRE
<h1>{t('dashboard.my_projects')}</h1>

// La clave NO EXISTE en JSON:
// Verás: "dashboard.my_projects" (fallback)
// Solución: Agregar a es.json y en.json primero
```

---

## 💡 Fallback System (Tu Herramienta de Debug)

El fallback automático es **inteligente**: si ves la clave en pantalla, significa que falta.

```
FLUJO DE DEBUG:
1. Ves texto extraño en pantalla: "dashboard.missing"
   ↓
2. Es el FALLBACK (significa que la clave no existe)
   ↓
3. Verificas es.json: "dashboard.missing" ✗
   ↓
4. Agregás la clave: "dashboard.missing": "Falta Recurso"
   ↓
5. Verificas en.json: "dashboard.missing" ✗
   ↓
6. Agregás la clave: "dashboard.missing": "Missing Resource"
   ↓
7. Vuelves a cargar: ¡Listo! Ahora aparece traducido
```

**Ventaja**: El fallback te MUESTRA exactamente qué está roto.
Es como un test automático de traducciones.

---

## 🚀 Agregar un Nuevo Idioma

1. Crear `resources/lang/pt.json` (Portugués)
2. Copiar estructura de `es.json`
3. Traducir todas las claves
4. En backend: `app()->setLocale('pt')`
5. ¡Listo! El middleware carga automáticamente

No necesitas cambiar nada en el frontend.

---

## 📞 Quick Help

**¿Dónde está la traducción que necesito?**
→ Busca en `resources/lang/es.json`

**¿Cómo agrego una nueva traducción?**
→ Sigue la plantilla en "Plantilla de Nueva Clave"

**¿Por qué no funciona mi traducción?**
→ Verifica que existe en AMBOS JSON y revisa el typo

**¿Cómo cambio de idioma dinámicamente?**
→ Implementación pendiente (v1.1.0)

---

**Última Actualización:** 19 de noviembre de 2025  
**Versión:** i18n v1.0  
**Estado:** ✅ Producción Ready
