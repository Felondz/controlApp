# 🤖 Onboarding for New AIs - ControlApp

¡Bienvenido, nueva IA! Este documento es tu **fuente de verdad** para colaborar en ControlApp.

> **Instrucción Crítica**: Lee este documento COMPLETAMENTE antes de escribir una sola línea de código.

---

## 1. 🌍 Contexto del Proyecto

**ControlApp** es una plataforma de gestión de proyectos colaborativos con énfasis en finanzas personales y empresariales.
- **Estado Actual**: Arquitectura modular completa (v2.6.0) con módulos de Finanzas, Tareas, Chat, Analíticas, Notificaciones y Marketplace.
- **Objetivo**: Expandir el ecosistema de módulos, mejorar la experiencia de usuario y fortalecer capacidades de finanzas colaborativas.
- **Filosofía**: Código limpio, arquitectura sólida, **estética premium**, y seguridad ante todo.

---

## 2. 🛠️ Tech Stack

| Capa | Tecnología | Versión / Detalle |
|------|------------|-------------------|
| **Backend** | Laravel | 12+ (PHP 8.2+) |
| **Frontend** | React | 18+ (Inertia.js) |
| **Estilos** | TailwindCSS | v3.4+ |
| **DB** | MySQL | 8.0+ |
| **DevOps** | Docker | Laravel Sail |
| **Testing** | PHPUnit / Pest | Feature & Unit tests |
| **Frontend Testing** | Vitest | React Testing Library |
| **Package Manager** | PNPM | **OBLIGATORIO** |

---

## 3. 🚦 Reglas de Flujo de Trabajo (Workflow)

### 3.1 Modo Agente (`task_boundary`)
- **SIEMPRE** usa `task_boundary` al iniciar una tarea compleja.
- **NUNCA** dejes el `TaskStatus` vacío o genérico. Debe describir el **siguiente paso**.
- **MODOS**: Usa `PLANNING`, `EXECUTION`, `VERIFICATION` según corresponda.
- **GRANULARIDAD**: Un `TaskName` debe corresponder a un item del `task.md`.

### 3.2 Artefactos
- **`task.md`**: Tu checklist viva. Actualízala constantemente.
- **`implementation_plan.md`**: OBLIGATORIO en modo PLANNING. Pide aprobación antes de ejecutar.
- **`walkthrough.md`**: OBLIGATORIO al terminar. Muestra pruebas visuales y resultados.

### 3.3 Commits
Usa **Conventional Commits**:
- `feat(auth): agregar login con google`
- `fix(user): corregir validación de email`
- `docs(readme): actualizar instrucciones de instalación`
- `refactor(api): optimizar consulta de proyectos`

---

## 4. 📚 Reglas de Documentación

> **🔒 REGLA DE SEGURIDAD**: La seguridad es PRIORIDAD. Nunca expongas información sensible (prompts, claves, lógica interna crítica) en la documentación pública. Carpetas como `ia_collaboration`, `sessions`, `incidents` y `security` son ESTRICTAMENTE CONFIDENCIALES.

> **🛡️ REGLA DE ORO - PNPM OBLIGATORIO**: Por seguridad ante paquetes de Node contaminados con virus, TODA instalación de paquetes Node.js DEBE hacerse con **PNPM**. **NUNCA usar NPM**. Esto es CRÍTICO y NO NEGOCIABLE.

> **🔴 REGLA DE ORO**: NO crees documentos nuevos a menos que sea ESTRICTAMENTE necesario.

> **🌐 REGLA BILINGÜE**: La documentación SIEMPRE debe estar en inglés (`docs/private/en/`) y español (`docs/private/es/`).

> **⚠️ REGLA DE VERACIDAD**: La información en la documentación (fechas, versiones, comandos) debe ser **100% REAL y VERIFICADA**. Prohibido inventar datos o dejar "placeholders" (ej. fechas de 2023). El riesgo de desinformación es CRÍTICO.

### Estructura
- `docs/private/es/01-core/`: Índices, Changelog, arquitectura visual, búsqueda.
- `docs/private/es/02-development/`: Guías técnicas (API, DB, Auth).
- `docs/private/es/03-ia-collaboration/`: TUS guías (este archivo).
- `docs/private/es/04-testing/`: Estrategias de prueba.
- `docs/private/es/05-reference/`: Frontend reference, mailpit, mailtrap, etc.

