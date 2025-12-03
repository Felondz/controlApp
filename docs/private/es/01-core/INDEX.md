# 📚 ControlApp - Documentación Completa

Bienvenido a la documentación de **ControlApp** - Plataforma de gestión de proyectos colaborativos.

> **ControlApp** es una plataforma de gestión de proyectos que permite a usuarios crear, colaborar y gestionar proyectos. La primera feature implementada es **Gestión Financiera** (cuentas, transacciones, categorías). Próximas features incluirán más funcionalidades de gestión de proyectos.

> **Nota**: Esta documentación está organizada en carpetas temáticas. Selecciona tu rol para encontrar lo que necesitas.

---

## 🗂️ Estructura de Documentación

```
docs/
├── 01-core/                     # 📍 Comienza aquí
│   ├── INDEX.md                (este archivo)
│   ├── CHANGELOG.md            (cambios técnicos detallados)
│   └── QUICK_REFERENCE.md      (comandos y atajos)
│
├── 02-development/             # 💻 Para desarrolladores
│   ├── INSTALLATION.md         (cómo instalar)
│   ├── API.md                  (endpoints - UPDATED)
│   ├── AUTHENTICATION.md       (sistema de auth - UPDATED)
│   ├── AUTHORIZATION_VALIDATION.md (NEW - Policies, FormRequest, Rate Limiting)
│   ├── DATABASE.md             (esquema y modelos)
│   ├── CONTRIBUTING.md         (cómo contribuir)
│   └── README.md               (guide para developers)
│
├── 03-ia-collaboration/        # 🤖 Para IAs colaborando
│   ├── AI_GUIDELINES.md        (normas y flujos)
│   ├── ONBOARDING_FOR_NEW_AIs.md (COPY-PASTE en chat)
│   └── HOW_TO_SWITCH_TO_NEW_AI.md (procedimiento de cambio)
│
├── 04-testing/                 # 🧪 Testing y QA
│   ├── TESTING_ARCHITECTURE.md (estrategia de testing)
│   ├── TESTING_SCRIPTS.md      (scripts de testing)
│   ├── TESTING.md              (documentación general)
│   └── TESTING_*.md            (archivos históricos)
│
├── 05-reference/               # 📖 Referencias
│   ├── MAILPIT_GUIDE.md        (Mailpit local SMTP)
│   ├── MAILTRAP_GUIDE.md       (configurar emails)
│   └── MAILTRAP_VISUALIZATION.md (ver emails capturados)
│
└── 06-security/                # � Seguridad (NEW - Comprehensive)
    ├── README.md               (overview de seguridad)
    ├── SECURITY_AUDIT.md       (NEW - Audit findings & fixes)
    ├── PRODUCTION_DEPLOYMENT.md (NEW - Deployment checklist)
    ├── COMPLETION_SUMMARY.md   (NEW - What was fixed)
    └── SECURITY_CONFIGURATION.md (herramientas de seguridad)
```

---

## 🎯 Selecciona tu rol

### 👤 Soy usuario final

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. ¡Comenzar a usar!
```

---

### 💻 Soy desarrollador
````

---

## 🎯 Selecciona tu rol

### 👤 Soy usuario final

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. ¡Comenzar a usar!
```

---

### 💻 Soy desarrollador

```
1. Leer: ../../README.md (5 min)
   ↓
2. Instalar: ../02-development/INSTALLATION.md (15 min)
   ↓
3. Estudiar: ../02-development/DATABASE.md (10 min)
   ↓
4. Seguridad: ../02-development/AUTHENTICATION.md (10 min)
   ↓
5. Autorización: ../02-development/AUTHORIZATION_VALIDATION.md (20 min)
   ↓
6. API Docs: ../02-development/API.md (15 min)
   ↓
7. Contribuir: ../02-development/CONTRIBUTING.md
   ↓
8. Ver cambios: ../01-core/CHANGELOG.md
```

### 🔐 Necesito entender seguridad

```
1. Empezar: ../06-security/README.md
   ↓
2. Audit: ../06-security/SECURITY_AUDIT.md (comprehensive)
   ↓
3. Deployment: ../06-security/PRODUCTION_DEPLOYMENT.md
   ↓
4. Dev Guide: ../02-development/AUTHENTICATION.md
   ↓
5. Code Examples: ../02-development/AUTHORIZATION_VALIDATION.md
```

---

### 🤖 Soy IA colaborando en el proyecto

**🚀 Quick Start: 5-15 minutos para empezar**

