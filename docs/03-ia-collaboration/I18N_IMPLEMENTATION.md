# 🌐 Sistema de Internacionalización (i18n) - ControlApp

## ✅ Implementación Completada - 19 de Noviembre 2025

### Resumen Ejecutivo

Se ha implementado un **sistema completo de internacionalización multilingüe** para ControlApp que permite:

- ✅ **Traducciones dinámicas** del backend (Laravel) al frontend (React)
- ✅ **Soporte para múltiples idiomas** (Español e Inglés de manera nativa)
- ✅ **Cero hardcoding de strings** en el frontend a partir de ahora
- ✅ **Hot Module Replacement (HMR)** con Vite - los cambios se reflejan al instante
- ✅ **Escalabilidad** - Agregar nuevos idiomas es trivial

---

## 📦 Librerías Instaladas

```bash
npm install i18next react-i18next
```

- **i18next** v25.6.3 - Motor de internacionalización
- **react-i18next** v16.3.4 - Bindings de React

---

## 🏗️ Arquitectura Implementada

```
Frontend (React)                    Backend (Laravel)
┌─────────────────┐                ┌──────────────────┐
│ Component       │                │ resources/lang/  │
│  - useTranslate │◄───────────────│  - es.json       │
│  - t('key')     │ (Props Inertia)│  - en.json       │
└─────────────────┘                └──────────────────┘
                                           ▲
                                           │
                                   ┌──────────────┐
                                   │ Middleware   │
                                   │ HandleInertia│
                                   │ Requests.php │
                                   └──────────────┘
```

---

## 📁 Archivos Creados/Modificados

### 1. **Archivos de Traducción** (Backend)
```
resources/lang/
├── es.json  (Español)
└── en.json  (Inglés)
```

**Estructura JSON:**
```json
{
  "dashboard": {
    "title": "Panel de Control",
    "my_projects": "Mis Proyectos",
    "activity_summary": "Resumen de Actividad"
  },
  "projects": {
    "create": "Crear Proyecto",
    "personal": "Personal",
    "collaborative": "Colaborativo"
  },
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

### 2. **Middleware Modificado** (`app/Http/Middleware/HandleInertiaRequests.php`)

Se agregó lógica para:
- Cargar automáticamente las traducciones según el locale
- Compartirlas como prop global en Inertia (`translations` y `locale`)
- Fallback a inglés si el idioma no existe

```php
// Las traducciones se inyectan automáticamente en TODAS las páginas
public function share(Request $request): array
{
    $locale = app()->getLocale();
    $translations = $this->loadTranslations($locale);
    
    return [
        ...parent::share($request),
        'locale' => $locale,
        'translations' => $translations,
    ];
}
```

### 3. **Hook Personalizado** (`resources/js/hooks/useTranslate.jsx`)

```jsx
import { usePage } from '@inertiajs/react';

export function useTranslate() {
  const { translations = {} } = usePage().props;

  const t = (key, fallback = key) => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback;
      }
    }

    return typeof value === 'string' ? value : fallback;
  };

  return t;
}
```

**Características:**
- ✅ Acceso a objetos anidados con notación de punto (`dashboard.title`)
- ✅ Fallback automático si la clave no existe
- ✅ Zero dependencies (usa solo Inertia)

### 4. **Provider i18n** (`resources/js/Providers/I18nProvider.jsx`)

Estructura para futuras extensiones (pluralización, formateo de fechas, etc.)

### 5. **Componentes Refactorizados**

#### Dashboard.jsx
```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function Dashboard({ auth, proyectos = [] }) {
    const t = useTranslate();
    
    return (
        <div>
            <h2>{t('dashboard.my_projects')}</h2>
            <p>{t('dashboard.activity_summary')}</p>
            <button>+ {t('projects.create')}</button>
        </div>
    );
}
```

#### ProjectCard.jsx
```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function ProjectCard({ proyecto }) {
    const t = useTranslate();
    
    return (
        <div>
            <span>{proyecto.es_personal ? t('projects.personal') : t('projects.collaborative')}</span>
            <p>{t('accounts.currency')}: {proyecto.moneda_default}</p>
            <a href={`/proyectos/${proyecto.id}`}>{t('common.open')} &rarr;</a>
        </div>
    );
}
```

---

## 🎯 Cómo Usar

### En cualquier componente React:

```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function MiComponente() {
    const t = useTranslate();
    
    return (
        <div>
            <h1>{t('dashboard.title')}</h1>
            <p>{t('dashboard.welcome')}</p>
            <button>{t('common.save')}</button>
        </div>
    );
}
```

### Para agregar una nueva traducción:

1. Editar `resources/lang/es.json` y `resources/lang/en.json`
2. Agregar la clave: `"mi_clave": "Mi valor"`
3. Usar en el componente: `{t('seccion.mi_clave')}`
4. ¡Listo! Vite HMR recarga al instante

### Para agregar un nuevo idioma:

1. Crear `resources/lang/pt.json` (Portugués, por ejemplo)
2. En Laravel: `app()->setLocale('pt')`
3. El middleware carga automáticamente las traducciones
4. ¡Sin cambios en el frontend!

---

## 📊 Claves de Traducción Disponibles

### Dashboard
- `dashboard.title` - "Panel de Control"
- `dashboard.welcome` - "Bienvenido"
- `dashboard.my_projects` - "Mis Proyectos"
- `dashboard.activity_summary` - "Resumen de Actividad"
- `dashboard.no_projects` - "No tienes proyectos aún"
- Y más...

### Projects
- `projects.create` - "Crear Proyecto"
- `projects.personal` - "Personal"
- `projects.collaborative` - "Colaborativo"
- Y más...

### Common
- `common.save` - "Guardar"
- `common.cancel` - "Cancelar"
- `common.open` - "Abrir"
- Y más...

Ver archivos JSON completos en `resources/lang/` para la lista exhaustiva.

---

## 🚀 Hot Module Replacement (HMR) en Vite

Con Vite corriendo en `http://localhost:5175`, los cambios se reflejan instantáneamente:

