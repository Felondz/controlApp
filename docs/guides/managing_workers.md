# Guía de Gestión de Workers (Docker & Supervisor)

## 1. Concepto Clave
En tu arquitectura **Dockerizada** (visto en `docker-compose.prod.yml`), lo ideal no es instalar Supervisor manualmente en el servidor host, sino manejar los workers como **Contenedores de Docker**.

Esto significa que tendrás:
*   Un contenedor `app` (Tu sitio web, Apache/PHP).
*   Un contenedor `worker` (Tu "cocinero", corriendo `queue:work`).

Esto permite escalar: si necesitas más cocineros, solo subes más réplicas del contenedor `worker`.

---

## 2. Configuración Implementada (Docker Compose)

Se ha agregado el servicio `worker` a tu archivo `docker-compose.prod.yml`.

```yaml
  worker:
    image: ghcr.io/felondz/controlapp:latest
    command: php artisan queue:work redis ...
    deploy:
      replicas: 2 
```

### ¿Por qué 2 Workers?
Para una arquitectura asíncrona robusta, recomendamos iniciar con **2 workers**:
1.  **Concurrencia:** Si llega tarea pesada (ej. generar un PDF o reporte), un worker se ocupa de ella mientras el segundo sigue procesando los mensajes de chat instantáneos. Evita "trancones" en el chat.
2.  **Redundancia:** Si un proceso worker falla o se reinicia por límite de memoria, el otro sigue trabajando.

---

## 3. Comandos de Gestión (Docker)

| Acción | Comando |
| :--- | :--- |
| **Ver Logs** | `docker compose logs -f worker` (Verás logs de ambas réplicas entremezclados) |
| **Escalar Manualmente** | `docker compose up -d --scale worker=4` (Si el tráfico aumenta explosivamente) |
| **Reiniciar** | `docker compose restart worker` |

## 4. Integración CI/CD (`deploy.yml`)

Tu pipeline de despliegue (`deploy.yml`) ya está configurado correctamente.
Al hacer un deploy:
1.  Se descarga la nueva imagen.
2.  `docker compose up -d` detectará los nuevos contenedores `worker` y los levantará.
3.  El comando `php artisan queue:restart` (línea 154 de deploy.yml) enviará una señal a los workers para que recarguen la memoria.
