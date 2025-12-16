# Documentación para Desarrolladores

Bienvenido al centro de desarrollo de **controlApp**. Aquí encontrarás los estándares, guías y referencias técnicas para mantener y escalar la plataforma.

## Arquitectura del Proyecto

El proyecto sigue una arquitectura de **Monolito Modular** basada en Laravel 12.

*   **Backend:** Laravel 12 (PHP 8.2+)
*   **Frontend:** React 18 + Inertia.js
*   **Base de Datos:** MySQL / MariaDB
*   **Estilos:** Tailwind CSS 3.x

### Estructura de Módulos
El código se organiza en dominios dentro de `app/Modules`. Cada módulo encapsula su lógica (Modelos, Controladores, Servicios).

*   `Finance`: Gestión de cuentas, transacciones y presupuestos.
*   `Operations`: Proyectos, tareas y flujo de trabajo.
*   `Core`: Autenticación, usuarios y configuraciones globales.

## API Reference

Documentación automática de endpoints API generada con Scramble.

> [!TIP]
> **[Ver Documentación API Interactiva](/docs/api)**
>
> Consulta los endpoints, esquemas de request/response y prueba las peticiones directamente.

## Comandos Útiles

```bash
# Iniciar entorno de desarrollo (Sail)
./vendor/bin/sail up -d

# Compilar assets frontend (HMR)
pnpm dev

# Ejecutar tests
./vendor/bin/sail test
```

## Seguridad

*   Toda nueva funcionalidad debe estar protegida por **Policies**.
*   No exponer datos sensibles en respuestas JSON globales.
*   Usar `Sanctum` para autenticación API.
