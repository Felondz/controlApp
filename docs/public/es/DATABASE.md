# 🗄️ Estructura de Base de Datos (Pública)

Esta documentación describe las entidades principales del sistema ControlApp a alto nivel. Para detalles específicos de esquema, columnas y relaciones, los colaboradores deben consultar la documentación privada.

## Entidades Principales

### 1. Usuarios (`users`)
Representa a los usuarios registrados en la plataforma.
- **Información**: Nombre, correo electrónico, contraseña (hasheada), preferencias de tema.
- **Seguridad**: Los correos deben ser verificados antes de otorgar acceso completo.

### 2. Proyectos (`projects`)
El núcleo de la aplicación. Un proyecto agrupa tareas, finanzas y miembros.
- **Tipos**: Personal o Colaborativo.
- **Personalización**: Color, icono, descripción.

### 3. Miembros del Proyecto (`project_members`)
Gestiona la relación entre usuarios y proyectos.
- **Roles**:
    - `admin`: Control total del proyecto.
    - `member`: Puede crear/editar pero no borrar el proyecto.
    - `viewer`: Solo lectura.

### 4. Cuentas Financieras (`accounts`)
Cuentas bancarias o de efectivo asociadas a un usuario o proyecto.
- **Tipos**: Banco, Efectivo, Tarjeta de Crédito, Digital.
- **Moneda**: Soporte multidivisa (COP, USD, EUR).

### 5. Transacciones (`transactions`)
Registros de ingresos y gastos.
- **Relación**: Vinculadas a una Cuenta y (opcionalmente) a un Proyecto.
- **Categorización**: Se organizan mediante categorías personalizables.


