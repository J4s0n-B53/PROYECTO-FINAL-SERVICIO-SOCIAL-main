-- Base de presentacion del Sistema de Servicio Social Estudiantil
-- Generado desde la base local SistemaServicioSocial el 2026-05-28 21:27:52
-- Incluye 5 facultades, 13 carreras, administrador, 5 estudiantes por carrera y ofertas realistas de presentacion.
-- Por cada carrera hay 2 estudiantes no aptos (<30 materias) y 3 aptos (>=30 materias).
-- Las contrasenas se almacenan con hash bcrypt.
-- No incluye inscripciones ni horas acreditadas para permitir pruebas nuevas.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `SistemaServicioSocial`;
CREATE DATABASE `SistemaServicioSocial` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `SistemaServicioSocial`;

-- =========================================
-- 0. ESTRUCTURA DE TABLAS
-- =========================================

DROP TABLE IF EXISTS `facultades`;
CREATE TABLE `facultades` (
  `id_facultad` int NOT NULL AUTO_INCREMENT,
  `nombre_facultad` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_facultad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `carreras`;
CREATE TABLE `carreras` (
  `id_carrera` int NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(100) NOT NULL,
  `id_facultad` int DEFAULT NULL,
  PRIMARY KEY (`id_carrera`),
  KEY `id_facultad` (`id_facultad`),
  CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`id_facultad`) REFERENCES `facultades` (`id_facultad`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `correo_institucional` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('estudiante','admin') DEFAULT 'estudiante',
  `materias_aprobadas` int DEFAULT '0',
  `id_carrera` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `horas_manuales` int DEFAULT '0',
  `fecha_horas_manuales` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo_institucional` (`correo_institucional`),
  KEY `id_carrera` (`id_carrera`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ofertas`;
CREATE TABLE `ofertas` (
  `id_oferta` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `horario` varchar(100) DEFAULT NULL,
  `horas_acreditar` int NOT NULL,
  `es_ambiental` tinyint(1) DEFAULT '0',
  `imagen_url` varchar(255) DEFAULT NULL,
  `cupo_maximo` int NOT NULL,
  `cupo_actual` int DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  `id_carrera` int DEFAULT NULL,
  `id_admin_creador` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  PRIMARY KEY (`id_oferta`),
  KEY `id_carrera` (`id_carrera`),
  KEY `id_admin_creador` (`id_admin_creador`),
  CONSTRAINT `ofertas_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`),
  CONSTRAINT `ofertas_ibfk_2` FOREIGN KEY (`id_admin_creador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `inscripciones`;
CREATE TABLE `inscripciones` (
  `id_inscripcion` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int DEFAULT NULL,
  `id_oferta` int DEFAULT NULL,
  `fecha_inscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','aceptado','finalizado','rechazado') DEFAULT 'pendiente',
  `horas_acreditadas` int DEFAULT NULL,
  `fecha_acreditacion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_inscripcion`),
  UNIQUE KEY `id_estudiante` (`id_estudiante`,`id_oferta`),
  KEY `id_oferta` (`id_oferta`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id_oferta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `horas_manuales_acreditadas`;
CREATE TABLE `horas_manuales_acreditadas` (
  `id_hora_manual` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int NOT NULL,
  `horas` int NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'Acreditacion manual',
  `fecha_acreditacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_hora_manual`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `horas_manuales_acreditadas_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================
-- DATOS
-- =========================================


-- =========================================
-- 1. FACULTADES
-- =========================================

INSERT INTO `facultades` (`id_facultad`, `nombre_facultad`, `created_at`) VALUES
(1, 'Ciencias Jurídicas', '2026-05-05 18:53:26'),
(2, 'Economía y Ciencias Sociales', '2026-05-05 18:53:26'),
(3, 'Ingeniería y Ciencias Naturales', '2026-05-05 18:53:26'),
(4, 'Ciencias de la Salud', '2026-05-05 18:53:26'),
(5, 'Escuela de Educación', '2026-05-05 18:53:26');

-- =========================================
-- 2. CARRERAS
-- =========================================

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`, `id_facultad`) VALUES
(1, 'Licenciatura en Ciencias Jurídicas', 1),
(2, 'Licenciatura en Administración de Empresas', 2),
(3, 'Licenciatura en Mercadeo', 2),
(4, 'Licenciatura en Contaduría Pública', 2),
(5, 'Ingeniería Eléctrica', 3),
(6, 'Ingeniería Industrial', 3),
(7, 'Ingeniería en Sistemas Computacionales', 3),
(8, 'Ingeniería en Agronegocios', 3),
(9, 'Licenciatura en Psicología', 4),
(10, 'Licenciatura en Matemática', 5),
(11, 'Licenciatura en Ciencias Naturales', 5),
(12, 'Licenciatura en Lenguaje y Literatura', 5),
(13, 'Licenciatura en Educación Física, Deportes y Recreación', 5);

-- =========================================
-- 3. USUARIOS
-- =========================================

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(1, 'Administrador Académico', 'admin@usonsonate.edu.sv', '$2b$10$O7ZOu13jdI5fydPFhhqVC.om0kDbkN6x.19RoMcm8JKEI1F4pKRmO', 'admin', 0, NULL, '2026-05-05 18:53:26', 0, NULL),
(2, 'Andrea Sofia Martinez Lopez', 'cj2601001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 1, '2026-05-28 09:00:00', 0, NULL),
(3, 'Carlos Eduardo Ramirez Flores', 'cj2601002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 1, '2026-05-28 09:00:00', 0, NULL),
(4, 'Daniela Alejandra Torres Molina', 'cj2601003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 1, '2026-05-28 09:00:00', 0, NULL),
(5, 'Fernando Jose Aguilar Perez', 'cj2601004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 1, '2026-05-28 09:00:00', 0, NULL),
(6, 'Gabriela Maria Hernandez Cruz', 'cj2601005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 1, '2026-05-28 09:00:00', 0, NULL),
(7, 'Andrea Sofia Martinez Lopez', 'ad2602001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 2, '2026-05-28 09:00:00', 0, NULL),
(8, 'Carlos Eduardo Ramirez Flores', 'ad2602002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 2, '2026-05-28 09:00:00', 0, NULL),
(9, 'Daniela Alejandra Torres Molina', 'ad2602003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 2, '2026-05-28 09:00:00', 0, NULL),
(10, 'Fernando Jose Aguilar Perez', 'ad2602004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 2, '2026-05-28 09:00:00', 0, NULL),
(11, 'Gabriela Maria Hernandez Cruz', 'ad2602005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 2, '2026-05-28 09:00:00', 0, NULL),
(12, 'Andrea Sofia Martinez Lopez', 'me2603001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 3, '2026-05-28 09:00:00', 0, NULL),
(13, 'Carlos Eduardo Ramirez Flores', 'me2603002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 3, '2026-05-28 09:00:00', 0, NULL),
(14, 'Daniela Alejandra Torres Molina', 'me2603003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 3, '2026-05-28 09:00:00', 0, NULL),
(15, 'Fernando Jose Aguilar Perez', 'me2603004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 3, '2026-05-28 09:00:00', 0, NULL),
(16, 'Gabriela Maria Hernandez Cruz', 'me2603005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 3, '2026-05-28 09:00:00', 0, NULL),
(17, 'Andrea Sofia Martinez Lopez', 'cp2604001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 4, '2026-05-28 09:00:00', 0, NULL),
(18, 'Carlos Eduardo Ramirez Flores', 'cp2604002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 4, '2026-05-28 09:00:00', 0, NULL),
(19, 'Daniela Alejandra Torres Molina', 'cp2604003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 4, '2026-05-28 09:00:00', 0, NULL),
(20, 'Fernando Jose Aguilar Perez', 'cp2604004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 4, '2026-05-28 09:00:00', 0, NULL),
(21, 'Gabriela Maria Hernandez Cruz', 'cp2604005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 4, '2026-05-28 09:00:00', 0, NULL),
(22, 'Andrea Sofia Martinez Lopez', 'ie2605001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 5, '2026-05-28 09:00:00', 0, NULL),
(23, 'Carlos Eduardo Ramirez Flores', 'ie2605002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 5, '2026-05-28 09:00:00', 0, NULL),
(24, 'Daniela Alejandra Torres Molina', 'ie2605003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 5, '2026-05-28 09:00:00', 0, NULL),
(25, 'Fernando Jose Aguilar Perez', 'ie2605004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 5, '2026-05-28 09:00:00', 0, NULL),
(26, 'Gabriela Maria Hernandez Cruz', 'ie2605005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 5, '2026-05-28 09:00:00', 0, NULL),
(27, 'Andrea Sofia Martinez Lopez', 'ii2606001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 6, '2026-05-28 09:00:00', 0, NULL),
(28, 'Carlos Eduardo Ramirez Flores', 'ii2606002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 6, '2026-05-28 09:00:00', 0, NULL),
(29, 'Daniela Alejandra Torres Molina', 'ii2606003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 6, '2026-05-28 09:00:00', 0, NULL),
(30, 'Fernando Jose Aguilar Perez', 'ii2606004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 6, '2026-05-28 09:00:00', 0, NULL),
(31, 'Gabriela Maria Hernandez Cruz', 'ii2606005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 6, '2026-05-28 09:00:00', 0, NULL),
(32, 'Andrea Sofia Martinez Lopez', 'sc2607001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 7, '2026-05-28 09:00:00', 0, NULL),
(33, 'Carlos Eduardo Ramirez Flores', 'sc2607002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 7, '2026-05-28 09:00:00', 0, NULL),
(34, 'Daniela Alejandra Torres Molina', 'sc2607003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 7, '2026-05-28 09:00:00', 0, NULL),
(35, 'Fernando Jose Aguilar Perez', 'sc2607004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 7, '2026-05-28 09:00:00', 0, NULL),
(36, 'Gabriela Maria Hernandez Cruz', 'sc2607005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 7, '2026-05-28 09:00:00', 0, NULL),
(37, 'Andrea Sofia Martinez Lopez', 'ag2608001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 8, '2026-05-28 09:00:00', 0, NULL),
(38, 'Carlos Eduardo Ramirez Flores', 'ag2608002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 8, '2026-05-28 09:00:00', 0, NULL),
(39, 'Daniela Alejandra Torres Molina', 'ag2608003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 8, '2026-05-28 09:00:00', 0, NULL),
(40, 'Fernando Jose Aguilar Perez', 'ag2608004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 8, '2026-05-28 09:00:00', 0, NULL),
(41, 'Gabriela Maria Hernandez Cruz', 'ag2608005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 8, '2026-05-28 09:00:00', 0, NULL),
(42, 'Andrea Sofia Martinez Lopez', 'ps2609001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 9, '2026-05-28 09:00:00', 0, NULL),
(43, 'Carlos Eduardo Ramirez Flores', 'ps2609002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 9, '2026-05-28 09:00:00', 0, NULL),
(44, 'Daniela Alejandra Torres Molina', 'ps2609003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 9, '2026-05-28 09:00:00', 0, NULL),
(45, 'Fernando Jose Aguilar Perez', 'ps2609004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 9, '2026-05-28 09:00:00', 0, NULL),
(46, 'Gabriela Maria Hernandez Cruz', 'ps2609005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 9, '2026-05-28 09:00:00', 0, NULL),
(47, 'Andrea Sofia Martinez Lopez', 'ma2610001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 10, '2026-05-28 09:00:00', 0, NULL),
(48, 'Carlos Eduardo Ramirez Flores', 'ma2610002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 10, '2026-05-28 09:00:00', 0, NULL),
(49, 'Daniela Alejandra Torres Molina', 'ma2610003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 10, '2026-05-28 09:00:00', 0, NULL),
(50, 'Fernando Jose Aguilar Perez', 'ma2610004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 10, '2026-05-28 09:00:00', 0, NULL),
(51, 'Gabriela Maria Hernandez Cruz', 'ma2610005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 10, '2026-05-28 09:00:00', 0, NULL),
(52, 'Andrea Sofia Martinez Lopez', 'cn2611001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 11, '2026-05-28 09:00:00', 0, NULL),
(53, 'Carlos Eduardo Ramirez Flores', 'cn2611002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 11, '2026-05-28 09:00:00', 0, NULL),
(54, 'Daniela Alejandra Torres Molina', 'cn2611003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 11, '2026-05-28 09:00:00', 0, NULL),
(55, 'Fernando Jose Aguilar Perez', 'cn2611004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 11, '2026-05-28 09:00:00', 0, NULL),
(56, 'Gabriela Maria Hernandez Cruz', 'cn2611005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 11, '2026-05-28 09:00:00', 0, NULL),
(57, 'Andrea Sofia Martinez Lopez', 'll2612001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 12, '2026-05-28 09:00:00', 0, NULL),
(58, 'Carlos Eduardo Ramirez Flores', 'll2612002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 12, '2026-05-28 09:00:00', 0, NULL),
(59, 'Daniela Alejandra Torres Molina', 'll2612003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 12, '2026-05-28 09:00:00', 0, NULL),
(60, 'Fernando Jose Aguilar Perez', 'll2612004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 12, '2026-05-28 09:00:00', 0, NULL),
(61, 'Gabriela Maria Hernandez Cruz', 'll2612005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 12, '2026-05-28 09:00:00', 0, NULL),
(62, 'Andrea Sofia Martinez Lopez', 'ef2613001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 13, '2026-05-28 09:00:00', 0, NULL),
(63, 'Carlos Eduardo Ramirez Flores', 'ef2613002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 13, '2026-05-28 09:00:00', 0, NULL),
(64, 'Daniela Alejandra Torres Molina', 'ef2613003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 13, '2026-05-28 09:00:00', 0, NULL),
(65, 'Fernando Jose Aguilar Perez', 'ef2613004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 13, '2026-05-28 09:00:00', 0, NULL),
(66, 'Gabriela Maria Hernandez Cruz', 'ef2613005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 13, '2026-05-28 09:00:00', 0, NULL);

-- =========================================
-- 4. OFERTAS
-- =========================================

INSERT INTO `ofertas` (`id_oferta`, `titulo`, `descripcion`, `ubicacion`, `horario`, `horas_acreditar`, `es_ambiental`, `imagen_url`, `cupo_maximo`, `cupo_actual`, `activo`, `id_carrera`, `id_admin_creador`, `created_at`, `fecha_inicio`, `fecha_fin`, `hora_inicio`, `hora_fin`) VALUES
(1, 'Asesoria Legal Comunitaria', 'Apoyo en jornadas de orientacion legal basica para habitantes de comunidades cercanas, con registro de consultas y acompanamiento en procesos administrativos.', 'Consultorio Juridico USO', NULL, 80, 0, NULL, 8, 0, 1, 1, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:00:00', '12:00:00'),
(2, 'Apoyo Administrativo Institucional', 'Colaboracion en organizacion de expedientes, atencion al usuario, control de documentos y mejora de procesos administrativos en oficinas universitarias.', 'Administracion Academica', NULL, 80, 0, NULL, 10, 0, 1, 2, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:30:00', '12:30:00'),
(3, 'Campaña de Comunicacion Social', 'Diseno y apoyo en una campana informativa para promover actividades universitarias y proyectos comunitarios mediante materiales digitales y encuestas.', 'Unidad de Comunicaciones', NULL, 60, 0, NULL, 8, 0, 1, 3, 1, '2026-05-28 11:56:51', '2026-06-10', '2026-06-24', '09:00:00', '12:00:00'),
(4, 'Educacion Financiera Comunitaria', 'Apoyo en talleres de presupuesto familiar, registro contable basico y orientacion sobre control de ingresos y gastos para pequenos emprendimientos.', 'Centro de Proyeccion Social', NULL, 70, 0, NULL, 8, 0, 1, 4, 1, '2026-05-28 11:56:51', '2026-06-09', '2026-06-23', '08:00:00', '11:30:00'),
(5, 'Mantenimiento Electrico Preventivo', 'Revision de luminarias, apoyo en diagnostico de instalaciones electricas y elaboracion de reportes de mantenimiento preventivo en espacios academicos.', 'Campus Central', NULL, 80, 0, NULL, 6, 0, 1, 5, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:00:00', '12:00:00'),
(6, 'Mejora de Procesos Institucionales', 'Levantamiento de procesos, identificacion de tiempos de espera y propuesta de mejoras para optimizar la atencion en unidades administrativas.', 'Oficinas Administrativas USO', NULL, 90, 0, NULL, 8, 0, 1, 6, 1, '2026-05-28 11:56:51', '2026-06-11', '2026-06-26', '08:00:00', '12:00:00'),
(7, 'Soporte Tecnico y Digitalizacion', 'Apoyo en mantenimiento basico de equipos, asistencia a usuarios, digitalizacion de documentos y actualizacion de registros internos.', 'Laboratorio de Informatica', NULL, 100, 0, NULL, 10, 0, 1, 7, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-26', '08:00:00', '12:00:00'),
(8, 'Jornada Ambiental y Huerto Universitario', 'Participacion en limpieza de areas verdes, clasificacion de residuos, preparacion de compostaje y mantenimiento del huerto universitario.', 'CITAM', NULL, 25, 1, NULL, 10, 0, 1, 8, 1, '2026-05-28 11:56:51', '2026-06-12', '2026-06-12', '08:00:00', '13:00:00'),
(9, 'Acompanamiento Psicoeducativo', 'Apoyo en talleres de habilidades socioemocionales, aplicacion de dinamicas grupales y registro de asistencia en actividades de bienestar estudiantil.', 'Bienestar Estudiantil', NULL, 70, 0, NULL, 8, 0, 1, 9, 1, '2026-05-28 11:56:51', '2026-06-09', '2026-06-24', '09:00:00', '12:00:00'),
(10, 'Acompañamiento Psicoeducativo', 'Apoyo en tutorias de matematica basica para estudiantes de primer ingreso, elaboracion de guias y registro de avances academicos.', 'Aulas de Apoyo Academico', NULL, 70, 0, NULL, 8, 0, 1, 10, 1, '2026-05-28 11:56:51', '2026-06-10', '2026-06-25', '08:00:00', '11:00:00'),
(11, 'Club de Ciencias y Medio Ambiente', 'Apoyo en demostraciones cientificas, preparacion de materiales didacticos y actividades de sensibilizacion sobre el cuidado de recursos naturales.', 'Laboratorio de Ciencias', NULL, 80, 0, NULL, 8, 0, 1, 11, 1, '2026-05-28 11:56:51', '2026-06-11', '2026-06-26', '08:00:00', '12:00:00'),
(12, 'Promocion de Lectura Comunitaria', 'Organizacion de circulos de lectura, apoyo en correccion de textos y dinamicas de expresion oral para jovenes de comunidades cercanas.', 'Biblioteca Universitaria', NULL, 60, 0, NULL, 8, 0, 1, 12, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-21', '09:00:00', '12:00:00'),
(13, 'Programa de Recreacion y Salud Activa', 'Apoyo en actividades deportivas y recreativas para promover habitos saludables, control de participantes y dinamicas de integracion comunitaria.', 'Cancha Universitaria', NULL, 80, 0, NULL, 10, 0, 1, 13, 1, '2026-05-28 11:56:51', '2026-06-13', '2026-06-27', '07:30:00', '11:30:00'),
(14, 'Jornada de Reforestacion y Limpieza Ambiental', 'Participacion en actividades de reforestacion, limpieza de zonas verdes, separacion de residuos y sensibilizacion ambiental en espacios comunitarios.', 'Parque Ecologico Municipal', NULL, 25, 1, NULL, 20, 0, 1, NULL, 1, '2026-05-28 11:56:51', '2026-06-27', '2026-06-27', '08:00:00', '13:00:00');

-- =========================================
-- 5. INSCRIPCIONES
-- =========================================

-- Sin registros en inscripciones.

-- =========================================
-- 6. HORAS MANUALES ACREDITADAS
-- =========================================

-- Sin registros en horas_manuales_acreditadas.

SET FOREIGN_KEY_CHECKS = 1;

-- Credenciales de prueba:
-- Admin: admin@usonsonate.edu.sv / 2323
-- Estudiantes: cualquier correo institucional insertado / 5678