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


