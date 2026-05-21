# SSE.USO - Sistema de Servicio Social

Proyecto web con backend en Node.js/Express, frontend en React/Vite y base de datos MySQL.

## Requisitos

- Node.js
- MySQL Server
- MySQL Workbench opcional
- Git

## Instalación

1. Clonar el repositorio.
2. Crear la base de datos ejecutando `database.sql` en MySQL Workbench.
3. Crear el archivo `Backend/.env` usando como referencia `Backend/.env.example`.
4. Instalar dependencias del backend:

```bash
cd Backend
npm install
npm start
```

5. Instalar dependencias del frontend:

```bash
cd Frontend
npm install
npm run dev
```

El backend corre en `http://localhost:4000`.
El frontend normalmente corre en `http://localhost:5173`.

## Credenciales iniciales

Administrador:

```text
admin@usonsonate.edu.sv
2323
```

Estudiante de prueba:

```text
sd23i04002@usonsonate.edu.sv
5678
```

## Notas

- No subir `Backend/.env` a Git.
- No subir `node_modules`.
- Cada compañero debe crear su propio `.env` con su usuario y contraseña de MySQL.
