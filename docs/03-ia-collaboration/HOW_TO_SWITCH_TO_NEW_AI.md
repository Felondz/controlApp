# 🎯 GUÍA: Cómo Cambiar a Nueva IA - Paso a Paso

**Tu roadmap exacto para onboardear a una nueva IA en la próxima sesión**

---

## 📋 Situación

Terminaste tu sesión con una IA (digamos Copilot). Ahora quieres trabajar con otra IA (digamos Claude) o la misma pero en una conversación nueva.

**Problema**: La nueva IA no conoce el proyecto

**Solución**: Este documento te guía exactamente qué hacer

---

## ✅ Checklist: Antes de Cambiar de IA

### Paso 1: Verifica que todo esté en orden (1 min)

```bash
# Ejecuta los tests finales
./vendor/bin/sail artisan test --env=testing --no-coverage 2>&1 | tail -20

# Deberías ver:
# Tests: 131 passed (342 assertions)
```

Si falta algo o no pasan los tests:
- ❌ NO cambies de IA
- ✅ SÍ arreglalo primero
- ✅ SÍ documenta en CHANGELOG_DETAILED.md

---

## 🚀 Procedimiento: Onboardear Nueva IA

### Opción 1: RÁPIDA (5 minutos)
**Para cambios pequeños o urgentes**

#### Paso 1: Abre ONBOARDING_FOR_NEW_AIs.md
```
Archivo: /docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
```

#### Paso 2: Copia completamente el contenido
- Selecciona TODO el texto
- Copia al portapapeles

#### Paso 3: Abre chat con nueva IA
- ChatGPT: https://chat.openai.com
- Claude: https://claude.ai
- Copilot: VS Code o copilot.microsoft.com
- Otra: [Su URL]

#### Paso 4: Crea nueva conversación/chat

#### Paso 5: Pega el contenido de ONBOARDING_FOR_NEW_AIs.md

#### Paso 6: Envía este mensaje:

```
He aquí un proyecto Laravel que vengo desarrollando.
El documento adjunto contiene toda la guía de cómo funciona el proyecto y cómo debo trabajar.

Por favor, léelo COMPLETAMENTE y avísame cuando hayas entendido.
Esto es crítico para que podamos trabajar correctamente.

[Aquí pega el contenido completo de ONBOARDING_FOR_NEW_AIs.md]
```

#### Paso 7: Espera confirmación
La IA dirá algo como:
```
✅ He leído completamente el documento (X palabras).
Entiendo:
- Estructura del proyecto
- Stack tecnológico (Laravel + MySQL + RefreshDatabase)
- Normas de comportamiento
- Cómo ejecutar tests
- Comandos esenciales
- Ejemplos de trabajos anteriores

Estoy listo. ¿Qué necesitas?
```

#### Paso 8: Describe tu tarea
```
Necesito que agregues [tu tarea].
Aquí está el contexto:
[Tu contexto adicional si es necesario]
```

---

### Opción 2: COMPLETA (15 minutos) ⭐ RECOMENDADA
**Para cambios complejos o cuando quieres máxima confianza**

#### Paso 1-7: Sigue Opción 1

#### Paso 8: Copia ÚLTIMAS ENTRADAS de CHANGELOG_DETAILED.md

```
Archivo: /docs/01-core/CHANGELOG_DETAILED.md
Copia: Las últimas 10-15 entradas (últimas 2-4 semanas)
```

#### Paso 9: Envía a la IA:

```
Aquí está el historial reciente de cambios para más contexto:

[Pega las últimas entradas de CHANGELOG_DETAILED.md]
```

#### Paso 10: Copia secciones relevantes de AI_GUIDELINES.md

Si tu tarea es compleja:

```
Archivo: /docs/03-ia-collaboration/AI_GUIDELINES.md
Copia: 
  - Sección "4 Fases de Desarrollo" 
  - Sección "3 Flujos de Trabajo" (el que aplique)
  - Sección "Checklist" (el que aplique)
```

#### Paso 11: Envía a la IA:

```
Aquí están las normas específicas para este tipo de tarea:

[Pega las secciones]
```

#### Paso 12: Describe tu tarea
```
Ahora necesito: [tu tarea]
```

---

### Opción 3: MÁXIMA CONFIANZA (20-30 minutos)
**Para cambios muy críticos o refactors grandes**

#### Paso 1-11: Sigue Opción 2

#### Paso 12: Copia ESQUEMA DE BD (opcional)

```
Archivo: /docs/02-development/DATABASE.md
Copia: Tabla de modelos y relaciones
```

#### Paso 13: Copia ENDPOINTS RELEVANTES (si es necesario)