```
1. Copia COMPLETAMENTE: ../03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
2. Pega en el chat de esta IA
3. Di: "He aquí el contexto del proyecto, léelo completamente"
4. Espera confirmación
5. Describe tu tarea
✅ Listo, la IA ya tiene todo el contexto necesario
```

**Documentos que DEBES leer**:

| Paso | Documento | Tiempo | Razón |
|------|-----------|--------|-------|
| 1 | **ONBOARDING_FOR_NEW_AIs.md** | 10 min | Entiendes estructura y normas |
| 2 | **AI_GUIDELINES.md** | 15 min | Sabes cómo debo comportarme |
| 3 | **CHANGELOG.md** (últimas entradas) | 5 min | Entiendes contexto histórico |

**Si cambias de IA en próxima sesión**:
→ Lee: **HOW_TO_SWITCH_TO_NEW_AI.md** (tu guía exacta de procedimiento)

---

### 🧪 Soy QA / Testing

```
1. Leer: ../04-testing/TESTING_ARCHITECTURE.md (20 min)
   └─ Entiende estrategia completa

2. Leer: ../04-testing/TESTING_SCRIPTS.md (10 min)
   └─ Aprende todos los comandos

3. Ver: ../04-testing/TESTING.md (referencia)
   └─ Documentación general

✅ Ahora sabes cómo ejecutar y escribir tests
```

---

### 🤝 Soy contribuidor

```
1. Leer: ../02-development/CONTRIBUTING.md (10 min)
   ↓
2. Leer: ../02-development/DATABASE.md (10 min)
   ↓
3. Leer: ../02-development/API.md (15 min)
   ↓
4. Ver: CHANGELOG.md (últimas entradas) (5 min)
   ↓
5. Hacer pull request ✅
```

---

## 📖 Navegación Rápida

### Encuentro lo que busco

| Pregunta | Carpeta | Documento |
|----------|---------|-----------|
| "¿Cómo instalo ControlApp?" | 02-development | INSTALLATION.md |
| "¿Cuáles son los endpoints?" | 02-development | API.md |
| "¿Cómo funciona autenticación?" | 02-development | AUTHENTICATION.md |
| "¿Cuál es estructura de BD?" | 02-development | DATABASE.md |
| "¿Cómo contribuyo?" | 02-development | CONTRIBUTING.md |
| "¿Qué cambios hubo?" | 01-core | CHANGELOG.md |
| "¿Cambios MÁS detallados?" | 01-core | CHANGELOG.md |
| "¿Comandos rápidos?" | 01-core | QUICK_REFERENCE.md |
| "¿Soy una IA?" | 03-ia-collaboration | ONBOARDING_FOR_NEW_AIs.md |
| "¿Cómo testear?" | 04-testing | TESTING_ARCHITECTURE.md |
| "¿Configurar Mailtrap?" | 05-reference | MAILTRAP_GUIDE.md |

---

## 🤖 Para IAs: Instrucciones Claras

### Patrón Principal: NO crear documentos nuevos sin necesidad

**Regla de Oro**:
```
❌ ANTES (incorrecto):
   - Crear SESSION_SUMMARY_*.md
   - Crear DOCUMENTATION_SUMMARY.md
   - Crear CHANGELOG_DIFFERENCE_EXPLAINED.md
   
✅ AHORA (correcto):
   - ¿Es resumen? → Actualizar CHANGELOG.md
   - ¿Es guía? → Actualizar documento existente
   - ¿Es procedimiento? → Agregar a HOW_TO_SWITCH_TO_NEW_AI.md
   - ¿Es REALMENTE nuevo? → Preguntar primero
```

### Flujo de Decisión para IAs

```
¿Necesito crear/modificar documentación?
  │
  ├─ ¿Hay un cambio de código?
  │  └─ SÍ → Actualizar CHANGELOG.md SIEMPRE
  │
  ├─ ¿Es resumen de sesión?
  │  └─ SÍ → Actualizar CHANGELOG.md (NO crear nuevo doc)
  │
  ├─ ¿Es aclaración de norma existente?
  │  └─ SÍ → Actualizar AI_GUIDELINES.md
  │
  ├─ ¿Es procedimiento nuevo?
  │  └─ SÍ → Crear NEW_PROCEDURE.md EN carpeta adecuada + PREGUNTAR
  │
  ├─ ¿Es documento redundante?
  │  └─ SÍ → BORRAR o CONSOLIDAR
  │
  └─ ¿Es REALMENTE nuevo?
     ├─ SÍ → Crear + PREGUNTAR + Usar carpeta temática
     └─ NO → Actualizar existente
```

### Tipos de Cambios Permitidos