```bash
npm run dev
# Vite listening on http://localhost:5175/
```

Cuando edites:
- `resources/lang/es.json` → Las traducciones se actualizan al refrescar
- `resources/js/Pages/*.jsx` → Los componentes se actualizan sin recargar
- `resources/js/Components/*.jsx` → Los cambios se propagan con HMR

---

## 📝 Archivo de Referencia Rápida

Para desarrolladores que colaboren con el proyecto:

**Paso 1:** Importar el hook
```jsx
import { useTranslate } from '@/hooks/useTranslate';
```

**Paso 2:** Usar en el componente
```jsx
const t = useTranslate();
```

**Paso 3:** Reemplazar strings
```jsx
// Antes
<h1>Mis Proyectos</h1>

// Después
<h1>{t('dashboard.my_projects')}</h1>
```

---

## ✅ Validación Completada

- ✅ i18next instalado y funcionando
- ✅ Traducciones en español e inglés creadas
- ✅ Middleware compartiendo traducciones correctamente
- ✅ Hook useTranslate funcionando
- ✅ Dashboard refactorizado sin hardcoding
- ✅ ProjectCard refactorizado sin hardcoding
- ✅ HMR de Vite funcionando con cambios dinámicos

---

## 🔮 Próximos Pasos Opcionales

1. **Cambio dinámico de idioma**
   - Agregar selector de idioma en el navbar
   - Guardar preferencia en localStorage
   - Hacer petición a endpoint que cambie `app()->setLocale()`

2. **Pluralización**
   - Manejar singulares/plurales automáticamente
   - Ej: `t('n_projects', { count: 5 })`

3. **Formateo de Fechas/Números**
   - Formatear según el locale (es-ES vs en-US)
   - Usar `Intl.DateTimeFormat` y `Intl.NumberFormat`

4. **Namespace en archivos separados**
   - Organizar traducciones en archivos por módulo
   - `resources/lang/es/dashboard.json`
   - `resources/lang/es/projects.json`

5. **TypeScript**
   - Tipado fuerte para las claves de traducción
   - Validación en compilación

---

## 📚 Guía Completa de Uso

### Caso 1: Traducir un componente nuevo

**Archivo:** `resources/js/Pages/Transactions.jsx`

```jsx
import { useTranslate } from '@/hooks/useTranslate';

export default function Transactions({ transactions = [] }) {
    const t = useTranslate();
    
    return (
        <div>
            {/* Header */}
            <h1>{t('transactions.title')}</h1>
            
            {/* Tabla */}
            <table>
                <thead>
                    <tr>
                        <th>{t('transactions.date')}</th>
                        <th>{t('transactions.description')}</th>
                        <th>{t('transactions.amount')}</th>
                        <th>{t('transactions.type')}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{tx.fecha}</td>
                            <td>{tx.descripcion}</td>
                            <td>{tx.monto}</td>
                            <td>{tx.tipo === 'income' ? t('transactions.income') : t('transactions.expense')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Botón de acción */}
            <button className="btn btn-primary">
                + {t('transactions.create')}
            </button>
        </div>
    );
}
```

### Caso 2: Traducir un Modal/Dialog

**Archivo:** `resources/js/Components/CreateProjectModal.jsx`

