# 📘 ControlApp - Documentación Pública

Bienvenido a la documentación pública de **ControlApp**. Aquí encontrarás la información esencial para entender, instalar y contribuir al proyecto.

## 🚀 Visión General
ControlApp es una plataforma integral para la gestión de proyectos colaborativos y control financiero. Nuestra misión es simplificar la administración de recursos y tareas en un entorno visualmente atractivo y fácil de usar.

> **Nota de Seguridad**: Por motivos de seguridad, la documentación técnica completa y detallada (incluyendo esquemas de base de datos y endpoints internos) está restringida y solo se comparte con colaboradores verificados del proyecto. Esta documentación pública contiene únicamente la información esencial y segura.

### Características Principales
- **Gestión de Proyectos**: Crea, organiza y supervisa proyectos ilimitados.
- **Control Financiero**: Registra ingresos, gastos y visualiza balances en tiempo real.
- **Colaboración**: Trabaja en equipo con roles y permisos granulares.
- **Diseño Premium**: Interfaz moderna, responsiva y con soporte para modo oscuro.

## 🛠️ Instalación Rápida
El proyecto utiliza **Laravel Sail** (Docker) para un entorno de desarrollo estandarizado.

### Requisitos
- Docker Desktop
- WSL2 (en Windows)

### Pasos
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/controlApp.git
   cd controlApp
   ```

2. **Iniciar el entorno**:
   ```bash
   ./vendor/bin/sail up -d
   ```

3. **Instalar dependencias**:
   ```bash
   ./vendor/bin/sail composer install
   ./vendor/bin/sail npm install && ./vendor/bin/sail npm run dev
   ```

4. **Configurar base de datos**:
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

¡Listo! Accede a `http://localhost`.

## 📄 Licencia
Este proyecto es software de código abierto licenciado bajo la [MIT license](https://opensource.org/licenses/MIT).


