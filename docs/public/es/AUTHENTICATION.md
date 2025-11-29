# 🔐 Autenticación y Seguridad (Pública)

ControlApp toma la seguridad muy en serio. Este documento describe los mecanismos generales de autenticación y protección de cuentas.

## Flujos de Autenticación

### Registro
- Se requiere nombre, correo electrónico y contraseña segura.
- **Verificación de Correo**: Es obligatoria para acceder a todas las funcionalidades.

### Inicio de Sesión
- Soporte para autenticación tradicional (Email/Contraseña).
- Protección contra fuerza bruta (Rate Limiting en login).

### Recuperación de Contraseña
- Sistema seguro basado en tokens temporales enviados por correo electrónico.
- Los enlaces de recuperación tienen un tiempo de expiración corto.

## Gestión de Sesiones
- **Web**: Sesiones basadas en cookies seguras (HttpOnly, Secure).
- **API**: Tokens de acceso revocables (Sanctum).

## Seguridad de Datos
- **Contraseñas**: Almacenadas utilizando algoritmos de hashing fuertes (Bcrypt/Argon2).
- **Aislamiento**: Los datos de los proyectos están aislados lógicamente para asegurar que solo los miembros autorizados tengan acceso.


