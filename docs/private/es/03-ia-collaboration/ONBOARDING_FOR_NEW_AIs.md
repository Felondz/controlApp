# 🤖 Onboarding for New AIs - ControlApp

¡Bienvenido, nueva IA! Este documento es tu **fuente de verdad** para colaborar en ControlApp.

> **Instrucción Crítica**: Lee este documento COMPLETAMENTE antes de escribir una sola línea de código.

---

## 1. 🌍 Contexto del Proyecto

**ControlApp** es una plataforma de gestión de proyectos colaborativos.
- **Estado Actual**: Arquitectura modular completa (v2.3.0) con módulos de Finanzas, Tareas, Chat, Analíticas, Notificaciones y Marketplace.
- **Objetivo**: Expandir el ecosistema de módulos y mejorar la experiencia de usuario.
- **Filosofía**: Código limpio, arquitectura sólida, y **estética premium**.

---

## 2. 🛠️ Tech Stack

| Capa | Tecnología | Versión / Detalle |
|------|------------|-------------------|
| **Backend** | Laravel | 12+ (PHP 8.2+) |
| **Frontend** | React | 18+ (Inertia.js) |
| **Estilos** | TailwindCSS | v3.4+ |
| **DB** | MySQL | 8.0+ |
| **DevOps** | Docker | Laravel Sail |
| **Testing** | PHPUnit / Pest | Feature & Unit tests | vitest y react testing library

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
> **🔴 REGLA DE ORO**: NO crees documentos nuevos a menos que sea ESTRICTAMENTE necesario.
> **🌐 REGLA BILINGÜE**: La documentación SIEMPRE debe estar en inglés (`docs/en/`) y español (`docs/es/`).
> **⚠️ REGLA DE VERACIDAD**: La información en la documentación (fechas, versiones, comandos) debe ser **100% REAL y VERIFICADA**. Prohibido inventar datos o dejar "placeholders" (ej. fechas de 2023). El riesgo de desinformación es CRÍTICO.

### Estructura
- `docs/es/01-core/`: Índices, Changelog.
- `docs/es/02-development/`: Guías técnicas (API, DB, Auth).
- `docs/es/03-ia-collaboration/`: TUS guías (este archivo).
- `docs/es/04-testing/`: Estrategias de prueba.
- `docs/es/05-reference/`: Frontend reference, mailpit, mailtrap, etc.

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

---

## 6. 🧪 Testing

- **Regla**: "Si no está testeado, no está terminado".
- **Comando**: `./vendor/bin/sail test` (o `php artisan test` si tienes el entorno local configurado).
- **IMPORTANTE**: Usa SIEMPRE `sail` para interactuar con el entorno (ej. `./vendor/bin/sail artisan ...`). Evita usar `docker` o `docker-compose` directamente a menos que sea estrictamente necesario para depurar contenedores.
- **Cobertura**: Prioriza Feature tests para flujos críticos.
- **Frontend**: Use vitest and react testing library.
- **Backend**: Use phpunit.
- **Limpieza**: limpiar archivos residuales de tests anteriores.

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
5. **Arquitectura Visual**: Mantener actualizados los diagramas en `docs/private/es/01-core/VISUAL_ARCHITECTURE.md` al realizar cambios estructurales (nuevos módulos, cambios en flujo de datos).
