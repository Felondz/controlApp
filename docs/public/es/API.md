# 🔌 API de ControlApp (Pública)

ControlApp expone una API RESTful para interactuar con el sistema. Esta guía cubre los principios generales de uso.

## Autenticación
Todas las peticiones a la API deben estar autenticadas mediante **Laravel Sanctum**.

- **Método**: Bearer Token
- **Header**: `Authorization: Bearer <tu-token>`

### Obtención de Token
Los tokens se pueden generar desde la configuración de perfil del usuario en la aplicación web o mediante el endpoint de login (solo para clientes móviles oficiales).

## Estándares de Respuesta
La API utiliza respuestas JSON estandarizadas.

### Éxito (200 OK)
```json
{
    "data": {
        "id": 1,
        "name": "Proyecto Alpha"
    },
    "message": "Operación exitosa"
}
```

### Error (4xx / 5xx)
```json
{
    "message": "Mensaje de error descriptivo",
    "errors": {
        "field_name": ["Detalle del error de validación"]
    }
}
```

## Rate Limiting
Para proteger el sistema, la API implementa límites de velocidad.
- **General**: 60 peticiones por minuto por usuario.


## Herramientas

### Calculadora Financiera
Calcula proyecciones de crédito, incluyendo cuotas mensuales, intereses y tabla de amortización.

- **Endpoint**: `POST /api/tools/calculator/calculate`
- **Auth**: Requerida

#### Request Body
```json
{
    "amount": 10000000,       // Monto del préstamo (numérico, > 0)
    "rate": 12.5,             // Tasa de interés (numérico, > 0)
    "term": 12,               // Plazo (entero, > 0)
    "termType": "months",     // "months" o "years"
    "rateType": "EA",         // "EA" (Efectiva Anual), "NAMV", "PM"
    "insurance": 5000         // Opcional: Costo mensual de seguro
}
```

#### Response (200 OK)
```json
{
    "monthlyPayment": 890000.50,
    "principalAmount": 10000000,
    "totalInterest": 680000.00,
    "totalPayment": 10680000.00,
    "schedule": [
        {
            "month": 1,
            "payment": 890000.50,
            "interest": 100000.00,
            "principal": 790000.50,
            "balance": 9209999.50
        },
        // ... más filas
    ],
    "inputs": { ... }
}
```

---

## Finanzas

### Gestión de Cuentas

#### Eliminar Cuenta de Proyecto
Elimina permanentemente una cuenta que pertenece a un proyecto, incluyendo todas sus transacciones asociadas.

- **Endpoint**: `DELETE /mis-proyectos/{proyecto}/accounts/{account}`
- **Auth**: Requerida (Admin del proyecto)
- **Route Name**: `finance.accounts.destroy`

**Parámetros de Ruta:**
- `proyecto` (integer): ID del proyecto
- `account` (integer): ID de la cuenta a eliminar

**Validaciones:**
- El usuario debe ser administrador del proyecto
- La cuenta debe pertenecer al proyecto (verificación de `propietario_type` y `propietario_id`)
- Se eliminan automáticamente todas las transacciones asociadas antes de eliminar la cuenta

**Response (302 Redirect):**
```
Redirect back con mensaje de éxito o error
```

**Errores Comunes:**
- `403 Forbidden`: Usuario no es admin o cuenta no pertenece al proyecto
- `404 Not Found`: Cuenta no encontrada
- `500 Server Error`: Error al eliminar (ej: restricciones de base de datos)

---

#### Desvincular Cuenta Compartida
Desvincula una cuenta personal que ha sido compartida con un proyecto, sin eliminarla.

- **Endpoint**: `DELETE /mis-proyectos/{proyecto}/accounts/{account}/unlink`
- **Auth**: Requerida (Admin del proyecto)
- **Route Name**: `finance.accounts.unlink`

**Parámetros de Ruta:**
- `proyecto` (integer): ID del proyecto
- `account` (integer): ID de la cuenta a desvincular

**Validaciones:**
- El usuario debe ser administrador del proyecto
- La cuenta debe estar vinculada al proyecto (relación `cuentasAsociadas`)

**Response (302 Redirect):**
```
Redirect back con mensaje de éxito
```

**Nota:** Esta operación solo elimina la relación entre el proyecto y la cuenta, no elimina la cuenta ni sus transacciones.

---

## Tipos de Cuenta Soportados

El sistema soporta los siguientes tipos de cuenta con sus campos específicos:

### 1. Efectivo (`efectivo`)
- `balance`: Saldo actual

### 2. Cuenta Bancaria (`banco`)
- `balance`: Saldo actual
- `banco`: Nombre del banco
- `es_nomina`: Indica si es cuenta de nómina (boolean)
- `dia_nomina`: Array de días de pago de nómina (ej: `[15, 30]` para quincenal)
- `valor_nomina`: Valor estimado de la nómina

### 3. Tarjeta de Crédito (`credito`)
- `balance`: Saldo actual (negativo)
- `banco`: Entidad emisora
- `cupo`: Límite de crédito
- `fecha_vencimiento`: Fecha de pago mensual
- `tasa_interes`: Tasa de interés (%)

### 4. Préstamo (`prestamo`)
- `balance`: Saldo pendiente
- `banco`: Entidad prestamista
- `cupo`: Monto total del préstamo
- `plazo`: Plazo en meses
- `valor_cuota`: Valor de la cuota mensual
- `cuotas_pagadas`: Número de cuotas pagadas
- `tasa_interes`: Tasa de interés (%)
- `fecha_vencimiento`: Fecha de pago mensual

### 5. Inversión (`inversion`)
- `balance`: Valor actual de la inversión
- `banco`: Entidad donde se invierte
- `tasa_interes`: Rendimiento esperado (%)
- `fecha_vencimiento`: Fecha de vencimiento (opcional)

### 6. Otro (`otro`)
- `balance`: Saldo actual
- Campos personalizables según necesidad
