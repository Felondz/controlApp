# Documentación Frontend

## Componentes Reutilizables

### Alert
Componente para mostrar mensajes de estado (información, advertencia, éxito, error) con estilos estandarizados.

**Uso:**
```jsx
import Alert from '@/Components/Alert';

<Alert type="info" title="Nota">
    Este es un mensaje informativo.
</Alert>
```

**Props:**
- `type`: 'info' (azul), 'warning' (ámbar), 'success' (verde), 'error' (rojo). Default: 'info'.
- `title`: Título opcional en negrita.
- `children`: Contenido del mensaje.
- `className`: Clases CSS adicionales.

**Ubicación:** `resources/js/Components/Alert.jsx`

## Iconos
Se utiliza una estrategia híbrida de iconos SVG reutilizables y Heroicons.
- **Ubicación:** `resources/js/Components/Icons.jsx`
- **Nuevos Iconos:** `InfoIcon`, `BookOpenIcon`, `CodeIcon`.

## Tema y Colores
El sistema utiliza Tailwind CSS con variables CSS para el soporte de temas dinámicos.
- **Primario**: Definido por el tema seleccionado (púrpura, azul, verde, etc.).
- **Secundario**: `colors.gray` para mantener el modo oscuro elegante y neutro.
- **Info**: `colors.blue` para elementos informativos y técnicos (ej. tarjeta de desarrollador).
