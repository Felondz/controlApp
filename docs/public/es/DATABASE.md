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

### 4. Cuentas Financieras (`cuentas`)
Cuentas financieras asociadas a proyectos (personales o colaborativos).
- **Tipos** (6 tipos soportados):
    - `efectivo`: Dinero en efectivo
    - `banco`: Cuenta bancaria estándar
    - `credito`: Tarjeta de crédito (requiere: límite, tasa de interés, día de corte, día de pago, fecha de vencimiento)
    - `inversion`: Cuenta de inversión (opcional: tasa de interés anual)
    - `prestamo`: Préstamo (requiere: tasa de interés, día de pago, fecha de vencimiento opcional)
    - `otro`: Otros tipos de cuentas
- **Moneda**: Soporte multi-divisa (COP, USD, EUR, MXN, PEN, CLP, ARS, BRL) - cada cuenta puede tener su propia moneda.
- **Schema**: La columna `tipo` es VARCHAR(20) para máxima flexibilidad.
- **Campos dinámicos**: Dependiendo del tipo de cuenta, se requieren campos adicionales (límite de crédito, tasas de interés, fechas de vencimiento).

### 5. Transacciones (`transactions`)
Registros de ingresos y gastos.
- **Relación**: Vinculadas a una Cuenta y (opcionalmente) a un Proyecto.
- **Categorización**: Se organizan mediante categorías personalizables.


