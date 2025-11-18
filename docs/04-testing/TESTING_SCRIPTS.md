# 🧪 Scripts de Testing - Guía Completa

## ⚠️ NOTA IMPORTANTE: Docker es Obligatorio

**Descubierto el 16 de Noviembre de 2025:**

Los tests **DEBEN ejecutarse dentro del contenedor Docker**. Si ejecutas los scripts desde el host, se quedarán **colgados indefinidamente** (timeout 15+ minutos) debido a problemas de resolución DNS de `mysql`.

**Verificación rápida:**
```bash
# ✅ Esto funciona (tests dentro de Docker)
docker compose exec -T laravel.test php artisan test --testdox

# ❌ Esto se cuelga (tests desde host)
php artisan test
```

---

## 📍 Ubicación

Todos los scripts de testing están centralizados en:
```
scripts/
```

## 📝 Descripción de Scripts

### 1. `run-tests.sh` - Suite Principal de Tests
**Propósito:** Ejecutar toda la suite de tests del proyecto

**Uso (DENTRO DE DOCKER):**
```bash
docker compose exec -T laravel.test bash scripts/run-tests.sh
# O directamente
docker compose exec -T laravel.test php artisan test --testdox
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
✅ 131 tests pasando
✅ 342 assertions correctas
```

---

### 2. `test-invitaciones.sh` - Tests de Invitaciones
**Propósito:** Validar el sistema de invitaciones específicamente

**Uso (DENTRO DE DOCKER):**
```bash
docker compose exec -T laravel.test bash scripts/test-invitaciones.sh
# O directamente
docker compose exec -T laravel.test php artisan test tests/Feature/InvitacionesApiTest.php --testdox
```

**Qué hace:**
- Tests de creación de invitaciones
- Validación de emails de invitación (con DNS check)
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

**Uso (DENTRO DE DOCKER):**
```bash
docker compose exec -T laravel.test bash scripts/test-mailtrap.sh
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
docker compose up mailpit -d
```

---

### 4. `check-docs.sh` - Validación de Documentación
**Propósito:** Verificar que toda la documentación esté actualizada

**Uso (DENTRO DE DOCKER):**
```bash
docker compose exec -T laravel.test bash scripts/check-docs.sh
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

**Uso (DENTRO DE DOCKER):**
```bash
docker compose exec -T laravel.test bash scripts/TESTING_SUMMARY.sh
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
✅ 131/131 tests
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

2. **Corres tests específicos (EN DOCKER):**
   ```bash
   # Si cambias invitaciones
   docker compose exec -T laravel.test php artisan test tests/Feature/InvitacionesApiTest.php --testdox
   
   # Si cambias emails
   docker compose exec -T laravel.test php artisan test tests/Feature/VisualEmailTestsInMailpitTest.php --testdox
   ```

3. **Validas documentación (EN DOCKER):**
   ```bash
   docker compose exec -T laravel.test bash scripts/check-docs.sh
   ```

### Antes de Commit

```bash
# Suite completa (EN DOCKER)
docker compose exec -T laravel.test php artisan test --testdox

# Reporte final (EN DOCKER)
docker compose exec -T laravel.test bash scripts/TESTING_SUMMARY.sh
```

### Antes de Release

```bash
# Todo junto (EN DOCKER)
docker compose exec -T laravel.test bash scripts/TESTING_SUMMARY.sh

# Si OK → listo para producción
```

---

## 📊 Quick Commands

```bash
# Ver todos los scripts disponibles
ls -la scripts/

# Ejecutar dentro de Docker
docker compose exec -T laravel.test php artisan test --testdox

# Ver logs si algo falla
docker compose logs laravel.test

# Verificar que containers están corriendo
docker compose ps
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
   # Usage: docker compose exec -T laravel.test bash scripts/nombreScript.sh
   ```
3. **Documentar en CHANGELOG.md** qué hace
4. **Documentar aquí** en esta guía
5. **SIEMPRE ejecutar dentro de Docker**

### Mantener scripts

- ✅ Mantener scripts simples
- ✅ Agregar ayuda: `bash script.sh --help`
- ✅ Usar colores y emojis para claridad
- ✅ Documentar antes de cambiar
- ✅ Hacer scripts idempotentes (sin efectos secundarios)
- ✅ **SIEMPRE** asumir ejecución dentro de Docker

---

## 🚨 Troubleshooting

### Script no ejecuta / Se cuelga por 15+ minutos
```bash
# ❌ PROBLEMA: Ejecutaste desde host
php artisan test

# ✅ SOLUCIÓN: Ejecuta en Docker
docker compose exec -T laravel.test php artisan test --testdox

# Si se cuelga, presiona Ctrl+C y reintenta con Docker
```

### Errores de dependencias
```bash
# Verificar que Docker está corriendo
docker compose ps

# Si faltan containers, levantarlos
docker compose up -d

# Luego correr tests (EN DOCKER)
docker compose exec -T laravel.test php artisan test --testdox
```

### Tests fallan
```bash
# Ejecutar con verbosidad (EN DOCKER)
docker compose exec -T laravel.test php artisan test --testdox -v

# Ver logs del container
docker compose logs -f laravel.test

# Reiniciar containers si está corrupto
docker compose restart laravel.test
```

---

## 📝 Referencia en CHANGELOG

Cuando hagas cambios relacionados con testing, documenta en `docs/CHANGELOG.md`:

```markdown
## [X.X.X] - FECHA

### 🧪 Testing
- ✅ Nueva suite de tests para feature X
- 🔧 Fix en test de módulo Y
- 📊 Scripts: ver `scripts/` - EJECUTAR EN DOCKER
- 🐛 Descubierto: Tests cuelgan si se ejecutan desde host
```

---

## 📚 Relación con Documentación

| Aspecto | Ubicación |
|---------|-----------|
| Cómo usar scripts | Este archivo (EN RAÍZ) |
| Cambios en tests | `docs/CHANGELOG.md` |
| Resultados de tests | `docs/TESTING.md` |
| Guía de testing | `docs/TESTING.md` |
| Docker importante | **AMBOS ARCHIVOS** |

---

## ✅ Checklist para Nueva Feature

```
- [ ] Código escrito
- [ ] Tests escritos (unit + feature)
- [ ] ✅ IMPORTANTE: Correr en Docker
  docker compose exec -T laravel.test php artisan test --testdox
- [ ] Correr: docker compose exec -T laravel.test bash scripts/check-docs.sh
- [ ] Actualizar docs/CHANGELOG.md
- [ ] Visualizar cambios en scripts/
- [ ] Correr: docker compose exec -T laravel.test bash scripts/TESTING_SUMMARY.sh
- [ ] Si OK → Listo para commit
```

---

**Última actualización**: 16 de Noviembre, 2025  
**Scripts centralizados en**: `scripts/`  
**⚠️ IMPORTANTE**: Tests solo en Docker (`docker compose exec -T laravel.test`)  
**Documentación de cambios**: `docs/CHANGELOG.md`


