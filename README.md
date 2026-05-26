# SSE.USO - Sistema de Servicio Social Estudiantil

Proyecto web para administrar ofertas, inscripciones, horas acreditadas y constancias de servicio social.

## Tecnologias

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: MySQL
- Subida de imagenes: Multer

## Requisitos

- Node.js instalado
- MySQL Server activo
- MySQL Workbench, opcional pero recomendado
- Git

## Instalacion inicial

1. Clonar el repositorio.

2. Crear la base de datos ejecutando el archivo:

```text
database.sql
```

Ese script crea la base `SistemaServicioSocial`, las tablas y los datos de prueba.

3. Crear el archivo `Backend/.env` tomando como referencia:

```text
Backend/.env.example
```

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=SistemaServicioSocial
JWT_SECRET=cambia_este_secreto
PORT=4000
```

Cada persona debe cambiar `DB_USER` y `DB_PASSWORD` segun su MySQL local.

## Levantar backend

Abrir una terminal:

```powershell
cd Backend
npm install
npm start
```

El backend debe quedar en:

```text
http://localhost:4000
```

Prueba rapida:

```text
http://localhost:4000/api/health
```

Debe responder:

```json
{ "ok": true }
```

## Levantar frontend

Abrir otra terminal:

```powershell
cd Frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

Abrir en el navegador:

```text
http://localhost:5174/
```

## Credenciales de prueba

Administrador:

```text
admin@usonsonate.edu.sv
2323
```

Estudiante:

```text
sd23i04002@usonsonate.edu.sv
5678
```

## Imagenes de ofertas

El administrador puede crear o editar ofertas y agregar imagenes de dos formas:

- Subir una imagen desde su computadora.
- Pegar una URL de imagen.

Las imagenes subidas desde la computadora se guardan en:

```text
Backend/uploads/ofertas/
```

El limite maximo por imagen es de 5 MB.

Si se comparte el proyecto con ofertas que usan imagenes locales subidas, tambien se debe compartir la carpeta `Backend/uploads/ofertas/` para que esas imagenes se sigan viendo.

## Base de datos

El archivo `database.sql` incluye la estructura actual del proyecto, incluyendo:

- facultades
- carreras
- usuarios
- ofertas
- inscripciones
- horas acreditadas por oferta
- horas manuales
- fechas y horas de inicio/finalizacion de ofertas

Si un companero quiere tener exactamente los mismos datos de prueba, debe ejecutar `database.sql` completo.

## Notas importantes

- No subir `Backend/.env` a Git.
- No subir `node_modules`.
- Si se agregan nuevas dependencias, los demas deben ejecutar `npm install`.
- El frontend esta pensado para usarse en `http://localhost:5174/`.
- El backend debe estar corriendo antes de iniciar sesion o cargar datos.

