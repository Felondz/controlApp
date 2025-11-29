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