```
Archivo: /docs/02-development/API.md
Copia: Los endpoints que voy a modificar
```

#### Paso 14: Copia TESTS RELACIONADOS

```
Archivo: /tests/Feature/[Tu módulo]/[Tu test].php
Copia: El código del test relacionado
```

#### Paso 15: Envía a IA:

```
Aquí está el esquema de BD, endpoints y tests relacionados:

[Pega esquema]
[Pega endpoints]
[Pega tests]
```

#### Paso 16: Describe tu tarea
```
Necesito [tu tarea]. 
La tarea es crítica porque [razón].
```

---

## 🎯 Guía Rápida por Tipo de Tarea

### Si quieres: Agregar un nuevo modelo

**Usa**: Opción 2 + docs/02-development/DATABASE.md

```
1. Opción 2 (15 min)
2. Pega el esquema de DATABASE.md
3. Describe: "Necesito agregar modelo X con campos Y"
4. IA entiende contexto completo
```

### Si quieres: Arreglar un bug

**Usa**: Opción 2 + últimas entradas CHANGELOG_DETAILED.md

```
1. Opción 2 (15 min)
2. Pega últimos 5-10 cambios de CHANGELOG
3. Describe: "Tests están fallando en X porque Y"
4. IA entiende qué funcionaba antes
```

### Si quieres: Agregar un endpoint

**Usa**: Opción 2 + docs/02-development/API.md

```
1. Opción 2 (15 min)
2. Pega endpoints similares de API.md
3. Describe: "Necesito endpoint para X"
4. IA ve patrones existentes
```

### Si quieres: Refactor completo (crítico)

**Usa**: Opción 3

```
1. Opción 3 (20-30 min)
2. Pega todo: Esquema, endpoints, tests
3. Describe: "Refactorizar X. Es crítico porque Y"
4. IA tiene contexto 100% completo
```

---

## ⚠️ Errores Comunes a Evitar

### ❌ Error 1: NO pegar ONBOARDING_FOR_NEW_AIs.md

```
❌ MAL: "Hola, necesito que hagas X"
✅ BIEN: "He aquí el contexto del proyecto [pega ONBOARDING]"
```

**Resultado**:
- ❌ IA sin contexto → Trabajos mediocres
- ✅ IA con contexto → Trabajos excelentes

---

### ❌ Error 2: Pedir cambios SIN validar tests

```
❌ MAL: "Haz este cambio y listo"
✅ BIEN: "Haz este cambio y luego ejecutamos: 
         ./vendor/bin/sail artisan test"
```

**Resultado**:
- ❌ Cambios sin validar → Bugs
- ✅ Cambios validados → Confianza

---

### ❌ Error 3: No documentar después

```
❌ MAL: IA termina trabajo y no documentas
✅ BIEN: IA termina + Tú documentas en CHANGELOG_DETAILED.md
```

**Resultado**:
- ❌ Perder historial → Confusión
- ✅ Documentado → Próxima IA entiende qué pasó

---

### ❌ Error 4: Cambiar de IA sin actualizar CHANGELOG

```
❌ MAL: Cambias a nueva IA sin que sepa qué hizo la anterior
✅ BIEN: Actualizo CHANGELOG_DETAILED.md antes de cambiar
```

**Resultado**:
- ❌ Nueva IA repite trabajo
- ✅ Nueva IA continúa desde donde quedó

---

## 📝 Plantilla: Mensaje Inicial a Nueva IA

Copia y adapta este mensaje:

```
=== CONTEXTO DEL PROYECTO ===

Vengo desarrollando un proyecto Laravel llamado ControlApp con una IA anterior.
El proyecto está bien estructurado y documentado.

Por favor, lee completamente el siguiente documento (es crítico):

[PEGA COMPLETAMENTE: /docs/ONBOARDING_FOR_NEW_AIs.md]

Una vez que hayas leído, responde:
✅ "He leído X palabras del onboarding y entiendo:"
✅ Lista lo que entendiste
✅ "Estoy listo para trabajar"

Después te pagaré mi tarea.
```

---

## 🔄 Ciclo de Trabajo Completo

### Con IA #1 (Tu sesión anterior)

```
Día 1: Trabajas con Copilot
├─ Haces cambios
├─ Validas con tests
├─ Documentas en CHANGELOG_DETAILED.md
└─ Terminas
```

### Cambio de IA (Este documento)

```
Día 2: Cambias a Claude
├─ Lees este documento (5 min)
├─ Haces onboarding a Claude (5-15 min según opción)
└─ Continúas donde quedó Copilot
```

