# 🧪 Scripts de Testing - Guía Completa

## 📍 Ubicación

Todos los scripts de testing están centralizados en:
```
scripts/
```

## 📝 Descripción de Scripts

### 1. `run-tests.sh` - Suite Principal de Tests
**Propósito:** Ejecutar toda la suite de tests del proyecto

**Uso:**
```bash
bash scripts/run-tests.sh
```

**Qué hace:**
- Ejecuta todos los tests de la aplicación
- Genera reporte completo de cobertura
- Muestra resumen por módulo
- Tiempo total de ejecución
- Status final (PASS/FAIL)

**Cuándo usarlo:**
- ✅ Antes de hacer commit
- ✅ Después de cambios significativos
- ✅ En CI/CD pipeline
- ✅ Validación pre-producción

**Resultado esperado:**
```
✅ 114/114 tests pasando
✅ 297 assertions correctas
```

---

### 2. `test-invitaciones.sh` - Tests de Invitaciones
**Propósito:** Validar el sistema de invitaciones específicamente

**Uso:**
```bash
bash scripts/test-invitaciones.sh
```

**Qué hace:**
- Tests de creación de invitaciones
- Validación de emails de invitación
- Aceptación de invitaciones
- Rechazo de invitaciones
- Listado y filtrado

**Cuándo usarlo:**
- ✅ Después de cambios en invitaciones
- ✅ Debugging de issues de invitación
- ✅ Validación de tracking de invitador

**Resultado esperado:**
```
✅ 14/14 invitación tests pasando
```

---

### 3. `test-mailtrap.sh` - Tests de Email
**Propósito:** Validar emails llegando a Mailtrap/Mailpit

**Uso:**
```bash
bash scripts/test-mailtrap.sh
```

**Qué hace:**
- Envía email de verificación
- Envía email de invitación
- Envía email de reset de contraseña
- Verifica que lleguen a Mailpit
- Muestra instrucciones para visualizar

**Cuándo usarlo:**
- ✅ Después de cambios en templates de email
- ✅ Testing de nuevo email system
- ✅ Verificación visual de emails

**Resultado esperado:**
```
✅ 3 emails enviados a Mailpit
📬 Visualizar en http://localhost:8025
```

**Nota:** Requiere que Mailpit esté ejecutándose:
```bash
docker compose up mailpit
```

---

### 4. `check-docs.sh` - Validación de Documentación
**Propósito:** Verificar que toda la documentación esté actualizada

**Uso:**
```bash
bash scripts/check-docs.sh
```

**Qué hace:**
- Verifica que archivos de docs existan
- Valida referencias en documentación
- Revisa links internos
- Genera reporte de cobertura

**Cuándo usarlo:**
- ✅ Después de cambios en código
- ✅ Antes de release
- ✅ Validación pre-commit

**Resultado esperado:**
```
✅ Documentación completa
✅ Todas las referencias OK
```

---

### 5. `TESTING_SUMMARY.sh` - Reporte Final Completo
**Propósito:** Generar reporte final de testing exhaustivo

**Uso:**
```bash
bash scripts/TESTING_SUMMARY.sh
```

**Qué hace:**
- Ejecuta todos los tests
- Genera reporte completo
- Resumen por módulo
- Recomendaciones
- Status de producción

**Cuándo usarlo:**
- ✅ Antes de release a producción
- ✅ Revisión completa del proyecto
- ✅ Documentación de estado actual

**Resultado esperado:**
```
📊 TESTING SUMMARY
✅ 114/114 tests
✅ Email system OK
✅ APIs OK
✅ Documentación OK
🚀 LISTO PARA PRODUCCIÓN
```

---

## 🔄 Workflow Típico

### Durante Desarrollo

1. **Haces cambios:**
   ```bash
   # ... editas código ...
   ```

2. **Corres tests específicos:**
   ```bash
   # Si cambias invitaciones
   bash scripts/test-invitaciones.sh
   
   # Si cambias emails
   bash scripts/test-mailtrap.sh
   ```

3. **Validas documentación:**
   ```bash
   bash scripts/check-docs.sh
   ```

### Antes de Commit

```bash
# Suite completa
bash scripts/run-tests.sh

# Reporte final
bash scripts/TESTING_SUMMARY.sh
```

### Antes de Release

```bash
# Todo junto
bash scripts/TESTING_SUMMARY.sh

# Si OK → listo para producción
```

---

## 📊 Quick Commands

```bash
# Ver todos los scripts disponibles
ls -la scripts/

# Ejecutar un script específico
bash scripts/run-tests.sh

# Ver contenido de un script
cat scripts/run-tests.sh

# Hacer script ejecutable
chmod +x scripts/test-mailtrap.sh

# Ejecutar con output completo
bash scripts/test-invitaciones.sh 2>&1 | tee output.log
```

---

## 🎯 Reglas para Scripts

### Crear nuevos scripts

Si necesitas crear un nuevo script de testing:

1. **Ubicación:** `scripts/nombreScript.sh`
2. **Header estándar:**
   ```bash
   #!/bin/bash
   # Script description
   # Usage: bash scripts/nombreScript.sh
   ```
3. **Documentar en CHANGELOG.md** qué hace
4. **Documentar aquí** en esta guía

### Mantener scripts

- ✅ Mantener scripts simples
- ✅ Agregar ayuda: `bash script.sh --help`
- ✅ Usar colores y emojis para claridad
- ✅ Documentar antes de cambiar
- ✅ Hacer scripts idempotentes (sin efectos secundarios)

---

## 🚨 Troubleshooting

### Script no ejecuta
```bash
# Solución 1: Dar permisos
chmod +x scripts/nombre.sh

# Solución 2: Ejecutar con bash
bash scripts/nombre.sh  # ✓ Mejor opción
```

### Errores de dependencias
```bash
# Verificar que Docker está corriendo
docker compose ps

# Verificar que containers existen
docker compose up -d

# Luego correr el script
bash scripts/test-mailtrap.sh
```

### Tests fallan
```bash
# Ejecutar con verbosidad
bash scripts/run-tests.sh -v

# Ver logs completos
tail -50 storage/logs/laravel.log
```

---

## 📝 Referencia en CHANGELOG

Cuando hagas cambios relacionados con testing, documenta en `docs/CHANGELOG.md`:

```markdown
## [X.X.X] - FECHA

### 🧪 Testing
- ✅ Nueva suite de tests para feature X
- 🔧 Fix en test de módulo Y
- 📊 Scripts: ver `scripts/` para ejecutar tests
```

---

## 📚 Relación con Documentación

| Aspecto | Ubicación |
|---------|-----------|
| Cómo usar scripts | Este archivo (EN RAÍZ) |
| Cambios en tests | `docs/CHANGELOG.md` |
| Resultados de tests | `docs/TESTING.md` |
| Guía de testing | `docs/TESTING.md` |

---

## ✅ Checklist para Nueva Feature

```
- [ ] Código escrito
- [ ] Tests escritos (unit + feature)
- [ ] Correr: bash scripts/run-tests.sh
- [ ] Correr: bash scripts/check-docs.sh
- [ ] Actualizar docs/CHANGELOG.md
- [ ] Visualizar cambios en scripts/
- [ ] Correr: bash scripts/TESTING_SUMMARY.sh
- [ ] Si OK → Listo para commit
```

---

**Última actualización**: 15 de Noviembre, 2025  
**Scripts centralizados en**: `scripts/`  
**Documentación de cambios**: `docs/CHANGELOG.md`
