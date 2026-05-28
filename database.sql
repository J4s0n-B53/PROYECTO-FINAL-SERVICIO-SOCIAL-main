-- Base de datos completa del Sistema de Servicio Social Estudiantil
-- Generado desde la base local SistemaServicioSocial el 2026-05-28 04:04:27
-- Ejecutar este archivo en MySQL para recrear estructura y datos de ejemplo.

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `carreras`;
CREATE TABLE `carreras` (
  `id_carrera` int NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(100) NOT NULL,
  `id_facultad` int DEFAULT NULL,
  PRIMARY KEY (`id_carrera`),
  KEY `id_facultad` (`id_facultad`),
  CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`id_facultad`) REFERENCES `facultades` (`id_facultad`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================
-- DATOS
-- =========================================


-- =========================================
-- 1. FACULTADES
-- =========================================

INSERT INTO `facultades` (`id_facultad`, `nombre_facultad`, `created_at`) VALUES
(1, 'Ciencias Jurídicas', '2026-05-05 18:53:26'),
(2, 'Economía y Ciencias Sociales', '2026-05-05 18:53:26'),
(3, 'Ingenería y Ciencias Naturales', '2026-05-05 18:53:26'),
(4, 'Ciencias de la Salud', '2026-05-05 18:53:26');

-- =========================================
-- 2. CARRERAS
-- =========================================

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`, `id_facultad`) VALUES
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
-- 3. USUARIOS
-- =========================================

INSERT INTO `usuarios` (`id_usuario`, `nombre_completo`, `correo_institucional`, `password_hash`, `rol`, `materias_aprobadas`, `id_carrera`, `created_at`, `horas_manuales`, `fecha_horas_manuales`) VALUES
(1, 'Administrador Académico', 'admin@usonsonate.edu.sv', '2323', 'admin', 0, NULL, '2026-05-05 18:53:26', 0, NULL),
(2, 'Brayan Francisco Sion Dimas', 'sd23i04002@usonsonate.edu.sv', '5678', 'estudiante', 30, 7, '2026-05-05 18:53:26', 325, '2026-05-27 14:51:47'),
(3, 'Jorge Leonardo Cruz Escobar', 'ce25d01005@usonsonate.edu.sv', '5678', 'estudiante', 20, 1, '2026-05-05 18:53:26', 0, NULL),
(4, 'Sofia Fernanda Tulipan Gallardo', 'tg22d01001@usonsonate.edu.sv', '5678', 'estudiante', 30, 1, '2026-05-05 18:53:26', 0, NULL),
(5, 'Usuario de Prueba', 'prueba_social@usonsonate.edu.sv', '12345', 'estudiante', 0, 7, '2026-05-06 17:27:38', 0, NULL),
(6, 'Jason Ernesto Benitez Lopez', 'benitezjason53@gmail.com', '12345', 'estudiante', 0, 7, '2026-05-06 19:13:30', 500, '2026-05-21 16:44:12'),
(7, 'Carlos Eduardo Mendoza Rivas', 'mr23i04005@usonsonate.edu.sv', '5678', 'estudiante', 32, 7, '2026-05-20 17:28:47', 50, '2026-05-27 18:39:33'),
(8, 'Gabriela María Fuentes Amaya', 'fa22i04012@usonsonate.edu.sv', '5678', 'estudiante', 35, 7, '2026-05-20 17:28:47', 0, NULL),
(9, 'Kevin Alexander Orellana Henríquez', 'oh23i04018@usonsonate.edu.sv', '5678', 'estudiante', 30, 7, '2026-05-20 17:28:47', 0, NULL),
(10, 'Daniela Alexandra Martínez Lemus', 'ml22i04025@usonsonate.edu.sv', '5678', 'estudiante', 33, 7, '2026-05-20 18:20:53', 0, NULL),
(11, 'Rodrigo Josué Castaneda Ramos', 'cr23i04009@usonsonate.edu.sv', '5678', 'estudiante', 31, 7, '2026-05-20 18:20:53', 0, NULL),
(12, 'Vanessa Beatriz Guardado Melgar', 'gm22i04031@usonsonate.edu.sv', '5678', 'estudiante', 36, 7, '2026-05-20 18:20:53', 0, NULL),
(13, 'Carlos Alberto Henríquez Interiano', 'hi22d01015@usonsonate.edu.sv', '5678', 'estudiante', 28, 1, '2026-05-21 09:32:38', 0, NULL),
(14, 'Elena María Galdámez Quintanilla', 'gq23d01022@usonsonate.edu.sv', '5678', 'estudiante', 18, 1, '2026-05-21 09:32:38', 0, NULL),
(15, 'Mauricio Ernesto Recinos Flores', 'rf24d01008@usonsonate.edu.sv', '5678', 'estudiante', 12, 1, '2026-05-21 09:32:38', 0, NULL),
(16, 'Claudia Vanessa Batres Beltrán', 'bb22d02001@usonsonate.edu.sv', '5678', 'estudiante', 34, 2, '2026-05-21 09:32:38', 0, NULL),
(17, 'Diego Alejandro Ortiz Zelaya', 'oz23d02014@usonsonate.edu.sv', '5678', 'estudiante', 22, 2, '2026-05-21 09:32:38', 0, NULL),
(18, 'Josué Benjamín Alvarado Castro', 'ac24d02030@usonsonate.edu.sv', '5678', 'estudiante', 15, 2, '2026-05-21 09:32:38', 0, NULL),
(19, 'Adriana Marcela Rodríguez Pineda', 'rp23d03005@usonsonate.edu.sv', '5678', 'estudiante', 25, 3, '2026-05-21 09:32:38', 0, NULL),
(20, 'Bryan Esteven Cortez Portillo', 'cp22d03019@usonsonate.edu.sv', '5678', 'estudiante', 32, 3, '2026-05-21 09:32:38', 0, NULL),
(21, 'Fátima Guadalupe Rivas Menjívar', 'rm24d03011@usonsonate.edu.sv', '5678', 'estudiante', 14, 3, '2026-05-21 09:32:38', 0, NULL),
(22, 'Manuel de Jesús Góchez Aquino', 'ga22d04003@usonsonate.edu.sv', '5678', 'estudiante', 36, 4, '2026-05-21 09:32:38', 0, NULL),
(23, 'Tania Gisela Renderos Orellana', 'ro23d04027@usonsonate.edu.sv', '5678', 'estudiante', 20, 4, '2026-05-21 09:32:38', 0, NULL),
(24, 'Christian Vladimir Juárez Peña', 'jp24d04015@usonsonate.edu.sv', '5678', 'estudiante', 11, 4, '2026-05-21 09:32:38', 0, NULL),
(25, 'Roberto Carlos Escalante Pleitez', 'ep22i02004@usonsonate.edu.sv', '5678', 'estudiante', 33, 5, '2026-05-21 09:32:38', 0, NULL),
(26, 'Fernando José Molina Guardado', 'mg23i02011@usonsonate.edu.sv', '5678', 'estudiante', 24, 5, '2026-05-21 09:32:38', 0, NULL),
(27, 'Néstor Iván Ramos Cea', 'rc24i02019@usonsonate.edu.sv', '5678', 'estudiante', 13, 5, '2026-05-21 09:32:38', 0, NULL),
(28, 'Mónica Beatriz Solís Valle', 'sv22i03002@usonsonate.edu.sv', '5678', 'estudiante', 38, 6, '2026-05-21 09:32:38', 0, NULL),
(29, 'Walter Alexander Melgar Girón', 'mg23i03041@usonsonate.edu.sv', '5678', 'estudiante', 21, 6, '2026-05-21 09:32:38', 0, NULL),
(30, 'Rebeca Abigail Castaneda Cruz', 'cc24i03015@usonsonate.edu.sv', '5678', 'estudiante', 16, 6, '2026-05-21 09:32:38', 0, NULL),
(31, 'Rodrigo Antonio Calderón Milla', 'cm23i05003@usonsonate.edu.sv', '5678', 'estudiante', 26, 8, '2026-05-21 09:32:38', 0, NULL),
(32, 'Gisselle Alejandra Peña Durán', 'pd22i05009@usonsonate.edu.sv', '5678', 'estudiante', 35, 8, '2026-05-21 09:32:38', 325, '2026-05-27 16:49:23'),
(33, 'Juan Francisco Lemus Sibrián', 'ls24i05012@usonsonate.edu.sv', '5678', 'estudiante', 10, 8, '2026-05-21 09:32:38', 0, NULL),
(34, 'William Oswaldo Tobar Rosales', 'tr24d06002@usonsonate.edu.sv', '5678', 'estudiante', 18, 9, '2026-05-21 09:32:38', 0, NULL),
(35, 'Ingrid Sarai Gutiérrez Mancía', 'gm25d06014@usonsonate.edu.sv', '5678', 'estudiante', 8, 9, '2026-05-21 09:32:38', 0, NULL),
(36, 'Kevin Edgardo Guillén Mezquita', 'gm24d06021@usonsonate.edu.sv', '5678', 'estudiante', 15, 9, '2026-05-21 09:32:38', 0, NULL),
(37, 'Gabriela Elizabeth Coreas Campos', 'cc22d05033@usonsonate.edu.sv', '5678', 'estudiante', 31, 10, '2026-05-21 09:32:38', 0, NULL),
(38, 'Nelson Edgardo Huezo Mixco', 'hm23d05004@usonsonate.edu.sv', '5678', 'estudiante', 23, 10, '2026-05-21 09:32:38', 0, NULL),
(39, 'Paola Michelle Zepeda Velásquez', 'zv24d05018@usonsonate.edu.sv', '5678', 'estudiante', 12, 10, '2026-05-21 09:32:38', 0, NULL),
(40, 'Marielos del Carmen Ávalos Rivera', 'ar24d07005@usonsonate.edu.sv', '5678', 'estudiante', 19, 11, '2026-05-21 09:32:38', 0, NULL),
(41, 'Jonathan Isaac Pinto Beltrán', 'pb25d07042@usonsonate.edu.sv', '5678', 'estudiante', 7, 11, '2026-05-21 09:32:38', 0, NULL),
(42, 'Fátima María Calles Vásquez', 'cv24d07011@usonsonate.edu.sv', '5678', 'estudiante', 16, 11, '2026-05-21 09:32:38', 0, NULL),
(43, 'José Alejandro Quintanilla Guardado', 'qg22d01041@usonsonate.edu.sv', '5678', 'estudiante', 33, 1, '2026-05-21 11:19:05', 0, NULL),
(44, 'Fátima Alexandra Monterrosa Chachagua', 'mc25d01053@usonsonate.edu.sv', '5678', 'estudiante', 10, 1, '2026-05-21 11:20:15', 0, NULL),
(45, 'Marvin Josué Castaneda Lemus', 'cl22d01060@usonsonate.edu.sv', '5678', 'estudiante', 35, 1, '2026-05-22 11:08:56', 0, NULL),
(206, 'Andrea Beatriz Morales Rivas', 'mr23i05021@usonsonate.edu.sv', '5678', 'estudiante', 34, 8, '2026-05-27 14:06:14', 500, '2026-05-27 16:15:13'),
(207, 'Oscar Daniel Aguilar Perez', 'ap22i05017@usonsonate.edu.sv', '5678', 'estudiante', 38, 8, '2026-05-27 14:06:14', 475, '2026-05-27 18:19:22'),
(208, 'Karla Vanessa Hernandez Lopez', 'hl23i05008@usonsonate.edu.sv', '5678', 'estudiante', 36, 8, '2026-05-27 14:06:14', 0, NULL),
(209, 'Luis Fernando Escobar Menjivar', 'em22i05014@usonsonate.edu.sv', '5678', 'estudiante', 32, 8, '2026-05-27 14:06:14', 0, NULL),
(210, 'Natalia Sofia Ramirez Guardado', 'rg23i05025@usonsonate.edu.sv', '5678', 'estudiante', 40, 8, '2026-05-27 14:06:14', 0, NULL);

-- =========================================
-- 4. OFERTAS
-- =========================================

INSERT INTO `ofertas` (`id_oferta`, `titulo`, `descripcion`, `ubicacion`, `horario`, `horas_acreditar`, `es_ambiental`, `imagen_url`, `cupo_maximo`, `cupo_actual`, `activo`, `id_carrera`, `id_admin_creador`, `created_at`, `fecha_inicio`, `fecha_fin`, `hora_inicio`, `hora_fin`) VALUES
(1, 'Desarrollo de Software Interno', 'Apoyo en el área de TI de la universidad.', 'Campus Central', 'Lunes a Viernes', 150, 0, 'https://pbs.twimg.com/media/E9PzQUWXsAIiLZw.jpg', 6, 5, 1, 7, 1, '2026-05-05 18:53:26', '2026-05-04', '2026-05-04', '08:00:00', '16:30:00'),
(2, 'Asesoría Legal Comunitaria', 'Prácticas jurídicas en clínicas legales.', 'Centro Judicial', 'Mañana', 120, 0, 'https://admin.usonsonate.edu.sv/uploads/auditorio_pag_web_70171eab44.jpg', 5, 4, 1, 1, 1, '2026-05-05 18:53:26', NULL, NULL, NULL, NULL),
(3, 'Apoyo en Alcaldia Sonsonate Centro', 'Alcaldia de Sonsonate Centro requiere apoyo en el area de electricidad', 'Alcaldia Sonsonate Centro', 'Lunes a Miercoles', 50, 0, 'https://dinero.com.sv/wp-content/uploads/2025/03/Sonsonate.jpg', 3, 0, 1, 5, 1, '2026-05-21 12:01:35', NULL, NULL, NULL, NULL),
(4, 'Apoyo en CITAM', 'Se requiere apoyo en CITAM las actividades a realizar son:\nRecoleccion de basura y desechos\n\nSe requiere pago de $2 para el transporte favor de cancelar en Contabilidad', 'CITAM', 'Lunes a Viernes', 25, 1, '/uploads/ofertas/1779834540692-719221327.jpg', 10, 4, 1, NULL, 1, '2026-05-21 12:15:21', '2026-05-26', '2026-05-26', '08:30:00', '14:30:00'),
(5, 'Apoyo en Desarrollo de una Aplicacion', 'La Universidad de Sonsonate, requiere apoyo para el desarrollo de una aplicacion web de inventario', 'Universidad de Sonsonate', 'Lunes a Viernes', 250, 0, NULL, 5, 0, 1, 7, 1, '2026-05-22 10:05:28', NULL, NULL, NULL, NULL),
(6, 'Apoyo En Asesoria Legal', 'La Universidad de Sonsonaterequiere apoyo', 'Universidad de Sonsonate', NULL, 150, 0, NULL, 5, 1, 1, 1, 1, '2026-05-22 11:05:00', '2026-05-25', '2026-05-29', '08:30:00', '15:45:00'),
(7, 'Bla bla ble ble', 'sgffhdhgd', 'Universidad de Sonsonate', NULL, 150, 0, NULL, 5, 1, 0, NULL, 1, '2026-05-22 11:37:39', NULL, NULL, NULL, NULL),
(8, 'hgjhkbkjk', 'kjbkjbjn,', 'jnmnmnm', NULL, 150, 0, NULL, 5, 3, 0, NULL, 1, '2026-05-22 12:01:28', '2026-09-23', '2026-09-26', '07:00:00', '12:00:00'),
(9, 'La cucaracha la cucaracha ya no puede  caminar', 'por que? psssssssss por quee no tiene patas\n\nTe neis que derrotar a Darth Vader', 'Alla por la estrella de la muerte', NULL, 250, 0, 'https://wallpapers.com/images/hd/death-star-space-station4-k-8dqfjkcq0eiksv1c.jpg', 5, 0, 1, NULL, 1, '2026-05-27 12:09:32', '2026-05-25', '2026-05-29', '07:35:00', '15:45:00'),
(10, 'ambiental', 'dvfdvfdvfds', 'Parque', NULL, 25, 1, NULL, 5, 0, 1, NULL, 1, '2026-05-27 15:31:40', '2026-05-19', '2026-05-19', '07:31:00', '13:30:00');

-- =========================================
-- 5. INSCRIPCIONES
-- =========================================

INSERT INTO `inscripciones` (`id_inscripcion`, `id_estudiante`, `id_oferta`, `fecha_inscripcion`, `estado`, `horas_acreditadas`, `fecha_acreditacion`) VALUES
(1, 2, 1, '2026-05-07 15:32:28', 'finalizado', 150, '2026-05-07 15:32:28'),
(5, 7, 1, '2026-05-20 18:02:53', 'finalizado', 100, '2026-05-20 18:02:53'),
(6, 8, 1, '2026-05-20 18:07:30', 'finalizado', NULL, '2026-05-20 18:07:30'),
(7, 9, 1, '2026-05-20 18:19:29', 'finalizado', 20, '2026-05-20 18:19:29'),
(8, 10, 1, '2026-05-20 18:32:51', 'aceptado', NULL, NULL),
(9, 4, 2, '2026-05-21 09:54:28', 'pendiente', NULL, NULL),
(14, 14, 2, '2026-05-21 10:55:53', 'aceptado', NULL, NULL),
(15, 15, 2, '2026-05-21 10:59:15', 'rechazado', NULL, NULL),
(17, 43, 2, '2026-05-21 11:29:29', 'aceptado', NULL, NULL),
(20, 45, 6, '2026-05-22 11:14:13', 'rechazado', NULL, NULL),
(22, 45, 2, '2026-05-22 11:27:04', 'aceptado', NULL, NULL),
(23, 45, 7, '2026-05-22 11:38:16', 'finalizado', NULL, '2026-05-22 11:39:01'),
(24, 45, 8, '2026-05-22 12:01:41', 'finalizado', 150, '2026-05-22 12:10:30'),
(28, 4, 8, '2026-05-26 11:30:30', 'finalizado', 150, '2026-05-26 11:31:25'),
(29, 4, 6, '2026-05-26 11:43:11', 'pendiente', NULL, NULL),
(31, 32, 8, '2026-05-27 11:14:52', 'finalizado', 150, '2026-05-27 14:21:52'),
(36, 207, 4, '2026-05-27 15:02:43', 'finalizado', 25, '2026-05-27 18:17:23'),
(38, 32, 4, '2026-05-27 15:04:05', 'finalizado', 25, '2026-05-27 15:09:21'),
(39, 2, 4, '2026-05-27 15:08:16', 'finalizado', 25, '2026-05-27 15:09:21'),
(41, 206, 4, '2026-05-27 16:17:04', 'finalizado', 25, '2026-05-27 16:23:40');

-- =========================================
-- 6. HORAS MANUALES ACREDITADAS
-- =========================================

INSERT INTO `horas_manuales_acreditadas` (`id_hora_manual`, `id_estudiante`, `horas`, `descripcion`, `fecha_acreditacion`) VALUES
(1, 2, 325, 'Acreditacion manual', '2026-05-27 14:51:47'),
(2, 6, 500, 'Acreditacion manual', '2026-05-21 16:44:12'),
(3, 32, 25, 'Acreditacion manual', '2026-05-27 16:29:32'),
(4, 206, 500, 'Acreditacion manual', '2026-05-27 16:15:13'),
(8, 32, 25, 'Acreditacion manual', '2026-05-27 16:45:20'),
(9, 32, 50, 'Acreditacion manual', '2026-05-27 16:45:33'),
(10, 32, 25, 'Acreditacion manual', '2026-05-27 16:45:46'),
(11, 32, 200, 'Acreditacion manual', '2026-05-27 16:49:23'),
(12, 207, 25, 'Acreditacion manual', '2026-05-27 18:18:16'),
(13, 207, 350, 'Acreditacion manual', '2026-05-27 18:18:54'),
(14, 207, 100, 'Acreditacion manual', '2026-05-27 18:19:22'),
(15, 7, 50, 'Acreditacion manual', '2026-05-27 18:39:33');

SET FOREIGN_KEY_CHECKS = 1;

-- Consulta rapida de prueba:
-- SELECT COUNT(*) AS usuarios FROM usuarios;
-- SELECT COUNT(*) AS ofertas FROM ofertas;
-- SELECT COUNT(*) AS inscripciones FROM inscripciones;