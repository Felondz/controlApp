# 📘 ControlApp - Public Documentation

Welcome to the **ControlApp** public documentation. Here you will find essential information to understand, install, and contribute to the project.

## 🚀 Overview
ControlApp is a comprehensive platform for collaborative project management and financial control. Our mission is to simplify resource and task management in a visually appealing and user-friendly environment.

> **Security Note**: For security reasons, the complete and detailed technical documentation (including database schemas and internal endpoints) is restricted and only shared with verified project collaborators. This public documentation contains only essential and safe information.

### Key Features
- **Project Management**: Create, organize, and monitor unlimited projects.
- **Financial Control**: Record income, expenses, and view real-time balances.
- **Collaboration**: Work as a team with granular roles and permissions.
- **Premium Design**: Modern, responsive interface with dark mode support.

## 🛠️ Quick Installation
The project uses **Laravel Sail** (Docker) for a standardized development environment.

### Requirements
- Docker Desktop
- WSL2 (on Windows)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-user/controlApp.git
   cd controlApp
   ```

2. **Start the environment**:
   ```bash
   ./vendor/bin/sail up -d
   ```

3. **Install dependencies**:
   ```bash
   ./vendor/bin/sail composer install
   ./vendor/bin/sail npm install && ./vendor/bin/sail npm run dev
   ```

4. **Setup database**:
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

Ready! Access `http://localhost`.

## 📄 License
This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


