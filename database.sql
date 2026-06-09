-- Base de presentacion del Sistema de Servicio Social Estudiantil
-- Generado desde la base local SistemaServicioSocial el 2026-06-09 16:13:39
-- Las contrasenas se almacenan con hash bcrypt.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `SistemaServicioSocial`;
CREATE DATABASE `SistemaServicioSocial` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `SistemaServicioSocial`;

-- =========================================
-- 0. ESTRUCTURA DE TABLAS
-- =========================================

DROP TABLE IF EXISTS `horas_manuales_acreditadas`;
DROP TABLE IF EXISTS `inscripciones`;
DROP TABLE IF EXISTS `ofertas`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `carreras`;
DROP TABLE IF EXISTS `facultades`;

CREATE TABLE IF NOT EXISTS `facultades` (
  `id_facultad` int NOT NULL AUTO_INCREMENT,
  `nombre_facultad` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_facultad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `carreras` (
  `id_carrera` int NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(100) NOT NULL,
  `codigo_carrera` varchar(3) DEFAULT NULL,
  `id_facultad` int DEFAULT NULL,
  PRIMARY KEY (`id_carrera`),
  UNIQUE KEY `uq_carreras_codigo` (`codigo_carrera`),
  KEY `id_facultad` (`id_facultad`),
  CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`id_facultad`) REFERENCES `facultades` (`id_facultad`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ofertas` (
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
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id_oferta`),
  KEY `id_carrera` (`id_carrera`),
  KEY `id_admin_creador` (`id_admin_creador`),
  CONSTRAINT `ofertas_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`),
  CONSTRAINT `ofertas_ibfk_2` FOREIGN KEY (`id_admin_creador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `inscripciones` (
  `id_inscripcion` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int NOT NULL,
  `id_oferta` int NOT NULL,
  `fecha_inscripcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','aceptado','finalizado','rechazado') DEFAULT 'pendiente',
  `horas_acreditadas` int DEFAULT NULL,
  `fecha_acreditacion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_inscripcion`),
  UNIQUE KEY `id_estudiante` (`id_estudiante`,`id_oferta`),
  KEY `id_oferta` (`id_oferta`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id_oferta`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `horas_manuales_acreditadas` (
  `id_hora_manual` int NOT NULL AUTO_INCREMENT,
  `id_estudiante` int NOT NULL,
  `horas` int NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT 'Acreditacion manual',
  `fecha_acreditacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_hora_manual`),
  KEY `id_estudiante` (`id_estudiante`),
  CONSTRAINT `horas_manuales_acreditadas_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`, `codigo_carrera`, `id_facultad`) VALUES
(1, 'Licenciatura en Ciencias Jurídicas', 'D01', 1),
(2, 'Licenciatura en Administración de Empresas', 'E01', 2),
(3, 'Licenciatura en Mercadeo', 'E02', 2),
(4, 'Licenciatura en Contaduría Pública', 'E03', 2),
(5, 'Ingeniería Eléctrica', 'I01', 3),
(6, 'Ingeniería Industrial', 'I03', 3),
(7, 'Ingeniería en Sistemas Computacionales', 'I04', 3),
(8, 'Ingeniería en Agronegocios', 'I08', 3),
(9, 'Licenciatura en Psicología', 'E17', 4),
(10, 'Licenciatura en Matemática', 'E07', 5),
(11, 'Licenciatura en Ciencias Naturales', 'E06', 5),
(12, 'Licenciatura en Lenguaje y Literatura', 'E14', 5),
(13, 'Licenciatura en Educación Física, Deportes y Recreación', 'E18', 5);

-- =========================================
-- 3. USUARIOS
-- =========================================

-- Administradores
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(1, 'Administrador Académico', 'admin@usonsonate.edu.sv', '$2b$10$O7ZOu13jdI5fydPFhhqVC.om0kDbkN6x.19RoMcm8JKEI1F4pKRmO', 'admin', 0, NULL, '2026-05-05 18:53:26', 0, NULL);

-- Licenciatura en Ciencias Jurídicas (D01)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(2, 'Mariana Lisbeth Cortez Aguilar', 'ca26d01001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 1, '2026-05-28 09:00:00', 0, NULL),
(3, 'Oscar Daniel Perez Rivas', 'pr25d01002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 1, '2026-05-28 09:00:00', 0, NULL),
(4, 'Rosa Elena Morales Campos', 'mc24d01003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 1, '2026-05-28 09:00:00', 0, NULL),
(5, 'Nelson Antonio Guardado Mejia', 'gm23d01004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 1, '2026-05-28 09:00:00', 0, NULL),
(6, 'Valeria Sofia Henriquez Arias', 'ha22d01005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 1, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Administración de Empresas (E01)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(7, 'Kevin Alexander Lopez Benitez', 'lb26e01001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 2, '2026-05-28 09:00:00', 0, NULL),
(8, 'Claudia Vanessa Batres Serrano', 'bs25e01002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 2, '2026-05-28 09:00:00', 0, NULL),
(9, 'Jose Armando Rivera Orellana', 'ro24e01003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 2, '2026-05-28 09:00:00', 0, NULL),
(10, 'Gabriela Elizabeth Coreas Campos', 'cc23e01004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 2, '2026-05-28 09:00:00', 0, NULL),
(11, 'Ricardo Ernesto Mendoza Chavez', 'mc22e01005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 2, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Mercadeo (E02)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(12, 'Adriana Marcela Rodriguez Pineda', 'rp26e02001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 3, '2026-05-28 09:00:00', 0, NULL),
(13, 'Bryan Esteven Cortez Portillo', 'cp25e02002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 3, '2026-05-28 09:00:00', 0, NULL),
(14, 'Paola Alejandra Vasquez Molina', 'vm24e02003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 3, '2026-05-28 09:00:00', 0, NULL),
(15, 'Sofia Carolina Hernandez Flores', 'hf23e02004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 3, '2026-05-28 09:00:00', 0, NULL),
(16, 'Diego Alejandro Ortiz Zelaya', 'oz22e02005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 3, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Contaduría Pública (E03)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(17, 'Christian Vladimir Juarez Pena', 'jp26e03001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 4, '2026-05-28 09:00:00', 0, NULL),
(18, 'Carlos Alberto Henriquez Interiano', 'hi25e03002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 4, '2026-05-28 09:00:00', 0, NULL),
(19, 'Ana Beatriz Salazar Fuentes', 'sf24e03003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 4, '2026-05-28 09:00:00', 0, NULL),
(20, 'Luis Fernando Martinez Escobar', 'me23e03004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 4, '2026-05-28 09:00:00', 0, NULL),
(21, 'Karla Patricia Gomez Quintanilla', 'gq22e03005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 4, '2026-05-28 09:00:00', 0, NULL);

-- Ingeniería Eléctrica (I01)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(22, 'Fernando Jose Molina Guardado', 'mg26i01001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 5, '2026-05-28 09:00:00', 0, NULL),
(23, 'Roberto Carlos Ayala Navas', 'an25i01002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 5, '2026-05-28 09:00:00', 0, NULL),
(24, 'Elmer Antonio Cruz Lemus', 'cl24i01003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 5, '2026-05-28 09:00:00', 0, NULL),
(25, 'Daniel Ernesto Pineda Romero', 'pr23i01004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 5, '2026-05-28 09:00:00', 0, NULL),
(26, 'Cecilia Maria Amaya Duarte', 'ad22i01005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 5, '2026-05-28 09:00:00', 0, NULL);

-- Ingeniería Industrial (I03)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(27, 'Miguel Angel Rivas Calderon', 'rc26i03001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 6, '2026-05-28 09:00:00', 0, NULL),
(28, 'Alfredo Benjamin Torres Luna', 'tl25i03002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 6, '2026-05-28 09:00:00', 0, NULL),
(29, 'Susana Beatriz Mejia Alvarado', 'ma24i03003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 6, '2026-05-28 09:00:00', 0, NULL),
(30, 'Hector Mauricio Diaz Ventura', 'dv23i03004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 6, '2026-05-28 09:00:00', 0, NULL),
(31, 'Lorena Abigail Castillo Reyes', 'cr22i03005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 6, '2026-05-28 09:00:00', 0, NULL);

-- Ingeniería en Sistemas Computacionales (I04)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(32, 'Brayan Francisco Sion Dimas', 'sd26i04001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 7, '2026-05-28 09:00:00', 0, NULL),
(33, 'Jason Ernesto Benitez Lopez', 'bl25i04002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 7, '2026-05-28 09:00:00', 0, NULL),
(34, 'Jorge Reinaldo Colocho Ayala', 'ca24i04003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 7, '2026-05-28 09:00:00', 0, NULL),
(35, 'Leonardo Antonio Saz Diaz', 'sd23i04004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 7, '2026-05-28 09:00:00', 0, NULL),
(36, 'Daniela Alexandra Martinez Lemus', 'ml22i04005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 7, '2026-05-28 09:00:00', 0, NULL),
(67, 'Ayleen Sucely Gonzales Rivera', 'gr23i04006@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 35, 7, '2026-06-02 19:16:23', 375, '2026-06-03 11:47:45');

-- Ingeniería en Agronegocios (I08)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(37, 'Andrea Beatriz Morales Rivas', 'mr26i08001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 8, '2026-05-28 09:00:00', 0, NULL),
(38, 'Gisselle Alejandra Pena Duran', 'pd25i08002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 8, '2026-05-28 09:00:00', 0, NULL),
(39, 'Oscar Daniel Aguilar Perez', 'ap24i08003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 8, '2026-05-28 09:00:00', 0, NULL),
(40, 'Ruth Carolina Escobar Bonilla', 'eb23i08004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 8, '2026-05-28 09:00:00', 0, NULL),
(41, 'Mauricio Ernesto Recinos Flores', 'rf22i08005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 8, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Psicología (E17)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(42, 'Gabriela Maria Fuentes Amaya', 'fa26e17001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 9, '2026-05-28 09:00:00', 0, NULL),
(43, 'Sofia Fernanda Tulipan Gallardo', 'tg25e17002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 9, '2026-05-28 09:00:00', 0, NULL),
(44, 'Marvin Josue Castaneda Lemus', 'cl24e17003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 9, '2026-05-28 09:00:00', 0, NULL),
(45, 'Elena Patricia Barrera Nunez', 'bn23e17004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 9, '2026-05-28 09:00:00', 0, NULL),
(46, 'Samuel Alejandro Portillo Gomez', 'pg22e17005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 9, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Matemática (E07)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(47, 'Iris Alejandra Funes Rivas', 'fr26e07001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 10, '2026-05-28 09:00:00', 0, NULL),
(48, 'Manuel Antonio Solis Campos', 'sc25e07002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 10, '2026-05-28 09:00:00', 0, NULL),
(49, 'Rebeca Elizabeth Castro Pena', 'cp24e07003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 10, '2026-05-28 09:00:00', 0, NULL),
(50, 'Victor Hugo Mejia Andrade', 'ma23e07004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 10, '2026-05-28 09:00:00', 0, NULL),
(51, 'Flor Maria Reyes Ochoa', 'ro22e07005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 10, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Ciencias Naturales (E06)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(52, 'Julio Cesar Menjivar Alfaro', 'ma26e06001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 11, '2026-05-28 09:00:00', 0, NULL),
(53, 'Natalia Abigail Cortez Figueroa', 'cf25e06002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 11, '2026-05-28 09:00:00', 0, NULL),
(54, 'Erick Orlando Chavez Rivera', 'cr24e06003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 11, '2026-05-28 09:00:00', 0, NULL),
(55, 'Marcela Vanessa Aquino Flores', 'af23e06004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 11, '2026-05-28 09:00:00', 0, NULL),
(56, 'Rafael Enrique Melendez Santos', 'ms22e06005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 11, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Lenguaje y Literatura (E14)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(57, 'Diana Carolina Barahona Vega', 'bv26e14001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 12, '2026-05-28 09:00:00', 0, NULL),
(58, 'Francisco Javier Lara Molina', 'lm25e14002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 12, '2026-05-28 09:00:00', 0, NULL),
(59, 'Silvia Beatriz Campos Orellana', 'co24e14003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 12, '2026-05-28 09:00:00', 0, NULL),
(60, 'Jonathan Alexander Merino Cruz', 'mc23e14004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 12, '2026-05-28 09:00:00', 0, NULL),
(61, 'Patricia Lisseth Navas Romero', 'nr22e14005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 12, '2026-05-28 09:00:00', 0, NULL);

-- Licenciatura en Educación Física, Deportes y Recreación (E18)
INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(62, 'Alexander Mauricio Franco Salinas', 'fs26e18001@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 18, 13, '2026-05-28 09:00:00', 0, NULL),
(63, 'Carolina Estefania Pineda Guzman', 'pg25e18002@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 27, 13, '2026-05-28 09:00:00', 0, NULL),
(64, 'Edwin Alberto Sorto Lopez', 'sl24e18003@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 32, 13, '2026-05-28 09:00:00', 0, NULL),
(65, 'Yesenia Maribel Quintanilla Rivas', 'qr23e18004@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 38, 13, '2026-05-28 09:00:00', 0, NULL),
(66, 'Jose David Hernandez Cabrera', 'hc22e18005@usonsonate.edu.sv', '$2b$10$J6Oql8TSmCQyYjt3pHmqvue08Xv3ry.klXJuGA9/CuA9SrlNPoWra', 'estudiante', 45, 13, '2026-05-28 09:00:00', 0, NULL);

-- =========================================
-- 4. OFERTAS
-- =========================================

INSERT INTO `ofertas` (`id_oferta`, `titulo`, `descripcion`, `ubicacion`, `horario`, `horas_acreditar`, `es_ambiental`, `imagen_url`, `cupo_maximo`, `cupo_actual`, `activo`, `id_carrera`, `id_admin_creador`, `created_at`, `fecha_inicio`, `fecha_fin`, `hora_inicio`, `hora_fin`) VALUES
(1, 'Asesoria Legal Comunitaria', 'Apoyo en jornadas de orientacion legal basica para habitantes de comunidades cercanas, con registro de consultas y acompanamiento en procesos administrativos.', 'Consultorio Juridico USO', NULL, 80, 0, '/uploads/ofertas/1780366195849-486000171.png', 8, 0, 1, 1, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:00:00', '12:00:00'),
(2, 'Apoyo Administrativo Institucional', 'Colaboracion en organizacion de expedientes, atencion al usuario, control de documentos y mejora de procesos administrativos en oficinas universitarias.', 'Administracion Academica', NULL, 80, 0, 'https://www.quecursar.com/wp-content/uploads/2026/02/auxiliar-administrativo-un-puesto-para-dar-apoyo-a-toda-la-empresa.jpg', 10, 0, 1, 2, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:30:00', '12:30:00'),
(3, 'Campaña de Comunicación Social', 'Diseno y apoyo en una campana informativa para promover actividades universitarias y proyectos comunitarios mediante materiales digitales y encuestas.', 'Unidad de Comunicaciones', NULL, 60, 0, 'https://www.pedagogica.edu.sv/wp-content/uploads/2021/01/licenciatura-en-mercadeo.jpg', 10, 0, 1, 3, 1, '2026-05-28 11:56:51', '2026-06-10', '2026-06-24', '09:00:00', '12:00:00'),
(4, 'Educación Financiera Comunitaria', 'Apoyo en talleres de presupuesto familiar, registro contable basico y orientacion sobre control de ingresos y gastos para pequenos emprendimientos.', 'Centro de Proyeccion Social', NULL, 70, 0, 'https://edufinanciera.ssf.gob.sv/wp-content/uploads/2025/02/financiera-1024x672.png', 8, 0, 1, 4, 1, '2026-05-28 11:56:51', '2026-06-09', '2026-06-23', '08:00:00', '11:30:00'),
(5, 'Mantenimiento Electrico Preventivo', 'Revision de luminarias, apoyo en diagnostico de instalaciones electricas y elaboracion de reportes de mantenimiento preventivo en espacios academicos.', 'Campus Central', NULL, 80, 0, 'https://montegar.es/wp-content/uploads/2024/12/mantenimiento-preventivo.jpg', 6, 0, 1, 5, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-19', '08:00:00', '12:00:00'),
(6, 'Mejora de Procesos Institucionales', 'Levantamiento de procesos, identificacion de tiempos de espera y propuesta de mejoras para optimizar la atencion en unidades administrativas.', 'Oficinas Administrativas USO', NULL, 90, 0, 'https://etransresol.com/images/eventos/ingenieria-industrial-optimizacion-de-procesos-y-mejora-continua-aseguramiento-de-la-calidad-y-control-de-la-produccion-etransresol-blog.jpg', 8, 0, 1, 6, 1, '2026-05-28 11:56:51', '2026-06-11', '2026-06-26', '08:00:00', '12:00:00'),
(7, 'Soporte Técnico ', 'Apoyo en mantenimiento basico de equipos.', 'Universidad de Sonsonate, Edificio A, Aula 23.', NULL, 100, 0, 'https://emprending.com.ar/wp-content/uploads/2022/02/reparar-pc-01.jpg', 2, 1, 1, 7, 1, '2026-05-28 11:56:51', '2026-06-01', '2026-06-05', '08:00:00', '12:00:00'),
(8, 'Jornada Ambiental ', 'Participacion en limpieza de areas verdes, clasificacion de residuos, preparacion de compostaje.', 'CITAM', NULL, 25, 0, 'https://uiyps-uso.com/wp-content/uploads/2025/09/Imagen-de-WhatsApp-2025-09-19-a-las-16.12.37_dfbd7438.jpg', 10, 0, 1, 8, 1, '2026-05-28 11:56:51', '2026-06-12', '2026-06-12', '08:00:00', '13:00:00'),
(9, 'Acompañamiento Psicoeducativo', 'Apoyo en talleres de habilidades socioemocionales, aplicacion de dinamicas grupales y registro de asistencia en actividades de bienestar estudiantil.', 'Bienestar Estudiantil', NULL, 70, 0, 'https://un.edu.mx/wp-content/uploads/2023/02/Universidad-del-Norte-Perspectivas-laborales-subtitulo-2.png', 8, 0, 1, 9, 1, '2026-05-28 11:56:51', '2026-06-09', '2026-06-24', '09:00:00', '12:00:00'),
(11, 'Club de Ciencias y Medio Ambiente', 'Apoyo en demostraciones cientificas, preparacion de materiales didacticos y actividades de sensibilizacion sobre el cuidado de recursos naturales.', 'Laboratorio de Ciencias', NULL, 80, 0, 'https://lh3.googleusercontent.com/proxy/qatBy_20_bgeEs_fIpGrFcccV1A3JVvwyneSjGG26g44SXfBu6_LIqpo3nCaxjBz0LVwQdPDByOIrBIOw9bad8NR8XqLkQ', 8, 0, 1, 11, 1, '2026-05-28 11:56:51', '2026-06-11', '2026-06-26', '08:00:00', '12:00:00'),
(12, 'Promocion de Lectura Comunitaria', 'Organizacion de circulos de lectura, apoyo en correccion de textos y dinamicas de expresion oral para jovenes de comunidades cercanas.', 'Biblioteca Universitaria', NULL, 60, 0, 'https://img.freepik.com/vector-gratis/personas-estudiando-aprendiendo-sala_74855-6615.jpg?semt=ais_hybrid&w=740&q=80', 8, 0, 1, 12, 1, '2026-05-28 11:56:51', '2026-06-08', '2026-06-21', '09:00:00', '12:00:00'),
(13, 'Programa de Recreacion y Salud Activa', 'Apoyo en actividades deportivas y recreativas para promover habitos saludables, control de participantes y dinamicas de integracion comunitaria.', 'Cancha Universitaria', NULL, 80, 0, 'https://doihojqqs770p.cloudfront.net/articulos/articulos-29099.jpeg', 10, 0, 1, 13, 1, '2026-05-28 11:56:51', '2026-06-13', '2026-06-27', '07:30:00', '11:30:00'),
(14, 'Jornada de Reforestacion y Limpieza Ambiental', 'Participacion en actividades de reforestacion, limpieza de zonas verdes, separacion de residuos y sensibilizacion ambiental en espacios comunitarios.', 'Parque Ecologico Municipal', NULL, 25, 1, '/uploads/ofertas/1780366010213-678613113.png', 20, 1, 1, NULL, 1, '2026-05-28 11:56:51', '2026-06-27', '2026-06-27', '08:00:00', '13:00:00');

-- =========================================
-- 5. INSCRIPCIONES
-- =========================================

INSERT INTO `inscripciones` (`id_inscripcion`, `id_estudiante`, `id_oferta`, `fecha_inscripcion`, `estado`, `horas_acreditadas`, `fecha_acreditacion`) VALUES
(3, 67, 7, '2026-06-03 11:44:12', 'finalizado', 100, '2026-06-03 11:45:45'),
(4, 67, 14, '2026-06-03 11:44:16', 'finalizado', 25, '2026-06-03 11:45:12');

-- =========================================
-- 6. HORAS MANUALES ACREDITADAS
-- =========================================

INSERT INTO `horas_manuales_acreditadas` (`id_hora_manual`, `id_estudiante`, `horas`, `descripcion`, `fecha_acreditacion`) VALUES
(1, 67, 75, 'Acreditacion manual', '2026-06-03 11:46:15'),
(2, 67, 150, 'Acreditacion manual', '2026-06-03 11:47:19'),
(3, 67, 50, 'Acreditacion manual', '2026-06-03 11:47:31'),
(4, 67, 100, 'Acreditacion manual', '2026-06-03 11:47:45');

SET FOREIGN_KEY_CHECKS = 1;

-- Credenciales de prueba:
-- Admin: admin@usonsonate.edu.sv / 2323
-- Estudiantes: cualquier correo institucional de estudiante / 5678
