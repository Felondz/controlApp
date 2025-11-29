# 🔒 Configuración de Documentación Privada

Esta carpeta (`docs/private`) contiene información sensible del proyecto y **NO** debe ser subida al repositorio público.

## Estrategia de Seguridad
Para mantener esta información segura pero accesible a los colaboradores, utilizamos un repositorio privado separado.

### Instrucciones para Colaboradores

1.  **Clonar el Repositorio Principal**:
    ```bash
    git clone https://github.com/tu-usuario/controlApp.git
    cd controlApp
    ```

2.  **Clonar la Documentación Privada**:
    Solicita acceso al repositorio de documentación (`controlApp-docs`) y clónalo dentro de la carpeta `docs/private`:
    ```bash
    # Asegúrate de que la carpeta docs/private esté vacía o no exista (git la ignorará)
    git clone https://github.com/tu-usuario/controlApp-docs.git docs/private
    ```

3.  **Trabajar**:
    - Los cambios en el código van al repo principal (`origin`).
    - Los cambios en la documentación privada van al repo de docs (`origin` dentro de `docs/private`).

> **Nota**: El archivo `.gitignore` del proyecto principal ya incluye `/docs/private`, por lo que no hay riesgo de subir estos archivos por accidente.
