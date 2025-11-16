# 🤖 Normas de Comportamiento para Modelos de IA

**Documento de Guía para Agentes de IA trabajando en ControlApp**

> Este documento establece las normas y flujos de trabajo esperados para cualquier modelo de IA (Claude, ChatGPT, Copilot, etc.) colaborando en el desarrollo de ControlApp.

---

## 📋 Tabla de Contenidos

1. [Filosofía General](#filosofía-general)
2. [Fases de Desarrollo](#fases-de-desarrollo)
3. [Procedimientos y Flujos](#procedimientos-y-flujos)
4. [Normas Técnicas](#normas-técnicas)
5. [Documentación y Registro](#documentación-y-registro)
6. [Comunicación](#comunicación)
7. [Checklist de Tareas](#checklist-de-tareas)

---

## 🎯 Filosofía General

### Principios Fundamentales

1. **Transparencia Radical**: Toda decisión debe explicarse ANTES de implementarse
2. **Autorización Explícita**: Nunca ejecutar sin permiso del usuario
3. **Trazabilidad Completa**: Cada cambio debe estar registrado y documentado
4. **Portabilidad**: El proyecto debe poderse transferir a otro modelo o desarrollador
5. **Calidad sobre Velocidad**: Mejor código limpio y documentado que rápido

### Objetivos Principales

- ✅ Código limpio, mantenible y testeado
- ✅ Documentación completa de cada cambio
- ✅ Decisiones técnicas explicadas y justificadas
- ✅ Base de datos de producción protegida
- ✅ Suite de tests robusta y confiable
- ✅ Historial completo de cambios

---

## 🔄 Fases de Desarrollo

### FASE 1: Análisis y Planeación

**Cuándo**: Al comenzar una nueva tarea
**Duración**: 5-10 minutos

#### Procedimiento

```
1. Leer y comprender completamente la solicitud del usuario
2. Analizar el código actual relevante
3. Identificar qué necesita cambiar
4. Buscar impacto en otras partes del proyecto
5. Hacer preguntas de clarificación si es necesario
```

#### Entregable

**Presentar opciones al usuario:**

```markdown
## 📊 Análisis de [TAREA]

### Entiendo que quieres:
[Resumir lo que se solicita]

### He identificado [N] opciones:

#### Opción 1: [Nombre]
- Descripción: [Qué hace]
- Ventajas: [Pros]
- Desventajas: [Contras]
- Tiempo estimado: [X min]
- Complejidad: [Baja/Media/Alta]

#### Opción 2: [Nombre]
[Repetir estructura]

### Archivos que serán modificados:
- `/ruta/archivo1.php`
- `/ruta/archivo2.php`

### Mi recomendación:
[Explicar por qué recomiendo una opción]

### ¿Cuál opción prefieres?
```

---

### FASE 2: Implementación

**Cuándo**: Después de que el usuario elige opción
**Duración**: Variable según complejidad

#### Procedimiento

```
1. Confirmar autorización del usuario
2. Ejecutar cambios en orden lógico
3. Ejecutar comandos con permiso ANTES de cada uno
4. Validar que cada paso funcionó
5. Mostrar resultado final
```

#### Durante la Implementación

**Antes de ejecutar CUALQUIER comando:**

```markdown
## ⚙️ Preparado para ejecutar:

```bash
comando_a_ejecutar
```

### Qué hará:
[Explicar qué va a suceder]

### Riesgo:
[Bajo/Medio] - [Explicar riesgos]

### ¿Continuar?
```

**Al mostrar cambios de código:**

```markdown
## 📝 Cambio en `/ruta/archivo.php`:

### Descripción:
[Qué cambio y por qué]

### Líneas afectadas:
- Línea 45-50: [Qué cambió]
- Línea 120-125: [Qué cambió]

### Razón del cambio:
[Por qué era necesario]

[Aquí se aplica el cambio con la herramienta replace_string_in_file]
```

#### Validación

Después de cada cambio:

```markdown
## ✅ Validación:

### Cambios realizados:
- [x] Archivo 1 actualizado
- [x] Archivo 2 actualizado

### Próximo paso:
[Qué sigue]
```

---

### FASE 3: Testing

**Cuándo**: Después de implementar cambios
**Duración**: 5-15 minutos

#### Procedimiento

```
1. Ejecutar suite de tests relevante
2. Mostrar resultados al usuario
3. Si fallan: Analizar, corregir, re-ejecutar
4. Si pasan: Pasar a Documentación
5. Mantener registro de test results
```

#### Durante Testing

**Ejecutar tests:**

```markdown
## 🧪 Ejecutando Tests

### Comando:
```bash
./vendor/bin/sail artisan test --env=testing --no-coverage
```

### Descripción:
[Qué tests se van a ejecutar]

### Tiempo estimado:
[X segundos]

### ¿Continuar?
```

**Al mostrar resultados:**

```markdown
## 📊 Resultados de Tests:

### Resumen:
- ✅ 129 passed
- ⚠️ 2 failed
- ⏭️ 0 skipped

### Tests Fallidos:
- ❌ CuentasApiTest > admin puede actualizar cuenta
  - Esperado: 200
  - Recibido: 404
  - Causa probable: [Análisis]

### Próximos pasos:
1. [Paso 1]
2. [Paso 2]
```

---

### FASE 4: Documentación

**Cuándo**: Después de que tests pasen
**Duración**: 10-20 minutos

#### Procedimiento

```
1. Actualizar CHANGELOG_DETAILED.md
2. Actualizar documentación afectada
3. Actualizar README si es necesario
4. Crear o actualizar comentarios en código
5. Validar que todo está consistente
```

#### Documentación Mínima

**Cada cambio debe incluir:**

```markdown
## 📝 Documentación del Cambio

### Archivo Modificado: `/ruta/archivo.php`

#### Qué cambió:
[Descripción clara del cambio]

#### Por qué cambió:
[Razón técnica y de negocio]

#### Impacto:
- Tests afectados: [Cuáles]
- APIs afectadas: [Cuáles]
- Base de datos: [Cambios]
- Usuarios: [Cómo afecta]

#### Cómo usar:
[Si es público/externo, cómo se usa]

#### Notas:
[Cualquier consideración especial]
```

---

## 📋 Procedimientos y Flujos

### Flujo: Agregar Nueva Feature

```
┌─────────────────────────────────────────────────────┐
│ 1. ANÁLISIS                                         │
│   - Entender requisito                              │
│   - Analizar código existente                       │
│   - Presentar opciones                              │
└────────────┬────────────────────────────────────────┘
             │ ✅ Usuario elige opción
             ▼
┌─────────────────────────────────────────────────────┐
│ 2. IMPLEMENTACIÓN                                   │
│   - Crear/modificar archivos                        │
│   - Ejecutar cada comando con permiso               │
│   - Validar cambios                                 │
└────────────┬────────────────────────────────────────┘
             │ ✅ Cambios completados
             ▼
┌─────────────────────────────────────────────────────┐
│ 3. TESTING                                          │
│   - Ejecutar tests con ./vendor/bin/sail artisan... │
│   - Corregir fallos si existen                      │
│   - Validar 100% de tests pasan                     │
└────────────┬────────────────────────────────────────┘
             │ ✅ Tests pasan
             ▼
┌─────────────────────────────────────────────────────┐
│ 4. DOCUMENTACIÓN                                    │
│   - Actualizar CHANGELOG_DETAILED.md                │
│   - Actualizar docs relevantes                      │
│   - Agregar comentarios en código                   │
│   - Crear o actualizar ADRs                         │
└────────────┬────────────────────────────────────────┘
             │
             ▼
         ✅ COMPLETADO
```

### Flujo: Arreglar Bug

```
┌─────────────────────────────────────────────────────┐
│ 1. REPRODUCCIÓN                                     │
│   - Entender el bug                                 │
│   - Identificar causa probable                      │
│   - Localizar archivo relevante                     │
└────────────┬────────────────────────────────────────┘
             │ ✅ Bug identificado
             ▼
┌─────────────────────────────────────────────────────┐
│ 2. IMPLEMENTACIÓN DEL FIX                           │
│   - Realizar cambio mínimo                          │
│   - Ejecutar con permiso                            │
│   - No hacer cambios innecesarios                   │
└────────────┬────────────────────────────────────────┘
             │ ✅ Fix implementado
             ▼
┌─────────────────────────────────────────────────────┐
│ 3. TESTING                                          │
│   - Ejecutar tests específicos                      │
│   - Ejecutar suite completa                         │
│   - Validar que no hay regresiones                  │
└────────────┬────────────────────────────────────────┘
             │ ✅ Tests pasan
             ▼
┌─────────────────────────────────────────────────────┐
│ 4. DOCUMENTACIÓN                                    │
│   - Registrar bug y fix en CHANGELOG                │
│   - Documentar causa raíz                           │
│   - Agregar nota en código si es complejo           │
└────────────┬────────────────────────────────────────┘
             │
             ▼
         ✅ COMPLETADO
```

### Flujo: Refactorizar Código

```
┌─────────────────────────────────────────────────────┐
│ 1. JUSTIFICACIÓN                                    │
│   - Explicar por qué refactorizar                   │
│   - Mostrar impacto en tests                        │
│   - Mostrar mejoras de performance                  │
└────────────┬────────────────────────────────────────┘
             │ ✅ Usuario aprueba
             ▼
┌─────────────────────────────────────────────────────┐
│ 2. CAMBIO INCREMENTAL                               │
│   - Hacer cambios pequeños                          │
│   - Ejecutar tests entre cambios                    │
│   - No combinar múltiples refactors                 │
└────────────┬────────────────────────────────────────┘
             │ ✅ Cambios completos
             ▼
┌─────────────────────────────────────────────────────┐
│ 3. TESTING EXHAUSTIVO                               │
│   - Tests específicos del módulo                    │
│   - Suite completa                                  │
│   - Validar comportamiento idéntico                 │
└────────────┬────────────────────────────────────────┘
             │ ✅ Tests pasan
             ▼
┌─────────────────────────────────────────────────────┐
│ 4. DOCUMENTACIÓN                                    │
│   - Por qué se refactorizó                          │
│   - Cambios arquitectónicos                         │
│   - Mejoras logradas                                │
└────────────┬────────────────────────────────────────┘
             │
             ▼
         ✅ COMPLETADO
```

---

## 🛠️ Normas Técnicas

### Estándares de Código

1. **PHP/Laravel**
   - Seguir PSR-12
   - Máximo 120 caracteres por línea
   - Usar type hints siempre que sea posible
   - Documentar con PHPDoc completo

2. **Tests**
   - Cada test debe tener un propósito claro
   - Usar descriptivos nombrados: `test_admin_puede_crear_usuario`
   - Usar RefreshDatabase para aislamiento
   - Máximo 20 líneas por test

3. **Commits**
   - Seguir Conventional Commits
   - Formato: `type(scope): description`
   - Ejemplos válidos:
     - `feat(auth): add email verification`
     - `fix(cuentas): fix morph type comparison`
     - `docs(testing): add testing guidelines`
     - `refactor(api): extract validation logic`

### Estrategia de Bases de Datos

#### En Desarrollo

```env
DB_DATABASE=laravel
DB_HOST=mysql
```

#### En Testing

```env
DB_DATABASE=laravel
DB_DRIVER_TESTING=sqlite
```

**Norma Crítica**: Los tests usan `RefreshDatabase` trait que limpia completamente la BD entre tests. **NUNCA** tocan datos de producción.

### Manejo de Errores

**Nunca silenciar errores:**

```php
// ❌ MAL
try {
    $usuario->save();
} catch (Exception $e) {
    // Silencio
}

// ✅ BIEN
try {
    $usuario->save();
} catch (Exception $e) {
    \Log::error('Error al guardar usuario', ['error' => $e->getMessage()]);
    throw $e;
}
```

### Seguridad

1. **Autenticación**
   - Usar Laravel Sanctum
   - Validar tokens en middleware

2. **Autorización**
   - Usar gates/policies
   - Verificar permisos ANTES de hacer cambios

3. **Validación**
   - Validar SIEMPRE input del usuario
   - Usar Request validation

4. **SQL Injection**
   - NUNCA concatenar queries
   - Usar query builder siempre

---

## 📚 Documentación y Registro

### Registro de Cambios (CHANGELOG_DETAILED.md)

**Estructura obligatoria:**

```markdown
## [Fecha] - [Tipo de Cambio]

### Contexto
[Por qué se hizo el cambio]

### Cambios
- [Cambio 1]
- [Cambio 2]

### Archivos Modificados
- `/app/Models/User.php`: [Qué cambió]
- `/tests/Feature/UserTest.php`: [Qué cambió]

### Tests
- ✅ 131 passed, 0 failed

### Notas
[Consideraciones especiales]
```

### Documentación de Decisiones (ADR)

**Archivo**: `docs/ADR/ADR-001-testing-strategy.md`

**Estructura:**

```markdown
# ADR-001: Testing Strategy for Database Isolation

## Status
Accepted

## Context
[Describe el problema a resolver]

## Decision
[Qué se decidió]

## Rationale
[Por qué esta decisión]

## Alternatives Considered
[Otras opciones y por qué no]

## Consequences
[Implicaciones]

## Implementation
[Cómo se implementa]

## Date
[Fecha de decisión]

## Author
[Quién decidió]
```

### ⚠️ IMPORTANTE: Patrón de Documentación

#### Regla Principal: NO crear documentos nuevos sin necesidad

```
❌ ANTI-PATRONES (NO hacer):
   - Crear SESSION_SUMMARY_*.md
   - Crear DOCUMENTATION_SUMMARY.md
   - Crear CHANGELOG_DIFFERENCE_EXPLAINED.md
   - "Resumen" de algo que ya existe

✅ PATRONES CORRECTOS (SÍ hacer):
   - ¿Cambios de código? → Actualizar CHANGELOG_DETAILED.md
   - ¿Sesión completada? → Actualizar CHANGELOG_DETAILED.md
   - ¿Norma aclarada? → Actualizar AI_GUIDELINES.md
   - ¿Procedimiento nuevo? → Preguntar primero + Crear en carpeta temática
   - ¿Documentación vieja? → Actualizar existente
```

#### Flujo de Decisión

```
¿Necesito hacer documentación?
  │
  ├─ ¿Cambios de código? 
  │  └─ SÍ → Actualizar CHANGELOG_DETAILED.md SIEMPRE
  │
  ├─ ¿Es resumen/sesión?
  │  └─ SÍ → Actualizar CHANGELOG_DETAILED.md (NO crear nuevo)
  │
  ├─ ¿Es aclaración de norma?
  │  └─ SÍ → Actualizar AI_GUIDELINES.md
  │
  ├─ ¿Es procedimiento NUEVO?
  │  └─ SÍ → PREGUNTAR al usuario + Crear en carpeta temática
  │
  └─ ¿Documento redundante?
     └─ SÍ → Consolidar o ELIMINAR
```

#### Checklist ANTES de Crear Documento

- [ ] ¿Existe documentación sobre este tema?
- [ ] ¿Puedo actualizar uno existente?
- [ ] ¿Esto es un resumen? → CHANGELOG_DETAILED.md
- [ ] ¿Esto es clarificación? → AI_GUIDELINES.md
- [ ] ¿Es REALMENTE nuevo?
- [ ] ¿Pregunté al usuario antes?

**Si respondiste NO a alguna**: Actualiza existente, no crees nuevo.

---

### Archivos de Documentación

| Archivo | Propósito | Actualizar | Crear Nuevo |
|---------|-----------|-----------|------------|
| `docs/01-core/INDEX.md` | Índice principal | Cada release mayor | NO |
| `docs/01-core/CHANGELOG.md` | Resumen público | Cada release | NO |
| `docs/01-core/CHANGELOG_DETAILED.md` | Registro técnico | ✅ CADA CAMBIO | NO |
| `docs/02-development/API.md` | Endpoints | Cambios API | Raro |
| `docs/02-development/DATABASE.md` | Esquema BD | Migraciones nuevas | Raro |
| `docs/02-development/AUTHENTICATION.md` | Sistema auth | Cambios auth | NO |
| `docs/02-development/INSTALLATION.md` | Instalación | Cambios setup | NO |
| `docs/02-development/CONTRIBUTING.md` | Contribuciones | Cambios proceso | NO |
| `docs/03-ia-collaboration/AI_GUIDELINES.md` | Normas IA | ✅ Aclaraciones | NO |
| `docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md` | Onboarding IA | Raro | NO |
| `docs/03-ia-collaboration/HOW_TO_SWITCH_TO_NEW_AI.md` | Cambiar IA | Raro | NO |
| `docs/04-testing/TESTING_ARCHITECTURE.md` | Estrategia testing | Cambios testing | NO |
| `docs/04-testing/TESTING_SCRIPTS.md` | Scripts testing | Nuevos scripts | NO |

---

## 💬 Comunicación

### Formato de Mensajes

#### Al Presentar Opciones

```markdown
## 📊 [Nombre de la Tarea]

He identificado [N] formas de hacer esto:

### ✅ Opción [N]: [Nombre corto]
[Descripción]
- Ventajas: [+]
- Desventajas: [-]
- Complejidad: [Estimación]

**Mi recomendación**: Opción [N] porque [razón]

¿Cuál prefieres?
```

#### Al Pedir Autorización

```markdown
## ⚙️ Preparado para:

**Comando**: `comando_a_ejecutar`

**Descripción**: [Qué hace]

**Riesgo**: [Bajo/Medio/Alto] - [Por qué]

**¿Continuar?**
```

#### Al Reportar Éxito

```markdown
## ✅ Completado

**Lo que hice:**
- [Cambio 1]
- [Cambio 2]

**Resultado:**
- [Métrica 1]
- [Métrica 2]

**Próximo paso:** [Qué sigue]
```

#### Al Reportar Error

```markdown
## ❌ Encontré un Problema

**Error**: [Mensaje de error]

**Causa probable**: [Análisis]

**Opciones para resolver:**
1. [Opción 1]
2. [Opción 2]

**¿Cuál prefieres?**
```

### Vocabulario Estándar

- **IA**: Modelo de IA (Claude, ChatGPT, etc.)
- **Usuario**: Persona usando la IA
- **Suite de tests**: Todos los tests juntos
- **Test fallido**: Un test que no pasa
- **Producción**: Base de datos real en servidor
- **Desarrollo**: Base de datos local en máquina
- **Staging**: Base de datos de prueba en servidor
- **Merged**: Cambios que ya se guardaron permanentemente

---

## ✅ Checklist de Tareas

### Checklist: Agregar Feature

- [ ] **Análisis**
  - [ ] Leí completamente el requisito
  - [ ] Analicé código relacionado
  - [ ] Presenté opciones al usuario
  - [ ] Usuario eligió opción

- [ ] **Implementación**
  - [ ] Realicé cambios en orden lógico
  - [ ] Ejecuté cada comando con permiso
  - [ ] Validé cada paso
  - [ ] Mostré resultados

- [ ] **Testing**
  - [ ] Ejecuté tests relevantes
  - [ ] Todos los tests pasan
  - [ ] No hay regresiones
  - [ ] Coverage es adecuado

- [ ] **Documentación**
  - [ ] Actualicé CHANGELOG_DETAILED.md
  - [ ] Actualicé documentación relevante
  - [ ] Agregué comentarios en código
  - [ ] Actualicé API.md si es necesario

- [ ] **Validación Final**
  - [ ] Todo está documentado
  - [ ] Código es limpio y legible
  - [ ] Tests pasan 100%
  - [ ] Usuario aprueba resultado

### Checklist: Arreglar Bug

- [ ] **Análisis**
  - [ ] Entendí el bug completamente
  - [ ] Identifiqué causa raíz
  - [ ] Localicé archivo afectado

- [ ] **Fix**
  - [ ] Cambio es mínimo y fokusado
  - [ ] No hay cambios innecesarios

- [ ] **Testing**
  - [ ] Ejecuté tests específicos
  - [ ] Ejecuté suite completa
  - [ ] Sin regresiones

- [ ] **Documentación**
  - [ ] Registré bug y fix
  - [ ] Expliqué causa raíz
  - [ ] Agregué notas técnicas

### Checklist: Sesión de Trabajo

Al comenzar:
- [ ] Leí comentarios anteriores del usuario
- [ ] Revisé CHANGELOG_DETAILED.md para contexto
- [ ] Pregunté por prioridades si no están claras

Durante:
- [ ] Mantuve usuario informado del progreso
- [ ] Pedí autorización antes de cambios
- [ ] Mostré resultados incrementales

Al finalizar:
- [ ] Documenté todos los cambios
- [ ] Mostré resumen de lo logrado
- [ ] Pregunté si hay algo más que hacer
- [ ] Confirmé que todo está guardado

---

## 🚀 Ejemplo de Sesión Completa

### Usuario solicita:
> "Agrega validación en el registro para que la contraseña contenga al menos un número"

### IA Responde (FASE 1):

```markdown
## 📊 Análisis: Validación de Contraseña

Entiendo que quieres agregar validación para que las contraseñas 
contengan al menos un número.

He identificado 2 opciones:

### ✅ Opción 1: Usar Regex en Request Validation (RECOMENDADO)
- Ventajas: Simple, centralizado, reutilizable
- Desventajas: Menos flexible
- Archivos: `/app/Http/Requests/RegisterRequest.php`
- Complejidad: Baja

### Opción 2: Custom Rule Class
- Ventajas: Más flexible, reutilizable en múltiples validaciones
- Desventajas: Más código
- Archivos: Crear `/app/Rules/ContainsNumber.php`
- Complejidad: Media

Recomiendo Opción 1 por simplicidad.

¿Cuál prefieres?
```

### Usuario elige:
> "Opción 1, adelante"

### IA Implementa (FASE 2):

```markdown
## 🔧 Implementando Opción 1

Voy a modificar el request validation en RegisterRequest.php

### Paso 1: Actualizar validación

```php
// Agregar regex que valida número
'password' => ['required', 'string', 'min:8', 'regex:/[0-9]/']
```

### Esto va a:
✅ Requerir que la contraseña tenga al menos un número
✅ Se aplica a todo registro
✅ Valida en backend (seguro)

¿Continuar?
```

### Usuario confirma:
> "Sí"

### IA ejecuta cambio:

```markdown
## ✅ Cambio Realizado

Actualicé `/app/Http/Requests/RegisterRequest.php`:
- Línea 45: Agregué 'regex:/[0-9]/' a la regla de password

El cambio asegura que toda contraseña tenga al menos un número.

Próximo: Ejecutar tests para validar
```

### IA Testing (FASE 3):

```markdown
## 🧪 Ejecutando Tests

Voy a correr los tests de autenticación para validar que:
✅ Contraseña sin número es rechazada
✅ Contraseña con número es aceptada
✅ Otros tests siguen pasando

Comando: `./vendor/bin/sail artisan test tests/Feature/AuthenticationApiTest.php`

¿Continuar?
```

### Usuario: > "Sí"

### IA muestra resultados:

```markdown
## 📊 Resultados

✅ 12 tests pasaron
✅ Validación funciona correctamente:
   - ❌ Sin número: "Rejected as expected"
   - ✅ Con número: "Accepted correctly"

Próximo: Documentar cambio
```

### IA Documenta (FASE 4):

```markdown
## 📝 Documentación

Actualicé `docs/CHANGELOG_DETAILED.md`:

```markdown
## [16-11-2025] - Feature: Password Number Validation

### Contexto
Usuario requería que contraseñas tengan al menos un número para mayor seguridad.

### Cambios
- Agregué regex validation en RegisterRequest: 'regex:/[0-9]/'
- Contraseñas sin número son rechazadas con mensaje claro
- Validación es case-insensitive

### Archivos Modificados
- `/app/Http/Requests/RegisterRequest.php`: Agregué 'regex:/[0-9]/' en password rule

### Tests
✅ 12 passed, 0 failed

### Notas
- Contraseña debe tener: mín 8 caracteres + al menos 1 número
- Mensajes de error se muestran en registro
```

### ¿Hay algo más que hacer?
```

### Usuario responde:
> "No, perfecto. Gracias!"

---

## 📞 Contacto y Preguntas

**Si algo no está claro en estas normas:**

1. Pregunta al usuario
2. Documenta la aclaración
3. Actualiza este archivo
4. Comunica el cambio

**El objetivo es que estas normas evolucionen con el proyecto.**

---

## 🎓 Aprendizaje Continuo

### Para IAs nuevas en el proyecto

1. Leer este archivo completamente
2. Leer CHANGELOG_DETAILED.md para contexto
3. Leer los últimos cambios en el código
4. Preguntar dudas al usuario
5. Comenzar con tareas simples

### Para IAs con experiencia en el proyecto

1. Mantener estas normas
2. Documentar cambios a las normas
3. Actualizar ejemplos si es necesario
4. Enseñar nuevas IAs

---

## 📋 Historial de Cambios

| Fecha | Cambio | Versión |
|-------|--------|---------|
| 2025-11-16 | Documento inicial | 1.0.0 |

---

## 🏆 Objetivo Final

Estas normas existen para que:

✅ El proyecto sea **siempre mantenible**
✅ Cualquier IA pueda continuar el trabajo
✅ Los cambios sean **siempre trazables**
✅ La calidad **nunca se comprometa**
✅ La documentación **siempre esté actualizada**

**Siguiendo estas normas, ControlApp será un proyecto que puede crecer indefinidamente sin perder calidad, claridad o trazabilidad.**

---

**Versión**: 1.0.0
**Última actualización**: 16 de noviembre de 2025
**Mantenedor**: Equipo de Desarrollo ControlApp

