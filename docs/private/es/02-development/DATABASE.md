# Database Schema - ControlApp

Documentación completa del esquema de base de datos y relaciones entre modelos.

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tablas](#tablas)
3. [Relaciones](#relaciones)
4. [Índices](#índices)
5. [Queries Útiles](#queries-útiles)
6. [Migraciones](#migraciones)

---

## 📊 Descripción General

ControlApp utiliza **MySQL 8.0** con las siguientes características:

- ✅ Relaciones Many-to-Many
- ✅ Soft Deletes (borrado lógico)
- ✅ Timestamps (created_at, updated_at)
- ✅ UUID y autoincrement IDs
- ✅ Índices para optimización
- ✅ Foreign keys con cascadas

### Diagrama E-R (Entidad-Relación)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ email_verified  │
│ created_at      │
└─────────────────┘
        │ 1
        │
        │ M
        ├──────────────────┬────────────────────┬──────────────────┐
        │                  │                    │                  │
        ▼ 1                ▼ M                  ▼ M                ▼ M
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   PROYECTOS      │ │ INVITACIONES │ │ PROYECTO_USER    │ │   CATEGORIAS     │
├──────────────────┤ ├──────────────┤ ├──────────────────┤ ├──────────────────┤
│ id (PK)          │ │ id (PK)      │ │ proyecto_id (FK) │ │ id (PK)          │
│ nombre           │ │ proyecto_id  │ │ user_id (FK)     │ │ nombre           │
│ moneda           │ │ email        │ │ role             │ │ proyecto_id (FK) │
│ user_id (FK)     │ │ estado       │ │                  │ │ color            │
│ deleted_at       │ │ created_at   │ │ created_at       │ │ icono            │
│ created_at       │ │              │ │                  │ │ deleted_at       │
│ updated_at       │ │              │ │                  │ │ created_at       │
└──────────────────┘ └──────────────┘ └──────────────────┘ └──────────────────┘
        │ 1                                                         │ M
        │                                                           │
        │ M                                                         │ 1
        │                                                           ▼
        └──────────────────────────┬──────────────────────────┐    │
                                   │                          │    │
                                   ▼                          ▼    │
                            ┌──────────────┐         ┌────────────────────┐
                            │   CUENTAS    │         │ TRANSACCIONES      │
                            ├──────────────┤         ├────────────────────┤
                            │ id (PK)      │ 1       │ id (PK)            │
                            │ nombre       │◄────────│ cuenta_id (FK)     │
                            │ tipo         │ M       │ categoria_id (FK)  │
                            │ saldo        │         │ descripcion        │
                            │ proyecto_id  │         │ monto              │
                            │ deleted_at   │         │ tipo (ingreso/ego) │
                            │ created_at   │         │ fecha              │
                            │ updated_at   │         │ deleted_at         │
                            └──────────────┘         │ created_at         │
                                                     │ updated_at         │
                                                     └────────────────────┘
```

---

## 📑 Tablas

### 1. USERS
 
 Tabla de usuarios del sistema.
 
 ```sql
 CREATE TABLE users (
   id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(255) NOT NULL,
   email varchar(255) UNIQUE NOT NULL,
   email_verified_at timestamp NULL,
   password varchar(255) NOT NULL,
   remember_token varchar(100) NULL,
   is_super_admin boolean NOT NULL DEFAULT false,
   locale varchar(5) NOT NULL DEFAULT 'es',
   profile_photo_path varchar(2048) NULL,
   global_theme varchar(50) NOT NULL DEFAULT 'purple-modern',
   created_at timestamp NULL,
   updated_at timestamp NULL,
   
   INDEX idx_email (email),
   INDEX idx_created_at (created_at)
 );
 ```
 
 **Campos:**
 | Campo | Tipo | Descripción |
 |-------|------|-------------|
 | `id` | bigint UNSIGNED | ID único auto-incrementado |
 | `name` | varchar(255) | Nombre completo del usuario |
 | `email` | varchar(255) | Email único para login |
 | `email_verified_at` | timestamp | Fecha de verificación de email |
 | `password` | varchar(255) | Contraseña encriptada (bcrypt) |
 | `remember_token` | varchar(100) | Token para "recordarme" |
 | `is_super_admin` | boolean | Indica si es super administrador |
 | `locale` | varchar(5) | Preferencia de idioma (es/en) |
 | `profile_photo_path` | varchar(2048) | Ruta de la foto de perfil |
 | `global_theme` | varchar(50) | Tema global preferido |
 | `created_at` | timestamp | Fecha de creación |
 | `updated_at` | timestamp | Fecha de última actualización |
 
 **Ejemplos:**
 ```sql
 -- Consultar usuario por email
 SELECT * FROM users WHERE email = 'juan@example.com';
 
 -- Usuarios con email verificado
 SELECT * FROM users WHERE email_verified_at IS NOT NULL;
 
 -- Contar usuarios registrados en los últimos 7 días
 SELECT COUNT(*) FROM users 
 WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
 ```
 
 ---
 
 ### 2. PROYECTOS
 
 Tabla de proyectos financieros.
 
 ```sql
 CREATE TABLE proyectos (
   id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nombre varchar(255) NOT NULL,
   description text NULL,
   moneda varchar(3) NOT NULL DEFAULT 'COP',
   user_id bigint UNSIGNED NOT NULL,
   is_personal boolean NOT NULL DEFAULT false,
   modules json NULL,
   color varchar(7) NULL,
   icon varchar(50) NULL,
   image_path varchar(2048) NULL,
   theme varchar(50) NOT NULL DEFAULT 'purple-modern',
   typography varchar(50) NOT NULL DEFAULT 'sans',
   deleted_at timestamp NULL,
   created_at timestamp NULL,
   updated_at timestamp NULL,
   
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
   INDEX idx_user_id (user_id),
   INDEX idx_deleted_at (deleted_at),
   INDEX idx_created_at (created_at)
 );
 ```
 
 **Campos:**
 | Campo | Tipo | Descripción |
 |-------|------|-------------|
 | `id` | bigint UNSIGNED | ID único |
 | `nombre` | varchar(255) | Nombre del proyecto |
 | `description` | text | Descripción del proyecto |
 | `moneda` | varchar(3) | Código de moneda (USD, MXN, etc) |
 | `user_id` | bigint UNSIGNED | Propietario (FK a users) |
 | `is_personal` | boolean | Indica si es un proyecto personal |
 | `modules` | json | Módulos activos (finanzas, tareas) |
 | `color` | varchar(7) | Color identificativo |
 | `icon` | varchar(50) | Icono o emoji |
 | `image_path` | varchar(2048) | Imagen de portada |
 | `theme` | varchar(50) | Tema de color específico |
 | `typography` | varchar(50) | Tipografía específica |
 | `deleted_at` | timestamp | Fecha soft delete |
 | `created_at` | timestamp | Fecha de creación |
 | `updated_at` | timestamp | Fecha de última actualización |

**Características:**
- Soft delete: no se eliminan realmente
- Pertenece a un usuario propietario
- Puede tener múltiples miembros vía `proyecto_user`

**Ejemplos:**
```sql
-- Proyectos activos de un usuario
SELECT * FROM proyectos 
WHERE user_id = 1 AND deleted_at IS NULL;

-- Proyectos por moneda
SELECT COUNT(*), moneda FROM proyectos 
GROUP BY moneda;

-- Proyectos más recientes
SELECT * FROM proyectos 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;
```

---

### 3. PROYECTO_USER

Tabla pivote: relación many-to-many entre proyectos y usuarios.

```sql
CREATE TABLE proyecto_user (
  proyecto_id bigint UNSIGNED NOT NULL,
  user_id bigint UNSIGNED NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'miembro',
  created_at timestamp NULL,
  
  PRIMARY KEY (proyecto_id, user_id),
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `proyecto_id` | bigint UNSIGNED | ID del proyecto (FK) |
| `user_id` | bigint UNSIGNED | ID del usuario (FK) |
| `role` | varchar(50) | Rol: admin, miembro |
| `created_at` | timestamp | Fecha de unión |

**Roles válidos:**
- `admin` - Control total del proyecto
- `miembro` - Acceso básico

**Ejemplos:**
```sql
-- Miembros de un proyecto
SELECT u.id, u.name, u.email, pu.role 
FROM proyecto_user pu
JOIN users u ON pu.user_id = u.id
WHERE pu.proyecto_id = 1;

-- Proyectos de un usuario
SELECT p.id, p.nombre 
FROM proyecto_user pu
JOIN proyectos p ON pu.proyecto_id = p.id
WHERE pu.user_id = 1;

-- Admins de un proyecto
SELECT u.name FROM users u
JOIN proyecto_user pu ON u.id = pu.user_id
WHERE pu.proyecto_id = 1 AND pu.role = 'admin';
```

---

### 4. INVITACIONES

Tabla de invitaciones a proyectos.

```sql
CREATE TABLE invitaciones (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  proyecto_id bigint UNSIGNED NOT NULL,
  email varchar(255) NOT NULL,
  nombre varchar(255) NOT NULL,
  estado varchar(50) NOT NULL DEFAULT 'pendiente',
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  INDEX idx_proyecto_id (proyecto_id),
  INDEX idx_email (email),
  INDEX idx_estado (estado),
  UNIQUE idx_unique_invitacion (proyecto_id, email)
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint UNSIGNED | ID único |
| `proyecto_id` | bigint UNSIGNED | Proyecto (FK) |
| `email` | varchar(255) | Email del invitado |
| `nombre` | varchar(255) | Nombre del invitado |
| `estado` | varchar(50) | pendiente, aceptada, rechazada |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última actualización |

**Estados válidos:**
- `pendiente` - Invitación enviada, esperando respuesta
- `aceptada` - Invitación aceptada, usuario agregado
- `rechazada` - Invitación rechazada

**Restricciones:**
- Un email solo puede tener una invitación pendiente por proyecto

**Ejemplos:**
```sql
-- Invitaciones pendientes
SELECT * FROM invitaciones 
WHERE estado = 'pendiente' AND proyecto_id = 1;

-- Invitaciones de 7 días
SELECT * FROM invitaciones 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Contar invitaciones por estado
SELECT estado, COUNT(*) FROM invitaciones 
WHERE proyecto_id = 1
GROUP BY estado;
```

---

### 5. CATEGORIAS

Tabla de categorías de transacciones.

```sql
CREATE TABLE categorias (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  proyecto_id bigint UNSIGNED NOT NULL,
  nombre varchar(255) NOT NULL,
  color varchar(7) NOT NULL DEFAULT '#000000',
  icono varchar(2) NULL,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  INDEX idx_proyecto_id (proyecto_id),
  INDEX idx_deleted_at (deleted_at)
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint UNSIGNED | ID único |
| `proyecto_id` | bigint UNSIGNED | Proyecto (FK) |
| `nombre` | varchar(255) | Nombre de categoría |
| `color` | varchar(7) | Color hex (#RRGGBB) |
| `icono` | varchar(2) | Emoji o carácter |
| `deleted_at` | timestamp | Fecha soft delete |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última actualización |

**Ejemplos:**
```sql
-- Categorías de un proyecto
SELECT * FROM categorias 
WHERE proyecto_id = 1 AND deleted_at IS NULL;

-- Categorías con emojis
SELECT nombre, icono FROM categorias 
WHERE icono IS NOT NULL;

-- Contar categorías por proyecto
SELECT proyecto_id, COUNT(*) 
FROM categorias WHERE deleted_at IS NULL
GROUP BY proyecto_id;
```

---

### 6. CUENTAS

Tabla de cuentas bancarias/financieras.

```sql
CREATE TABLE cuentas (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  proyecto_id bigint UNSIGNED NOT NULL,
  nombre varchar(255) NOT NULL,
  tipo varchar(50) NOT NULL,
  saldo decimal(10, 2) NOT NULL DEFAULT 0.00,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  INDEX idx_proyecto_id (proyecto_id),
  INDEX idx_tipo (tipo),
  INDEX idx_deleted_at (deleted_at)
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint UNSIGNED | ID único |
| `proyecto_id` | bigint UNSIGNED | Proyecto (FK) |
| `nombre` | varchar(255) | Nombre de cuenta |
| `tipo` | varchar(50) | banco, efectivo, tarjeta, digital |
| `saldo` | decimal(10, 2) | Saldo actual |
| `deleted_at` | timestamp | Fecha soft delete |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última actualización |

**Tipos válidos:**
- `banco` - Cuenta bancaria
- `efectivo` - Dinero en efectivo
- `tarjeta` - Tarjeta de crédito/débito
- `digital` - Billetera digital, PayPal, etc.

**Ejemplos:**
```sql
-- Cuentas de un proyecto
SELECT * FROM cuentas 
WHERE proyecto_id = 1 AND deleted_at IS NULL;

-- Saldo total por proyecto
SELECT proyecto_id, SUM(saldo) as total 
FROM cuentas WHERE deleted_at IS NULL
GROUP BY proyecto_id;

-- Saldo por tipo de cuenta
SELECT tipo, SUM(saldo) FROM cuentas 
WHERE proyecto_id = 1 AND deleted_at IS NULL
GROUP BY tipo;
```

---

### 7. TRANSACCIONES

Tabla de transacciones financieras.

```sql
CREATE TABLE transacciones (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  cuenta_id bigint UNSIGNED NOT NULL,
  categoria_id bigint UNSIGNED NOT NULL,
  descripcion varchar(255) NOT NULL,
  monto decimal(10, 2) NOT NULL,
  tipo varchar(50) NOT NULL,
  fecha date NOT NULL,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (cuenta_id) REFERENCES cuentas(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  INDEX idx_cuenta_id (cuenta_id),
  INDEX idx_categoria_id (categoria_id),
  INDEX idx_tipo (tipo),
  INDEX idx_fecha (fecha),
  INDEX idx_deleted_at (deleted_at)
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint UNSIGNED | ID único |
| `cuenta_id` | bigint UNSIGNED | Cuenta (FK) |
| `categoria_id` | bigint UNSIGNED | Categoría (FK) |
| `descripcion` | varchar(255) | Descripción |
| `monto` | decimal(10, 2) | Cantidad de dinero |
| `tipo` | varchar(50) | ingreso o egreso |
| `fecha` | date | Fecha de la transacción |
| `deleted_at` | timestamp | Fecha soft delete |
| `created_at` | timestamp | Fecha de creación |
| `updated_at` | timestamp | Última actualización |

**Tipos válidos:**
- `ingreso` - Dinero que entra
- `egreso` - Dinero que sale

**Ejemplos:**
```sql
-- Transacciones del mes actual
SELECT * FROM transacciones 
WHERE cuenta_id = 1 
AND MONTH(fecha) = MONTH(NOW())
AND YEAR(fecha) = YEAR(NOW());

-- Total de gastos por categoría
SELECT c.nombre, SUM(t.monto) as total 
FROM transacciones t
JOIN categorias c ON t.categoria_id = c.id
WHERE t.tipo = 'egreso' AND c.proyecto_id = 1
GROUP BY c.id, c.nombre;

-- Ingresos vs Egresos
SELECT 
  SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as ingresos,
  SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) as egresos
FROM transacciones 
WHERE cuenta_id = 1;
```

---

### 8. Tablas del Sistema

#### CACHE
```sql
CREATE TABLE cache (
  key varchar(255) PRIMARY KEY,
  value longtext NOT NULL,
  expiration int NOT NULL,
  
  INDEX idx_expiration (expiration)
);
```

#### JOBS
```sql
CREATE TABLE jobs (
  id bigint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  queue varchar(255) NOT NULL,
  payload longtext NOT NULL,
  attempts tinyint UNSIGNED NOT NULL DEFAULT 0,
  reserved_at int UNSIGNED NULL,
  available_at int UNSIGNED NOT NULL,
  created_at int UNSIGNED NOT NULL,
  
  INDEX idx_queue (queue),
  INDEX idx_reserved_at (reserved_at),
  INDEX idx_available_at (available_at)
);
```

#### PERSONAL_ACCESS_TOKENS
```sql
CREATE TABLE personal_access_tokens (
  id bigint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tokenable_type varchar(255) NOT NULL,
  tokenable_id bigint UNSIGNED NOT NULL,
  name varchar(255) NOT NULL,
  token varchar(64) UNIQUE NOT NULL,
  abilities longtext NULL,
  last_used_at timestamp NULL,
  expires_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  INDEX idx_tokenable (tokenable_type, tokenable_id),
  INDEX idx_token (token)
);
```

---

## 🔗 Relaciones

### Diagrama de Relaciones

```
User (1) ─── (M) Proyectos
                  │
                  ├─ (M) Categorías
                  │
                  ├─ (M) Cuentas
                  │       │
                  │       └─ (M) Transacciones
                  │               │
                  │               └─ Categorías
                  │
                  └─ (M) Invitaciones

User (M) ─── (M) Proyectos (via proyecto_user)
```

### Relaciones en Eloquent

```php
// User
class User {
    public function proyectos() { // Propios
        return $this->hasMany(Proyecto::class);
    }
    
    public function miembrojroyectos() { // Como miembro
        return $this->belongsToMany(Proyecto::class, 'proyecto_user');
    }
}

// Proyecto
class Proyecto {
    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function miembros() {
        return $this->belongsToMany(User::class, 'proyecto_user');
    }
    
    public function categorias() {
        return $this->hasMany(Categoria::class);
    }
    
    public function cuentas() {
        return $this->hasMany(Cuenta::class);
    }
    
    public function invitaciones() {
        return $this->hasMany(Invitacion::class);
    }
}

// Cuenta
class Cuenta {
    public function transacciones() {
        return $this->hasMany(Transaccion::class);
    }
}

// Transaccion
class Transaccion {
    public function cuenta() {
        return $this->belongsTo(Cuenta::class);
    }
    
    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }
}
```

---

## 📇 Índices

### Índices por Tabla

| Tabla | Índice | Campos | Propósito |
|-------|--------|--------|----------|
| users | PRIMARY | id | Clave primaria |
| users | UNIQUE | email | Búsqueda rápida de usuario |
| users | idx_email | email | Filtrado |
| users | idx_created_at | created_at | Ordenamiento |
| proyectos | idx_user_id | user_id | Relación |
| proyectos | idx_deleted_at | deleted_at | Soft delete |
| categorias | idx_proyecto_id | proyecto_id | Relación |
| cuentas | idx_proyecto_id | proyecto_id | Relación |
| transacciones | idx_cuenta_id | cuenta_id | Relación |
| transacciones | idx_categoria_id | categoria_id | Relación |
| transacciones | idx_fecha | fecha | Rango de fechas |

---

## 📝 Queries Útiles

### Dashboard del Usuario

```sql
-- Resumen financiero completo
SELECT 
    p.id,
    p.nombre,
    p.moneda,
    COUNT(DISTINCT pu.user_id) as miembros,
    COUNT(DISTINCT c.id) as cuentas,
    SUM(c.saldo) as saldo_total,
    COUNT(DISTINCT cat.id) as categorias
FROM proyectos p
LEFT JOIN proyecto_user pu ON p.id = pu.proyecto_id
LEFT JOIN cuentas c ON p.id = c.proyecto_id AND c.deleted_at IS NULL
LEFT JOIN categorias cat ON p.id = cat.proyecto_id AND cat.deleted_at IS NULL
WHERE p.user_id = 1 AND p.deleted_at IS NULL
GROUP BY p.id, p.nombre, p.moneda;
```

### Reporte Mensual

```sql
-- Gastos por categoría este mes
SELECT 
    c.nombre,
    c.icono,
    SUM(t.monto) as total,
    COUNT(t.id) as transacciones
FROM transacciones t
JOIN categorias c ON t.categoria_id = c.id
WHERE t.cuenta_id IN (
    SELECT id FROM cuentas WHERE proyecto_id = 1
)
AND t.tipo = 'egreso'
AND MONTH(t.fecha) = MONTH(NOW())
AND YEAR(t.fecha) = YEAR(NOW())
AND t.deleted_at IS NULL
GROUP BY c.id, c.nombre, c.icono
ORDER BY total DESC;
```

### Análisis de Cuentas

```sql
-- Evolución de saldo de cuenta
SELECT 
    DATE(t.fecha) as fecha,
    t.tipo,
    SUM(t.monto) as total
FROM transacciones t
WHERE t.cuenta_id = 1
AND t.deleted_at IS NULL
GROUP BY DATE(t.fecha), t.tipo
ORDER BY fecha;
```

---

## 🔄 Migraciones

### Archivo de Migración Típico

```php
// database/migrations/2025_11_14_191457_create_proyectos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('moneda', 3)->default('COP');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('deleted_at');
        });
    }

    public function down(): void {
        Schema::dropIfExists('proyectos');
    }
};
```

### Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones pendientes
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Resetear BD (drop + migrate)
php artisan migrate:reset

# Migrar + seed
php artisan migrate:fresh --seed
```

---

## 🔒 Integridad de Datos

### Foreign Keys

Todas las claves foráneas tienen:
- `ON DELETE CASCADE` - Eliminar registros relacionados
- `ON UPDATE CASCADE` - Actualizar referencias

### Validaciones en Nivel de BD

```sql
-- Email único
ALTER TABLE users 
ADD CONSTRAINT unique_email UNIQUE (email);

-- Moneda válida (CHECK constraint)
ALTER TABLE proyectos 
ADD CONSTRAINT check_moneda 
CHECK (LENGTH(moneda) = 3);

-- Monto positivo (CHECK constraint)
ALTER TABLE transacciones 
ADD CONSTRAINT check_monto 
CHECK (monto > 0);
```

### Soft Deletes

Registros no se eliminan, se marca con `deleted_at`:

```php
// Query normal (excluye soft deleted)
$activos = Proyecto::all();

// Incluir soft deleted
$todos = Proyecto::withTrashed()->get();

// Solo soft deleted
$eliminados = Proyecto::onlyTrashed()->get();

// Restaurar
$proyecto->restore();

// Eliminar permanentemente
$proyecto->forceDelete();
```

---

**Última actualización**: 15 de noviembre de 2025