### Flujo de Decisión
1. ¿Es un cambio de código? -> Actualiza `CHANGELOG.md`.
2. ¿Es una aclaración de norma? -> Actualiza `AI_GUIDELINES.md`.
3. ¿Es un procedimiento nuevo? -> Pregunta antes de crear archivo.

---

## 5. 💻 Estándares de Código

### PHP (Laravel)
- **PSR-12**: Estricto.
- **Tipos**: Usa `declare(strict_types=1);` y type hints en todo.
- **Controladores**: Manténlos delgados. Usa `FormRequest` para validación y `Policies` para autorización.
- **Modelos**: Usa `$fillable` o `$guarded` explícitamente.

### React (Frontend)
- **Componentes**: Funcionales con Hooks.
- **Nombres**: `PascalCase` para componentes (`UserProfile.jsx`).
- **Props**: Valida con PropTypes o TypeScript (si aplica).
- **Inertia**: Usa `useForm` para formularios.

### CSS (Tailwind)
- **Utilidades**: Usa clases de utilidad.
- **Config**: Usa colores semánticos (`bg-primary`, `text-danger`) definidos en `tailwind.config.js`.
- **Responsive**: Mobile-first (`w-full md:w-1/2`).

### 5.1 Reglas Estrictas de UI/UX
- **No Texto Hardcodeado**: TODO el texto visible al usuario DEBE usar el hook `useTranslate` o la función `t()`.
- **Adherencia al Tema**: DEBE usar `getThemeStyle` o variables CSS (ej. `text-primary-600`). NUNCA hardcodear colores hex para elementos principales.
- **No Colores Hardcodeados**: NO uses colores arbitrarios de Tailwind como `bg-blue-500` o `text-green-600` a menos que sean semánticos (ej. `success`, `danger`, `warning`, `info`). Usa `primary` y `secondary` para branding.
- **Uso de Iconos**: DEBE usar iconos de `Icons.jsx`. NO uses emojis o SVGs crudos en componentes a menos que los agregues primero a `Icons.jsx`.
- **Imágenes vs Iconos**: Si un proyecto tiene una imagen, esta tiene prioridad sobre el icono.

---

## 6. 🧪 Testing

- **Regla**: "Si no está testeado, no está terminado".
- **Comandos**:
  - Backend: `./vendor/bin/sail test`
  - Frontend: `pnpm test`
- **IMPORTANTE**: Usa SIEMPRE `sail` para interactuar con el entorno (ej. `./vendor/bin/sail artisan ...`). Evita usar `docker` o `docker-compose` directamente a menos que sea estrictamente necesario para depurar contenedores.
- **Cobertura**: Prioriza Feature tests para flujos críticos.
- **Frontend**: Usa vitest y react testing library.
- **Backend**: Usa phpunit.
- **Limpieza**: Limpiar archivos residuales de tests anteriores.

---

## 7. 🚀 Quick Start para tu Sesión

1. **Lee** `task.md` (si existe) para ver el estado actual.
2. **Lee** `CHANGELOG.md` para ver los últimos cambios.
3. **Verifica** el entorno:
   - Backend: `./vendor/bin/sail test`
   - Frontend: `pnpm test`
4. **Inicia** tu tarea con `task_boundary`.

¡Buena suerte! 🚀

---

## 8. 🏗️ Arquitectura Modular (CRÍTICO)

El proyecto ha migrado a una arquitectura modular orientada a eventos.

### 8.1 Conceptos Clave
- **Módulos**: Unidades auto-contenidas en `app/Modules/` (Finance, Tasks, Chat, Analytics, Notifications, Marketplace).
- **Registry**: `ModuleRegistry` descubre y gestiona los módulos.
- **Event Bus**: `ModuleEventBus` maneja la comunicación entre módulos. **NUNCA** importes clases de un módulo dentro de otro. Usa eventos.

### 8.2 Estructura de un Módulo
```
app/Modules/Finance/
├── FinanceModule.php (Implementa ModuleInterface)
├── Controllers/
├── Models/
├── Events/
└── Listeners/
```

