CREATE DATABASE IF NOT EXISTS SistemaServicioSocial
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE SistemaServicioSocial;

DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS ofertas;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS carreras;
DROP TABLE IF EXISTS facultades;

CREATE TABLE facultades (
    id_facultad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_facultad VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    id_facultad INT,
    FOREIGN KEY (id_facultad)
        REFERENCES facultades(id_facultad)
        ON DELETE CASCADE
);

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
);

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
);

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
);

INSERT INTO facultades (nombre_facultad) VALUES
('Ciencias Jurídicas'),
('Economía y Ciencias Sociales'),
('Ingeniería y Ciencias Naturales'),
('Ciencias de la Salud');

INSERT INTO carreras (nombre_carrera, id_facultad) VALUES
('Licenciatura en Ciencias Juridicas', 1),
('Licenciatura en Administración de Empresas', 2),
('Licenciatura en Mercadeo', 2),
('Licenciatura en Contaduría Pública', 2),
('Ingeniería Eléctrica', 3),
('Ingeniería Industrial', 3),
('Ingeniería en Sistemas Computacionales', 3),
('Ingeniería en Agronegocios', 3),
('Técnico en Logística y Aduanas', 3),
('Licenciatura en Psicología', 4),
('Técnico en Enfermería', 4);

INSERT INTO usuarios
(nombre_completo, correo_institucional, password_hash, rol, materias_aprobadas, id_carrera)
VALUES
('Administrador Académico', 'admin@usonsonate.edu.sv', '2323', 'admin', 0, NULL),
('Brayan Francisco Sion Dimas', 'sd23i04002@usonsonate.edu.sv', '5678', 'estudiante', 30, 7),
('Jorge Leonardo Cruz Escobar', 'ce25d01005@usonsonate.edu.sv', '5678', 'estudiante', 20, 1),
('Sofia Fernanda Tulipan Gallardo', 'tg22d01001@usonsonate.edu.sv', '5678', 'estudiante', 30, 1);

INSERT INTO ofertas
(titulo, descripcion, ubicacion, horario, horas_acreditar, imagen_url, cupo_maximo, cupo_actual, activo, id_carrera, id_admin_creador)
VALUES
('Desarrollo de Software Interno', 'Apoyo en el área de TI de la universidad.', 'Campus Central', 'Lunes a Viernes', 150, 'https://pbs.twimg.com/media/E9PzQUWXsAIiLZw.jpg', 5, 0, TRUE, 7, 1),
('Asesoría Legal Comunitaria', 'Prácticas jurídicas en clínicas legales.', 'Centro Judicial', 'Mañana', 120, 'https://admin.usonsonate.edu.sv/uploads/auditorio_pag_web_70171eab44.jpg', 4, 0, TRUE, 1, 1);