| Situación | Acción | Ubicación | Ejemplo |
|-----------|--------|-----------|---------|
| Bug arreglado | UPDATE | CHANGELOG.md | "Corregido MorphType en CuentaController" |
| Feature agregada | UPDATE | CHANGELOG.md | "Agregado sistema de invitaciones" |
| Sesión completada | UPDATE | CHANGELOG.md | "16-11-25: Completada refactorización de..." |
| Norma aclarada | UPDATE | AI_GUIDELINES.md | Agregar sección explicatoria |
| Procedimiento NUEVO | CREATE | En carpeta temática | "PROCEDURE_NAME.md" + PREGUNTAR |
| Documentación vieja | UPDATE | Documento existente | Actualizar sección obsoleta |
| Documento duplicado | DELETE | N/A | Eliminar redundante |

---

## 📋 Checklist para IAs ANTES de crear documento

- [ ] ¿Hay un documento existente sobre este tema?
- [ ] ¿Puedo actualizar uno existente en lugar de crear?
- [ ] ¿Esto es un resumen? → Va en CHANGELOG.md
- [ ] ¿Esto es una clarificación? → Va en AI_GUIDELINES.md
- [ ] ¿Es REALMENTE nuevo y no existe en otro lado?
- [ ] ¿Pregunté al usuario antes de crear?

**Resultado**:
- Sí a 4+ preguntas → Puedes considerar crear
- No a algunas → Actualiza existente o ESPERA confirmación

---

## 🏗️ Estructura Recomendada por Carpeta

```
01-core/
├─ Para: Referencia general, cambios, índice
├─ UPDATE FREQUENCY: Cada cambio importante
└─ Documentos: INDEX, CHANGELOG, QUICK_REFERENCE

02-development/
├─ Para: Cómo desarrollar, instalar, APIs
├─ UPDATE FREQUENCY: Cambios arquitectónicos importantes
└─ Documentos: Installation, APIs, Database, Auth, Contributing

03-ia-collaboration/
├─ Para: Normas y procedimientos de IA
├─ UPDATE FREQUENCY: Raramente (normas estables)
└─ Documentos: Guidelines, Onboarding, How-to-switch

04-testing/
├─ Para: Estrategia de testing y ejecución
├─ UPDATE FREQUENCY: Cambios en testing críticos
└─ Documentos: TESTING_ARCHITECTURE (principal), scripts, referencias

05-reference/
├─ Para: Configuraciones externas específicas
├─ UPDATE FREQUENCY: Cambios en herramientas
└─ Documentos: Integraciones (Mailtrap, etc.)
```

---

## 🚫 Lo que NO debes hacer

- ❌ Crear documento cada vez que terminas
- ❌ "SESSION_SUMMARY_*.md", "DOCUMENTATION_*.md"
- ❌ Tener duplicados en diferentes formatos
- ❌ Documentos "resumen de resumen"
- ❌ Crear archivos sin carpeta temática
- ❌ Archivos históricos sin eliminar si son redundantes

---

## ✅ Lo que SÍ debes hacer

- ✅ Actualizar CHANGELOG.md SIEMPRE con cada cambio
- ✅ Preguntar si no sabes si crear documento
- ✅ Organizar SIEMPRE en carpetas temáticas
- ✅ Eliminar o consolidar documentos obsoletos
- ✅ Mantener información en un único lugar
- ✅ Hacer documentación breve y enfocada

---

## 🔗 Acceso Rápido

Desde cualquier documento, vuelve a:

- **Índice principal**: `INDEX.md`
- **Cambios recientes**: `CHANGELOG.md`
- **Para Developers**: `../02-development/API.md`
- **Para IAs**: `../03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md`
- **Para Testing**: `../04-testing/TESTING_ARCHITECTURE.md`
- [**Arquitectura de Testing**](../04-testing/TESTING_ARCHITECTURE.md): Estrategia de pruebas, herramientas y cobertura.
- [**Implementación de Búsqueda**](./SEARCH_IMPLEMENTATION.md): Detalles sobre Meilisearch y Laravel Scout.
- [**Arquitectura Modular**](./MODULES_ARCHITECTURE.md): Finanzas, Tareas y Chat (Integración y Reglas).

---

## 📅 Última Actualización

- **Fecha**: 16 de noviembre de 2025
- **Reorganización**: Consolidada en 5 carpetas temáticas
- **Limpieza**: Removidos documentos redundantes
- **Versión**: 2.0.0 (reorganizado)

---

**🎉 Documentación clara, organizada y mantenible.**

Próximo paso: Selecciona tu rol arriba y comienza a leer.
