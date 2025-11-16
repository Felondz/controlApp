# Contributing Guide - ControlApp

¡Gracias por tu interés en contribuir a ControlApp! Esta guía te ayudará a entender el proceso de contribución.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Contribuir?](#cómo-contribuir)
3. [Reporte de Bugs](#reporte-de-bugs)
4. [Sugerencias de Features](#sugerencias-de-features)
5. [Pull Requests](#pull-requests)
6. [Guía de Estilo](#guía-de-estilo)
7. [Configuración Local](#configuración-local)
8. [Proceso de Review](#proceso-de-review)

---

## 📜 Código de Conducta

### Nuestro Compromiso

En ControlApp nos comprometemos a proporcionar un entorno acogedor para todos, independientemente de:
- Edad, género, identidad de género
- Nivel de experiencia
- Nacionalidad, origen étnico
- Religión, orientación sexual
- Discapacidad física o mental

### Comportamiento Esperado

- 🤝 Sé respetuoso y inclusivo
- 💬 Comunica de forma clara y constructiva
- 🎯 Enfócate en el código, no en la persona
- 🚫 No hagas acoso, discriminación o bullying
- 📚 Ayuda a otros miembros de la comunidad

### Consecuencias de Conducta Inapropiada

Las conductas violentas pueden resultar en:
- Avisos
- Suspensión de permisos
- Expulsión permanente del proyecto

---

## 🤝 ¿Cómo Contribuir?

### Niveles de Contribución

#### 1️⃣ Principiante (Sin cambios en código)
- 📝 Mejorar documentación
- 🐛 Reportar bugs
- 💡 Sugerir features
- 💬 Responder preguntas en issues

#### 2️⃣ Intermedio (Cambios pequeños)
- 🐛 Corregir bugs reportados
- 📝 Actualizar ejemplos
- ♻️ Refactorizar código
- ✨ Mejorar tests

#### 3️⃣ Avanzado (Features nuevas)
- ✨ Implementar features nuevas
- 🏗️ Cambios arquitectónicos
- 📊 Optimizaciones de performance
- 🔐 Mejoras de seguridad

---

## 🐛 Reporte de Bugs

### Antes de Reportar

1. 🔍 **Busca bugs existentes**
   ```
   Usa GitHub Issues para buscar por palabras clave
   El bug que encontraste probablemente ya fue reportado
   ```

2. 🧪 **Reproduce el bug**
   ```
   En desarrollo local
   En el servidor
   Con versión específica
   ```

3. 📋 **Reúne información**
   - Sistema operativo
   - Versión de PHP/Laravel
   - Navegador (si es relevante)
   - Pasos exactos para reproducir

### Formato de Reporte

```markdown
## Descripción
Descripción breve del bug

## Pasos para Reproducir
1. Abre...
2. Haz clic en...
3. Escribe...
4. Se muestra error...

## Comportamiento Esperado
Qué debería haber pasado

## Comportamiento Actual
Qué pasó realmente

## Screenshots
Si es aplicable

## Ambiente
- OS: Windows 10 / macOS / Linux
- PHP: 8.4.14
- Laravel: 12.38.1
- Navegador: Chrome 131

## Logs
```
Copia relevant logs aquí
```

## Información Adicional
Cualquier otra información relevante
```

### Ejemplo Real

```markdown
## Descripción
La verificación de email falla cuando el email contiene caracteres especiales

## Pasos para Reproducir
1. Registrarse con email: josé@example.com
2. Hacer clic en enlace de verificación del email
3. Aparece error 400

## Comportamiento Esperado
El email debería verificarse correctamente

## Comportamiento Actual
Error: "The verification link is invalid"

## Ambiente
- OS: macOS 14.2
- PHP: 8.4.14
- Laravel: 12.38.1

## Logs
[ERROR] Hash validation failed: expected abc123, got def456
```

---

## 💡 Sugerencias de Features

### Antes de Sugerir

1. ✅ Lee la documentación completa
2. ✅ Busca features similares ya sugeridas
3. ✅ Verifica el roadmap en el README
4. ✅ Considera si la feature encaja en la visión del proyecto

### Formato de Sugerencia

```markdown
## Descripción de la Feature
Resumen claro y conciso

## Problema que Resuelve
¿Cuál es el problema actual?
¿Por qué es importante?

## Solución Propuesta
¿Cómo debería funcionar?
Paso a paso del flujo

## Beneficios
- Beneficio 1
- Beneficio 2
- Beneficio 3

## Alternativas Consideradas
Otras formas de resolver esto

## Contexto Adicional
Screenshots, mockups, links
```

### Ejemplo Real

```markdown
## Descripción de la Feature
Agregar exportación de reportes a PDF

## Problema que Resuelve
Actualmente solo se puede ver reportes en pantalla.
Los usuarios quieren guardar reportes para imprimir o compartir.

## Solución Propuesta
1. Agregar botón "Exportar a PDF" en página de reportes
2. Generar PDF con datos del reporte
3. Descargar automáticamente

## Beneficios
- Mejor accesibilidad
- Compartir datos fácilmente
- Cumplimiento normativo

## Contexto Adicional
- Usar librería: Laravel TCPDF
- Similar a feature en competencia X
```

---

## 🔀 Pull Requests

### Antes de hacer PR

1. **Fork el repositorio**
   ```bash
   Click "Fork" en GitHub
   ```

2. **Clonar tu fork**
   ```bash
   git clone https://github.com/tu-usuario/controlApp.git
   cd controlApp
   ```

3. **Agregar upstream remote**
   ```bash
   git remote add upstream https://github.com/Felondz/controlApp.git
   ```

4. **Crear branch**
   ```bash
   git checkout -b feat/tu-feature-nombre
   ```

### Proceso de Desarrollo

```bash
# 1. Actualizar tu rama con cambios de main
git fetch upstream
git rebase upstream/main

# 2. Hacer tus cambios
# Editar archivos...
# Crear tests...
# Actualizar documentación...

# 3. Hacer commit (seguir convención)
git add .
git commit -m "feat(modulo): descripción clara"

# 4. Push a tu fork
git push origin feat/tu-feature-nombre

# 5. Crear Pull Request en GitHub
```

### Mensaje de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/es/):

```
<tipo>(<alcance>): <descripción>

<cuerpo opcional>

<pie opcional>
```

**Tipos:**
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios de documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `perf:` Mejoras de performance
- `test:` Tests
- `chore:` Cambios en config

**Ejemplos:**
```bash
# Feature
git commit -m "feat(api): agregar endpoint de reportes"

# Bug fix
git commit -m "fix(email): validar caracteres especiales en hash"

# Documentación
git commit -m "docs(readme): agregar instrucciones de setup"

# Con descripción
git commit -m "feat(transacciones): soportar transacciones recurrentes

- Agregar modelo TransaccionRecurrente
- Migración para tabla
- Tests unitarios
- Documentación en API.md

Closes #123"
```

### Plantilla de PR

```markdown
## 📝 Descripción
Breve resumen de los cambios

## 🎯 Tipo de Cambio
- [ ] Bug fix (cambio que arregla un issue)
- [ ] Feature (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que afecta API)
- [ ] Documentación

## 🔗 Links
Fixes #123
Related to #456

## ✅ Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] He revisado mi propio código
- [ ] He agregado tests que validan mis cambios
- [ ] Los tests nuevos pasan localmente
- [ ] He actualizado la documentación
- [ ] No hay cambios que generen warnings

## 🧪 Cómo Testear
```bash
# Pasos para probar los cambios
```

## 📸 Screenshots
Si aplica, agregar screenshots de antes/después

## 📊 Impact
- **Performance**: No change / Small improvement / Large improvement
- **Security**: No issues / Potential issues / Critical
- **Breaking**: No / Yes
```

---

## 📐 Guía de Estilo

### PHP

```php
// ✅ BIEN: PSR-12 standard
namespace App\Http\Controllers;

class ProyectoController extends Controller
{
    public function store(StoreProyectoRequest $request)
    {
        $validated = $request->validated();
        
        $proyecto = Proyecto::create($validated);
        
        return response()->json($proyecto, 201);
    }
}

// ❌ MAL: Inconsistencias
namespace App\Http\Controllers;
class proyectoController extends Controller{
public function store($request){
$proyecto=Proyecto::create($request->all());
return response()->json($proyecto,201);}
}
```

### Reglas PHP

1. **PSR-12**: Seguir estándar PSR-12
2. **Indentación**: 4 espacios
3. **Nombres**: camelCase para métodos/propiedades, PascalCase para clases
4. **Longitud línea**: máx 120 caracteres
5. **Type hints**: Usar siempre type hints
6. **Return types**: Especificar tipo de retorno

### JavaScript

```javascript
// ✅ BIEN
const storeProject = async (projectData) => {
  const response = await fetch('/api/proyectos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  
  return response.json();
};

// ❌ MAL
var storeProject=function(data){
var response=$.post('/api/proyectos',data);
return response;
}
```

### Blade Templates

```blade
{{-- ✅ BIEN --}}
<div class="card">
    <h1>{{ $proyecto->nombre }}</h1>
    @if($proyecto->active)
        <span class="badge">Activo</span>
    @else
        <span class="badge-secondary">Inactivo</span>
    @endif
</div>

{{-- ❌ MAL --}}
<div>
<h1><?php echo $proyecto->nombre; ?></h1>
<?php if($proyecto->active){ ?>
<span>Activo</span>
<?php } ?>
</div>
```

### Documentación

```php
/**
 * Crear un nuevo proyecto
 *
 * @param StoreProyectoRequest $request Datos validados
 * @return JsonResponse Proyecto creado
 * 
 * @throws ValidationException
 */
public function store(StoreProyectoRequest $request): JsonResponse
{
    // ...
}
```

---

## 🔧 Configuración Local

### Prerequisites

```bash
# Verificar versiones
php -v          # >= 8.4
composer -v     # >= 2.6
docker -v       # >= 24
```

### Setup Completo

```bash
# 1. Clonar repo
git clone https://github.com/tu-usuario/controlApp.git
cd controlApp

# 2. Instalar dependencias PHP
docker compose run --rm laravel.test composer install

# 3. Copiar .env
cp .env.example .env

# 4. Generar app key
docker compose exec laravel.test php artisan key:generate

# 5. Levantar contenedores
docker compose up -d

# 6. Ejecutar migraciones
docker compose exec laravel.test php artisan migrate

# 7. Crear datos de prueba (opcional)
docker compose exec laravel.test php artisan db:seed
```

### Verificar Setup

```bash
# Verificar que todos los servicios estén corriendo
docker compose ps

# Acceder a la app
curl http://localhost:8000

# Ejecutar tests
docker compose exec laravel.test php artisan test
```

---

## 🔍 Proceso de Review

### Qué Revisor Busca

✅ **Aprobará PR si:**
- El código sigue la guía de estilo
- Los tests pasan y cubren los cambios
- La documentación está actualizada
- No hay regresiones
- El mensaje de commit es claro
- El PR tiene una descripción clara

❌ **Rechazará PR si:**
- No hay tests
- El código es difícil de entender
- Tiene bugs obvios
- Viola la guía de estilo
- Falta documentación
- No sigue convenciones

### Responder a Comentarios

```markdown
# ✅ Aceptar sugerencia
> Considerar usar const en lugar de let

Tienes razón, actualicé la línea 42.

# 🤔 Preguntar clarificación
> No entiendo por qué cambiar el algoritmo

¿Podrías explicar qué ventajas tiene? Quiero asegurarme 
de que el cambio es correcto.

# 📝 Explicar decisión
> ¿Por qué no usar el patrón X?

Elegí este patrón porque es más simple y la 
performance es similar en este contexto.
```

### Cambios Solicitados

```bash
# 1. Hacer los cambios
# ... editar archivos ...

# 2. Hacer commit (NO fuerces push)
git add .
git commit -m "refactor: responder a comentarios de review"

# 3. Push normal
git push origin feat/tu-feature-nombre

# GitHub mostrará los cambios nuevos en la conversación
# No necesitas crear PR nuevo
```

---

## 🎓 Aprende Más

### Documentación
- [README.md](../README.md) - Visión general
- [API.md](./API.md) - Documentación de endpoints
- [DATABASE.md](./DATABASE.md) - Esquema de BD
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Sistema de autenticación

### Recursos Externos
- [Laravel Documentation](https://laravel.com/docs)
- [Git Workflow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [PSR-12 Standard](https://www.php-fig.org/psr/psr-12/)

---

## 💬 Preguntas?

- 📧 Email: contacto@example.com
- 🐦 Twitter: @Felondz
- 💬 Issues: Abre un issue con la etiqueta `question`
- 📚 Discussions: Usa GitHub Discussions

---

## 🙏 Gracias

¡Gracias por contribuir a ControlApp! Tu tiempo y esfuerzo 
hacen que este proyecto sea mejor para todos.

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar.

---

**Última actualización**: 15 de noviembre de 2025
**Maintainer**: Felondz (@Felondz)
