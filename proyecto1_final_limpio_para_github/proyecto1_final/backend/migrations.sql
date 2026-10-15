-- ============================================
-- MIGRACIONES PARA MEJORAR EL SISTEMA
-- ============================================

-- 1. Agregar campo de estado a la tabla equipos
ALTER TABLE equipos ADD COLUMN estado ENUM('Bueno', 'Dañado', 'En reparación', 'Perdido') DEFAULT 'Bueno';

-- 2. Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    equipo_id INT NOT NULL,
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'Notificado', 'Cancelada', 'Completada') DEFAULT 'Pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    INDEX idx_equipo (equipo_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- 3. Agregar campo de multa a la tabla prestamos
ALTER TABLE prestamos ADD COLUMN multa DECIMAL(10, 2) DEFAULT 0.00;

-- 4. Agregar campo de renovaciones a la tabla prestamos
ALTER TABLE prestamos ADD COLUMN renovaciones INT DEFAULT 0;

-- 5. Agregar campo de fecha_limite_renovacion a la tabla prestamos
ALTER TABLE prestamos ADD COLUMN fecha_limite_renovacion DATE;

-- 6. Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(50) UNIQUE NOT NULL,
    valor VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Insertar configuraciones por defecto
INSERT INTO configuracion (clave, valor, descripcion) VALUES
('limite_prestamos_usuario', '3', 'Límite máximo de préstamos por usuario'),
('dias_prestamo', '7', 'Días permitidos para préstamo'),
('dias_renovacion', '3', 'Días antes del vencimiento para renovar'),
('max_renovaciones', '1', 'Máximo de renovaciones permitidas'),
('multa_por_dia', '0.50', 'Monto de multa por día de atraso')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