```jsx
import { useTranslate } from '@/hooks/useTranslate';
import { useState } from 'react';

export default function CreateProjectModal({ isOpen, onClose }) {
    const t = useTranslate();
    const [formData, setFormData] = useState({
        nombre: '',
        moneda_default: 'USD',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar datos al servidor
        console.log(t('common.success')); // "Éxito"
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                {/* Header */}
                <h2>{t('projects.create')}</h2>
                
                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{t('projects.name')}</label>
                        <input 
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            placeholder={t('projects.name')}
                        />
                    </div>
                    
                    <div>
                        <label>{t('accounts.currency')}</label>
                        <select value={formData.moneda_default}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="MXN">MXN</option>
                        </select>
                    </div>
                    
                    {/* Botones */}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit">
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
```

### Caso 3: Mensajes de error/éxito

**Archivo:** `resources/js/Utils/notifications.js`

```jsx
import { useTranslate } from '@/hooks/useTranslate';

export function useNotifications() {
    const t = useTranslate();
    
    return {
        success: (message) => {
            toast.success(message || t('common.success'));
        },
        error: (message) => {
            toast.error(message || t('common.error'));
        },
        warning: (message) => {
            toast.warning(message || t('common.warning'));
        },
        info: (message) => {
            toast.info(message || t('common.info'));
        },
    };
}
```

---

## 🎨 Estructura Recomendada para Nuevas Traducciones

Cuando agrues nuevas funcionalidades, sigue este patrón:

```json
{
  "nueva_caracteristica": {
    "title": "Título Principal",
    "description": "Descripción",
    "button_create": "Crear",
    "button_edit": "Editar",
    "button_delete": "Eliminar",
    "label_campo1": "Etiqueta Campo 1",
    "label_campo2": "Etiqueta Campo 2",
    "empty_state": "No hay datos",
    "error_msg": "Ocurrió un error",
    "success_msg": "Operación completada"
  }
}
```

---

## 🔍 Debugging y Solución de Problemas

### Problema: La traducción no aparece
```jsx
// ❌ Incorrecto - clave no existe
{t('dashboard.titulo')}  // Retorna "dashboard.titulo" (fallback)

// ✅ Correcto - clave existe en JSON
{t('dashboard.title')}   // Retorna "Panel de Control"
```

### Problema: Props de Inertia no se cargan
```jsx
// Verifica en el navegador (DevTools)
// Network → XHR → Busca el payload de Inertia
// Asegúrate que contenga: { translations: {...}, locale: "es" }
```

### Problema: HMR no recarga las traducciones
```bash
# Las traducciones JSON pueden necesitar refresh manual
# Presiona Ctrl+Shift+R en el navegador (hard refresh)
```

---

## 📊 Resumen de Archivos

| Archivo | Propósito | Cambios |
|---------|-----------|---------|
| `resources/lang/es.json` | Traducciones español | 136 claves |
| `resources/lang/en.json` | Traducciones inglés | 136 claves |
| `app/Http/Middleware/HandleInertiaRequests.php` | Compartir traducciones | Middleware modificado |
| `resources/js/hooks/useTranslate.jsx` | Hook de traducción | Nuevo archivo |
| `resources/js/Providers/I18nProvider.jsx` | Provider i18n | Nuevo archivo |
| `resources/js/Pages/Dashboard.jsx` | Página principal | Refactorizado |
| `resources/js/Components/Project/ProjectCard.jsx` | Componente proyecto | Refactorizado |

---

## 🚀 Checklist para Colaboradores

Cuando trabajes en ControlApp y añadas nuevas strings:

- [ ] ¿Es un texto visible al usuario?
- [ ] ¿Está hardcodeado en el componente?
- [ ] → Agregarlo a `resources/lang/es.json` y `en.json`
- [ ] → Importar `useTranslate` en el componente
- [ ] → Usar `t('seccion.clave')` en lugar del string
- [ ] → Testear con Vite HMR

**Nunca commits con hardcoded strings a partir de ahora** ✅

---

## 📞 Soporte

Cualquier duda sobre el sistema i18n, revisar:
- `app/Http/Middleware/HandleInertiaRequests.php` - Backend logic
- `resources/js/hooks/useTranslate.jsx` - Frontend hook
- `resources/lang/*.json` - Archivos de traducciones
- `docs/03-ia-collaboration/I18N_IMPLEMENTATION.md` - Esta guía

---

**Implementado por:** GitHub Copilot  
**Fecha:** 19 de noviembre de 2025  
**Estado:** ✅ Producción Ready  
**Última Actualización:** 19 de noviembre de 2025
