CREATE DATABASE IF NOT EXISTS airyfit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE airyfit_db;

-- 1. Perfil del Atleta
CREATE TABLE IF NOT EXISTS perfiles (
  id INT PRIMARY KEY DEFAULT 1,
  nombre VARCHAR(120) NOT NULL,
  usuario VARCHAR(80) NOT NULL,
  sexo ENUM('mujer', 'hombre') DEFAULT 'mujer',
  objetivo VARCHAR(120) DEFAULT 'Recomposición Corporal',
  peso DECIMAL(5,2) DEFAULT 60.00,
  estatura INT DEFAULT 165,
  grasa_actual DECIMAL(4,1) DEFAULT 22.0,
  meta_calorias_diarias INT DEFAULT 450,
  foto MEDIUMTEXT,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Plan de Dieta, Comidas, Hidratación y Suplementos (JSON estructurado + columnas clave)
CREATE TABLE IF NOT EXISTS planes_dieta (
  id INT PRIMARY KEY DEFAULT 1,
  perfil_id INT DEFAULT 1,
  meta_agua_vasos INT DEFAULT 8,
  vasos_tomados_hoy INT DEFAULT 0,
  fecha_agua DATE,
  suplementos_json JSON,
  comidas_json JSON,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (perfil_id) REFERENCES perfiles(id) ON DELETE CASCADE
);

-- 3. Catálogo de Ejercicios (Base + Personalizados)
CREATE TABLE IF NOT EXISTS ejercicios (
  id VARCHAR(80) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  grupo VARCHAR(80) NOT NULL,
  equipo VARCHAR(80),
  imagen MEDIUMTEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rutinas e Historial de Entrenamientos
CREATE TABLE IF NOT EXISTS rutinas (
  id VARCHAR(80) PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  enfoque VARCHAR(100),
  ejercicios_json JSON,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historial_sesiones (
  id VARCHAR(80) PRIMARY KEY,
  rutina_nombre VARCHAR(150) NOT NULL,
  fecha_texto VARCHAR(50),
  fecha_iso DATE,
  duracion_segundos INT DEFAULT 0,
  calorias_estimadas INT DEFAULT 0,
  ejercicios_json JSON,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