### Con IA #2 (Nueva sesión)

```
Día 2+: Trabajas con Claude
├─ Claude tiene contexto completo
├─ Haces más cambios
├─ Validas con tests
├─ Documentas en CHANGELOG_DETAILED.md
└─ Terminas
```

---

## 📊 Resumen: Tiempo vs Calidad

| Opción | Tiempo | Confianza | Uso |
|--------|--------|-----------|-----|
| Opción 1 | 5 min | 70% | Cambios pequeños |
| Opción 2 | 15 min | 95% ⭐ | Cambios normales |
| Opción 3 | 20-30 min | 99% | Cambios críticos |
| SIN onboarding | 0 min | 30% ❌ | NO USES |

**Recomendación**: Usa **Opción 2** siempre (solo 15 minutos)

---

## 🎯 Resumen Final

### Cuando Cambies de IA, SIEMPRE:

```
1. ✅ Verifica tests pasen (131/131)
2. ✅ Copia ONBOARDING_FOR_NEW_AIs.md
3. ✅ Pega en chat de nueva IA
4. ✅ Espera confirmación
5. ✅ Describe tu tarea
6. ✅ Valida cambios con tests
7. ✅ Documenta en CHANGELOG_DETAILED.md

✅ Listo. Próxima IA sabrá qué pasó.
```

---

## 💡 Pro Tips

### Tip 1: Crea Bookmark
Guarda esta ruta en favoritos:
```
/home/guarox/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
```

Así accedes rápido la próxima vez.

### Tip 2: Copia a Portapapeles Directamente
```bash
cat /home/guarox/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md | xclip -selection clipboard
```

Luego solo pega en el chat.

### Tip 3: Crea Alias en .bashrc
```bash
alias ia-onboard='cat ~/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md | xclip -selection clipboard && echo "✅ Copiado al portapapeles"'
```

Luego usa: `ia-onboard`

---

## ❓ Preguntas Frecuentes

### P: ¿Qué pasa si cambio de IA a mitad de sesión?

**R**: Es normal. Sigue el procedimiento:

```
1. Termina con IA #1 (valida tests, documenta)
2. Haz onboarding a IA #2 (15 min)
3. Continúa

La nueva IA entenderá dónde quedó la anterior.
```

---

### P: ¿Cuál es la opción mínima recomendada?

**R**: **Opción 2** (15 minutos)

```
✅ Es el balance perfecto entre tiempo y confianza
✅ Evita el 95% de errores
✅ Solo 15 minutos
✅ Vale MUCHO la pena
```

---

### P: ¿Qué pasa si no hago onboarding?

**R**: Problemas:

```
❌ IA no sabe normas → Trabajo incorrecto
❌ IA no sabe estructura → Cambios en lugar equivocado
❌ IA no sabe BD → Queries erróneas
❌ IA no sabe testing → Tests inútiles
❌ IA no sabe historial → Repite trabajo

Resultado: Pérdida de 5+ horas.
```

**Moraleja**: 15 minutos de onboarding ahorra HORAS.

---

### P: ¿Debo leer TODOS los documentos?

**R**: NO, solo:

- ✅ ONBOARDING_FOR_NEW_AIs.md (obligatorio)
- ✅ Últimas entradas CHANGELOG_DETAILED.md (recomendado)
- ✅ AI_GUIDELINES.md si es tarea compleja (opcional)
- ✅ Otros solo si es necesario

---

### P: ¿Cómo valido que la IA entienda?

**R**: Hazle una pregunta:

```
"¿Cuántos tests tiene el proyecto?"
Respuesta correcta: "131 tests"

"¿Por qué RefreshDatabase?"
Respuesta correcta: "Para aislar tests y no tocar producción"

"¿Cuál es el MorphMap alias para Proyecto?"
Respuesta correcta: "'proyecto'"
```

Si falla: IA no leyó bien. Pide que lea de nuevo.

---

## 🎉 Conclusión

**Cambiar de IA es FÁCIL si haces onboarding.**

Tienes:

✅ Un documento listo (ONBOARDING_FOR_NEW_AIs.md)
✅ Un procedimiento claro (este documento)
✅ Opciones según urgencia (1-3)
✅ Ejemplos exactos (aquí arriba)
✅ Checklist (arriba)

**Próxima vez que cambies de IA:**

1. Lee este documento (5 min)
2. Sigue el procedimiento (5-30 min según opción)
3. Trabajas con confianza ✅

---

**Última actualización**: 16 de noviembre de 2025
**Versión**: 1.0.0
**Tipo**: Guía de Procedimiento
**Audiencia**: Tú (cuando cambies de IA)