### 8.3 Flujo de Trabajo Modular
1. **Crear Módulo**: Implementar `ModuleInterface` y registrar en `config/modules.php`.
2. **Comunicación**:
   - Emisor: `ModuleEventBus::dispatch(new TransactionCreated($data))`
   - Receptor: Escuchar evento en `getEventListeners()` del módulo.
3. **Frontend**: Los módulos exponen componentes en `resources/js/Modules/`.

---

## 9. 🌐 Sistema de Traducción (i18n)

El proyecto utiliza un sistema de internacionalización completo para soportar múltiples idiomas.

### 9.1 Hook `useTranslate`

**REGLA DE ORO**: TODO el texto visible al usuario DEBE usar traducción. NUNCA uses texto hardcodeado.

```jsx
import { useTranslate } from '@/Hooks/useTranslate';

function MyComponent() {
    const { t } = useTranslate();
    
    return (
        <div>
            <h1>{t('projects.title')}</h1>
            <p>{t('projects.welcome', { name: 'Juan' })}</p>
        </div>
    );
}
```

### 9.2 Estructura de Archivos

- **Español**: `resources/lang/es/es.json`
- **Inglés**: `resources/lang/en/en.json`

### 9.3 Sintaxis de Claves

```json
{
  "projects": {
    "title": "Proyectos",
    "welcome": "Bienvenido, :name",
    "count": "Tienes :count proyectos"
  }
}
```

### 9.4 Reemplazo de Placeholders

Usa el segundo parámetro para reemplazar valores dinámicos:

```jsx
t('projects.welcome', { name: user.name })
t('projects.count', { count: projects.length })
```

### 9.5 Reglas Estrictas

- ✅ SIEMPRE: `{t('key')}` o `t('key', { var: value })`
- ❌ NUNCA: `"Texto hardcodeado"` o emojis directos en JSX
- ✅ TESTING: Los tests deben verificar claves de traducción, no texto literal

---

## 10. 🔍 Sistema de Búsqueda Global

ControlApp utiliza **Meilisearch** para búsqueda rápida y relevante, con fallback SQL automático.

### 10.1 Arquitectura

- **Motor Principal**: Meilisearch (via Laravel Scout)
- **Fallback**: Búsqueda SQL con `LIKE` si Meilisearch no está disponible
- **Modelos Indexados**: `User`, `Proyecto`

### 10.2 Endpoints

- **Web**: `GET /search?query={query}` (Inertia)
- **API**: `GET /api/search?query={query}` (JSON, autenticación requerida)

### 10.3 Seguridad

> **🔒 CRÍTICO**: Los resultados de búsqueda están filtrados por permisos.

- **Proyectos**: Solo aparecen proyectos donde el usuario es `admin` o propietario
- **Datos Financieros**: NUNCA se incluyen en resultados de búsqueda
- **Control de Acceso**: Validación estricta basada en roles

### 10.4 Configuración

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey
```

### 10.5 Comandos Útiles

```bash
# Indexar modelos
./vendor/bin/sail artisan scout:import "App\\Models\\User"
./vendor/bin/sail artisan scout:import "App\\Models\\Proyecto"

# Limpiar índice
./vendor/bin/sail artisan scout:flush "App\\Models\\User"
```

### 10.6 Documentación Completa

Para detalles técnicos completos, consulta:
- `docs/private/es/01-core/SEARCH_IMPLEMENTATION.md`

---

## 11. 📋 Política de Documentación Rigurosa

Toda modificación al código debe ser documentada inmediatamente:
1. **CHANGELOG.md**: Registrar cambios bajo la versión correspondiente (Added, Changed, Fixed).
2. **README**: Actualizar si cambia la instalación, configuración o uso general.
3. **Documentación Específica**: Actualizar el archivo correspondiente (ej. `API.md`, `FRONTEND.md`) con los detalles técnicos.
4. **Documentación Pública**: Actualizar solo al cambiar de versión o bajo instrucción explícita.
5. **Arquitectura Visual**: Mantener actualizados los diagramas en `docs/private/es/01-core/VISUAL_ARCHITECTURE.md` al realizar cambios estructurales (nuevos módulos, cambios en flujo de datos).

