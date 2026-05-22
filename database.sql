-- =========================================
-- SISTEMA DE SERVICIO SOCIAL - SSE.USO
-- Script completo para crear la base y cargar datos de prueba
-- Generado desde la base local actual para compartir con el equipo.
-- =========================================

CREATE DATABASE IF NOT EXISTS SistemaServicioSocial
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE SistemaServicioSocial;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS ofertas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS carreras;
DROP TABLE IF EXISTS facultades;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================
-- 1. TABLAS
-- =========================================

CREATE TABLE facultades (
    id_facultad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_facultad VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    id_facultad INT,
    FOREIGN KEY (id_facultad)
        REFERENCES facultades(id_facultad)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo_institucional VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'admin') DEFAULT 'estudiante',
    materias_aprobadas INT DEFAULT 0,
    horas_manuales INT DEFAULT 0,
    fecha_horas_manuales TIMESTAMP NULL,
    id_carrera INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrera)
        REFERENCES carreras(id_carrera)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ofertas (
    id_oferta INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255),
    horario VARCHAR(100),
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    hora_inicio TIME NULL,
    hora_fin TIME NULL,
    horas_acreditar INT NOT NULL,
    imagen_url VARCHAR(255),
    cupo_maximo INT NOT NULL,
    cupo_actual INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    id_carrera INT,
    id_admin_creador INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrera)
        REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_admin_creador)
        REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inscripciones (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT,
    id_oferta INT,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aceptado', 'finalizado', 'rechazado') DEFAULT 'pendiente',
    horas_acreditadas INT NULL,
    fecha_acreditacion TIMESTAMP NULL,
    FOREIGN KEY (id_estudiante)
        REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_oferta)
        REFERENCES ofertas(id_oferta),
    UNIQUE(id_estudiante, id_oferta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 2. FACULTADES
-- =========================================

INSERT INTO facultades (id_facultad, nombre_facultad, created_at) VALUES
(1, 'Ciencias Jurídicas', '2026-05-05 18:53:26'),
(2, 'Economía y Ciencias Sociales', '2026-05-05 18:53:26'),
(3, 'Ingeniería y Ciencias Naturales', '2026-05-05 18:53:26'),
(4, 'Ciencias de la Salud', '2026-05-05 18:53:26');

-- =========================================
-- 3. CARRERAS
-- =========================================

INSERT INTO carreras (id_carrera, nombre_carrera, id_facultad) VALUES
(1, 'Licenciatura en Ciencias Juridicas', 1),
(2, 'Licenciatura en Administración de Empresas', 2),
(3, 'Licenciatura en Mercadeo', 2),
(4, 'Licenciatura en Contaduría Pública', 2),
(5, 'Ingeniería Eléctrica', 3),
(6, 'Ingeniería Industrial', 3),
(7, 'Ingeniería en Sistemas Computacionales', 3),
(8, 'Ingeniería en Agronegocios', 3),
(9, 'Técnico en Logística y Aduanas', 3),
(10, 'Licenciatura en Psicología', 4),
(11, 'Técnico en Enfermería', 4);

-- =========================================
-- 4. USUARIOS
--    Credenciales de prueba:
--    Admin: admin@usonsonate.edu.sv / 2323
--    Estudiantes: usar el correo mostrado / 5678, salvo Usuario de Prueba y Jason con 12345.
-- =========================================

INSERT INTO usuarios
(id_usuario, nombre_completo, correo_institucional, password_hash, rol, materias_aprobadas, horas_manuales, fecha_horas_manuales, id_carrera, created_at)
VALUES
(1, 'Administrador Académico', 'admin@usonsonate.edu.sv', '2323', 'admin', 0, 0, NULL, NULL, '2026-05-05 18:53:26'),
(2, 'Brayan Francisco Sion Dimas', 'sd23i04002@usonsonate.edu.sv', '5678', 'estudiante', 30, 350, '2026-05-21 16:44:12', 7, '2026-05-05 18:53:26'),
(3, 'Jorge Leonardo Cruz Escobar', 'ce25d01005@usonsonate.edu.sv', '5678', 'estudiante', 20, 0, NULL, 1, '2026-05-05 18:53:26'),
(4, 'Sofia Fernanda Tulipan Gallardo', 'tg22d01001@usonsonate.edu.sv', '5678', 'estudiante', 30, 0, NULL, 1, '2026-05-05 18:53:26'),
(5, 'Usuario de Prueba', 'prueba_social@usonsonate.edu.sv', '12345', 'estudiante', 0, 0, NULL, 7, '2026-05-06 17:27:38'),
(6, 'Jason Ernesto Benitez Lopez', 'benitezjason53@gmail.com', '12345', 'estudiante', 0, 500, '2026-05-21 16:44:12', 7, '2026-05-06 19:13:30'),
(7, 'Carlos Eduardo Mendoza Rivas', 'mr23i04005@usonsonate.edu.sv', '5678', 'estudiante', 32, 0, NULL, 7, '2026-05-20 17:28:47'),
(8, 'Gabriela María Fuentes Amaya', 'fa22i04012@usonsonate.edu.sv', '5678', 'estudiante', 35, 0, NULL, 7, '2026-05-20 17:28:47'),
(9, 'Kevin Alexander Orellana Henríquez', 'oh23i04018@usonsonate.edu.sv', '5678', 'estudiante', 30, 0, NULL, 7, '2026-05-20 17:28:47'),
(10, 'Daniela Alexandra Martínez Lemus', 'ml22i04025@usonsonate.edu.sv', '5678', 'estudiante', 33, 0, NULL, 7, '2026-05-20 18:20:53'),
(11, 'Rodrigo Josué Castaneda Ramos', 'cr23i04009@usonsonate.edu.sv', '5678', 'estudiante', 31, 0, NULL, 7, '2026-05-20 18:20:53'),
(12, 'Vanessa Beatriz Guardado Melgar', 'gm22i04031@usonsonate.edu.sv', '5678', 'estudiante', 36, 0, NULL, 7, '2026-05-20 18:20:53'),
(13, 'Carlos Alberto Henríquez Interiano', 'hi22d01015@usonsonate.edu.sv', '5678', 'estudiante', 28, 0, NULL, 1, '2026-05-21 09:32:38'),
(14, 'Elena María Galdámez Quintanilla', 'gq23d01022@usonsonate.edu.sv', '5678', 'estudiante', 18, 0, NULL, 1, '2026-05-21 09:32:38'),
(15, 'Mauricio Ernesto Recinos Flores', 'rf24d01008@usonsonate.edu.sv', '5678', 'estudiante', 12, 0, NULL, 1, '2026-05-21 09:32:38'),
(16, 'Claudia Vanessa Batres Beltrán', 'bb22d02001@usonsonate.edu.sv', '5678', 'estudiante', 34, 0, NULL, 2, '2026-05-21 09:32:38'),
(17, 'Diego Alejandro Ortiz Zelaya', 'oz23d02014@usonsonate.edu.sv', '5678', 'estudiante', 22, 0, NULL, 2, '2026-05-21 09:32:38'),
(18, 'Josué Benjamín Alvarado Castro', 'ac24d02030@usonsonate.edu.sv', '5678', 'estudiante', 15, 0, NULL, 2, '2026-05-21 09:32:38'),
(19, 'Adriana Marcela Rodríguez Pineda', 'rp23d03005@usonsonate.edu.sv', '5678', 'estudiante', 25, 0, NULL, 3, '2026-05-21 09:32:38'),
(20, 'Bryan Esteven Cortez Portillo', 'cp22d03019@usonsonate.edu.sv', '5678', 'estudiante', 32, 0, NULL, 3, '2026-05-21 09:32:38'),
(21, 'Fátima Guadalupe Rivas Menjívar', 'rm24d03011@usonsonate.edu.sv', '5678', 'estudiante', 14, 0, NULL, 3, '2026-05-21 09:32:38'),
(22, 'Manuel de Jesús Góchez Aquino', 'ga22d04003@usonsonate.edu.sv', '5678', 'estudiante', 36, 0, NULL, 4, '2026-05-21 09:32:38'),
(23, 'Tania Gisela Renderos Orellana', 'ro23d04027@usonsonate.edu.sv', '5678', 'estudiante', 20, 0, NULL, 4, '2026-05-21 09:32:38'),
(24, 'Christian Vladimir Juárez Peña', 'jp24d04015@usonsonate.edu.sv', '5678', 'estudiante', 11, 0, NULL, 4, '2026-05-21 09:32:38'),
(25, 'Roberto Carlos Escalante Pleitez', 'ep22i02004@usonsonate.edu.sv', '5678', 'estudiante', 33, 0, NULL, 5, '2026-05-21 09:32:38'),
(26, 'Fernando José Molina Guardado', 'mg23i02011@usonsonate.edu.sv', '5678', 'estudiante', 24, 0, NULL, 5, '2026-05-21 09:32:38'),
(27, 'Néstor Iván Ramos Cea', 'rc24i02019@usonsonate.edu.sv', '5678', 'estudiante', 13, 0, NULL, 5, '2026-05-21 09:32:38'),
(28, 'Mónica Beatriz Solís Valle', 'sv22i03002@usonsonate.edu.sv', '5678', 'estudiante', 38, 0, NULL, 6, '2026-05-21 09:32:38'),
(29, 'Walter Alexander Melgar Girón', 'mg23i03041@usonsonate.edu.sv', '5678', 'estudiante', 21, 0, NULL, 6, '2026-05-21 09:32:38'),
(30, 'Rebeca Abigail Castaneda Cruz', 'cc24i03015@usonsonate.edu.sv', '5678', 'estudiante', 16, 0, NULL, 6, '2026-05-21 09:32:38'),
(31, 'Rodrigo Antonio Calderón Milla', 'cm23i05003@usonsonate.edu.sv', '5678', 'estudiante', 26, 0, NULL, 8, '2026-05-21 09:32:38'),
(32, 'Gisselle Alejandra Peña Durán', 'pd22i05009@usonsonate.edu.sv', '5678', 'estudiante', 35, 0, NULL, 8, '2026-05-21 09:32:38'),
(33, 'Juan Francisco Lemus Sibrián', 'ls24i05012@usonsonate.edu.sv', '5678', 'estudiante', 10, 0, NULL, 8, '2026-05-21 09:32:38'),
(34, 'William Oswaldo Tobar Rosales', 'tr24d06002@usonsonate.edu.sv', '5678', 'estudiante', 18, 0, NULL, 9, '2026-05-21 09:32:38'),
(35, 'Ingrid Sarai Gutiérrez Mancía', 'gm25d06014@usonsonate.edu.sv', '5678', 'estudiante', 8, 0, NULL, 9, '2026-05-21 09:32:38'),
(36, 'Kevin Edgardo Guillén Mezquita', 'gm24d06021@usonsonate.edu.sv', '5678', 'estudiante', 15, 0, NULL, 9, '2026-05-21 09:32:38'),
(37, 'Gabriela Elizabeth Coreas Campos', 'cc22d05033@usonsonate.edu.sv', '5678', 'estudiante', 31, 0, NULL, 10, '2026-05-21 09:32:38'),
(38, 'Nelson Edgardo Huezo Mixco', 'hm23d05004@usonsonate.edu.sv', '5678', 'estudiante', 23, 0, NULL, 10, '2026-05-21 09:32:38'),
(39, 'Paola Michelle Zepeda Velásquez', 'zv24d05018@usonsonate.edu.sv', '5678', 'estudiante', 12, 0, NULL, 10, '2026-05-21 09:32:38'),
(40, 'Marielos del Carmen Ávalos Rivera', 'ar24d07005@usonsonate.edu.sv', '5678', 'estudiante', 19, 0, NULL, 11, '2026-05-21 09:32:38'),
(41, 'Jonathan Isaac Pinto Beltrán', 'pb25d07042@usonsonate.edu.sv', '5678', 'estudiante', 7, 0, NULL, 11, '2026-05-21 09:32:38'),
(42, 'Fátima María Calles Vásquez', 'cv24d07011@usonsonate.edu.sv', '5678', 'estudiante', 16, 0, NULL, 11, '2026-05-21 09:32:38'),
(43, 'José Alejandro Quintanilla Guardado', 'qg22d01041@usonsonate.edu.sv', '5678', 'estudiante', 33, 0, NULL, 1, '2026-05-21 11:19:05'),
(44, 'Fátima Alexandra Monterrosa Chachagua', 'mc25d01053@usonsonate.edu.sv', '5678', 'estudiante', 10, 0, NULL, 1, '2026-05-21 11:20:15'),
(45, 'Marvin Josué Castaneda Lemus', 'cl22d01060@usonsonate.edu.sv', '5678', 'estudiante', 35, 0, NULL, 1, '2026-05-22 11:08:56');

-- =========================================
-- 5. OFERTAS
-- =========================================

INSERT INTO ofertas
(id_oferta, titulo, descripcion, ubicacion, horario, fecha_inicio, fecha_fin, hora_inicio, hora_fin, horas_acreditar, imagen_url, cupo_maximo, cupo_actual, activo, id_carrera, id_admin_creador, created_at)
VALUES
(1, 'Desarrollo de Software Interno', 'Apoyo en el área de TI de la universidad.', 'Campus Central', 'Lunes a Viernes', NULL, NULL, NULL, NULL, 150, 'https://pbs.twimg.com/media/E9PzQUWXsAIiLZw.jpg', 5, 5, TRUE, 7, 1, '2026-05-05 18:53:26'),
(2, 'Asesoría Legal Comunitaria', 'Prácticas jurídicas en clínicas legales.', 'Centro Judicial', 'Mañana', NULL, NULL, NULL, NULL, 120, 'https://admin.usonsonate.edu.sv/uploads/auditorio_pag_web_70171eab44.jpg', 5, 5, TRUE, 1, 1, '2026-05-05 18:53:26'),
(3, 'Apoyo en Alcaldia Sonsonate Centro', 'Alcaldia deSonsonate Centro requiere apoyo en el area de electricidad', 'Alcaldia Sonsonate Centro', 'Lunes a Miercoles', NULL, NULL, NULL, NULL, 50, NULL, 3, 0, TRUE, 5, 1, '2026-05-21 12:01:35'),
(4, 'Apoyo en CITAM', 'Se requiere apoyo en CITAM las actividades a realizar son:
Corte de café y eliminacion de malesa en los cultivos.

Se requiere pago de $2 para el transporte favor de cancelar en Contabilidad', 'CITAM', 'Lunes a Viernes', NULL, NULL, NULL, NULL, 150, NULL, 10, 0, TRUE, 8, 1, '2026-05-21 12:15:21'),
(5, 'Apoyo en Desarrollo de una Aplicacion', 'La Universidad de Sonsonate, requiere apoyo para el desarrollo de una aplicacion web de inventario', 'Universidad de Sonsonate', 'Lunes a Viernes', NULL, NULL, NULL, NULL, 250, NULL, 5, 0, TRUE, 7, 1, '2026-05-22 10:05:28'),
(6, 'Apoyo En Asesoria Legal', 'La Universidad de Sonsonaterequiere apoyo', 'Universidad de Sonsonate', NULL, '2026-05-25', '2026-05-29', '08:30:00', '15:45:00', 150, NULL, 5, 0, TRUE, 1, 1, '2026-05-22 11:05:00'),
(7, 'Bla bla ble ble', 'sgffhdhgd', 'Universidad de Sonsonate', NULL, NULL, NULL, NULL, NULL, 150, NULL, 5, 1, FALSE, NULL, 1, '2026-05-22 11:37:39'),
(8, 'hgjhkbkjk', 'kjbkjbjn,', 'jnmnmnm', NULL, '2026-09-23', '2026-09-26', '07:00:00', '12:00:00', 150, NULL, 5, 1, TRUE, NULL, 1, '2026-05-22 12:01:28');

-- =========================================
-- 6. INSCRIPCIONES Y ESTADOS
-- =========================================

INSERT INTO inscripciones
(id_inscripcion, id_estudiante, id_oferta, fecha_inscripcion, estado, horas_acreditadas, fecha_acreditacion)
VALUES
(1, 2, 1, '2026-05-07 15:32:28', 'finalizado', 150, '2026-05-07 15:32:28'),
(5, 7, 1, '2026-05-20 18:02:53', 'finalizado', 100, '2026-05-20 18:02:53'),
(6, 8, 1, '2026-05-20 18:07:30', 'finalizado', NULL, '2026-05-20 18:07:30'),
(7, 9, 1, '2026-05-20 18:19:29', 'finalizado', 20, '2026-05-20 18:19:29'),
(8, 10, 1, '2026-05-20 18:32:51', 'aceptado', NULL, NULL),
(9, 4, 2, '2026-05-21 09:54:28', 'pendiente', NULL, NULL),
(10, 3, 2, '2026-05-21 09:58:29', 'pendiente', NULL, NULL),
(14, 14, 2, '2026-05-21 10:55:53', 'aceptado', NULL, NULL),
(15, 15, 2, '2026-05-21 10:59:15', 'rechazado', NULL, NULL),
(17, 43, 2, '2026-05-21 11:29:29', 'aceptado', NULL, NULL),
(20, 45, 6, '2026-05-22 11:14:13', 'rechazado', NULL, NULL),
(22, 45, 2, '2026-05-22 11:27:04', 'aceptado', NULL, NULL),
(23, 45, 7, '2026-05-22 11:38:16', 'finalizado', NULL, '2026-05-22 11:39:01'),
(24, 45, 8, '2026-05-22 12:01:41', 'finalizado', 150, '2026-05-22 12:10:30');

-- =========================================
-- 7. AJUSTE DE AUTO_INCREMENT
-- =========================================

ALTER TABLE facultades AUTO_INCREMENT = 5;
ALTER TABLE carreras AUTO_INCREMENT = 12;
ALTER TABLE usuarios AUTO_INCREMENT = 46;
ALTER TABLE ofertas AUTO_INCREMENT = 9;
ALTER TABLE inscripciones AUTO_INCREMENT = 25;

-- =========================================
-- 8. USUARIO MYSQL OPCIONAL
--    Ejecutar solo si desean crear un usuario local alternativo.
-- =========================================

-- CREATE USER IF NOT EXISTS 'usuario_ss'@'localhost' IDENTIFIED BY '1234';
-- GRANT ALL PRIVILEGES ON SistemaServicioSocial.* TO 'usuario_ss'@'localhost';
-- FLUSH PRIVILEGES;

-- Consulta rapida de prueba:
-- SELECT * FROM ofertas;
