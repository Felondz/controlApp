# 🤖 Onboarding for New AIs - ControlApp

¡Bienvenido, nueva IA! Este documento es tu **fuente de verdad** para colaborar en ControlApp.

> **Instrucción Crítica**: Lee este documento COMPLETAMENTE antes de escribir una sola línea de código.

---

## 1. 🌍 Contexto del Proyecto

**ControlApp** es una plataforma de gestión de proyectos colaborativos.
- **Estado Actual**: Funcionalidades de gestión financiera (cuentas, transacciones) implementadas.
- **Objetivo**: Expandir a gestión integral de proyectos.
- **Filosofía**: Código limpio, arquitectura sólida, y **estética premium**.

---

## 2. 🛠️ Tech Stack

| Capa | Tecnología | Versión / Detalle |
|------|------------|-------------------|
| **Backend** | Laravel | 11+ (PHP 8.2+) |
| **Frontend** | React | 18+ (Inertia.js) |
| **Estilos** | TailwindCSS | v3.4+ |
| **DB** | MySQL | 8.0+ |
| **DevOps** | Docker | Laravel Sail |
| **Testing** | PHPUnit / Pest | Feature & Unit tests |

---

## 3. 🚦 Reglas de Flujo de Trabajo (Workflow)

### 3.1 Modo Agente (`task_boundary`)
- **SIEMPRE** usa `task_boundary` al iniciar una tarea compleja.
- **NUNCA** dejes el `TaskStatus` vacío o genérico. Debe describir el **siguiente paso**.
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
> **🔴 REGLA DE ORO**: NO crees documentos nuevos a menos que sea ESTRICTAMENTE necesario.
> **🌐 REGLA BILINGÜE**: La documentación SIEMPRE debe estar en inglés (`docs/en/`) y español (`docs/es/`).
> **⚠️ REGLA DE VERACIDAD**: La información en la documentación (fechas, versiones, comandos) debe ser **100% REAL y VERIFICADA**. Prohibido inventar datos o dejar "placeholders" (ej. fechas de 2023). El riesgo de desinformación es CRÍTICO.

### Estructura
- `docs/es/01-core/`: Índices, Changelog.
- `docs/es/02-development/`: Guías técnicas (API, DB, Auth).
- `docs/es/03-ia-collaboration/`: TUS guías (este archivo).
- `docs/es/04-testing/`: Estrategias de prueba.

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
- **Utilidades**: Usa clases de utilidad siempre que sea posible.
- **Config**: Usa colores semánticos (`bg-primary`, `text-danger`) definidos en `tailwind.config.js`.
- **Responsive**: Mobile-first (`w-full md:w-1/2`).

---

## 6. 🧪 Testing

- **Regla**: "Si no está testeado, no está terminado".
- **Comando**: `php artisan test` (o `docker compose exec laravel.test php artisan test`).
- **Cobertura**: Prioriza Feature tests para flujos críticos.

---

## 7. 🚀 Quick Start para tu Sesión

1. **Lee** `task.md` (si existe) para ver el estado actual.
2. **Lee** `CHANGELOG.md` para ver los últimos cambios.
3. **Verifica** el entorno con `sail artisan test`.
4. **Inicia** tu tarea con `task_boundary`.

¡Buena suerte! 🚀
## Política de Documentación Rigurosa
Toda modificación al código debe ser documentada inmediatamente:
1. **CHANGELOG.md**: Registrar cambios bajo la versión correspondiente (Added, Changed, Fixed).
2. **README**: Actualizar si cambia la instalación, configuración o uso general.
3. **Documentación Específica**: Actualizar el archivo correspondiente (ej. `API.md`, `FRONTEND.md`) con los detalles técnicos.
4. **Documentación Pública**: Actualizar solo al cambiar de versión o bajo instrucción explícita.
