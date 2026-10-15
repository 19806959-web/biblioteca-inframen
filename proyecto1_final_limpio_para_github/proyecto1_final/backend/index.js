const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de conexión a MySQL
const poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
};

// Solo usar SSL en producción (Aiven), no en desarrollo local
if (process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1') {
    poolConfig.ssl = {
        rejectUnauthorized: false
    };
}

const pool = mysql.createPool(poolConfig);

const promisePool = pool.promise();

// Verificar conexión a la base de datos
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
    connection.release();
});

// GET - Obtener todos los estudiantes
app.get('/estudiantes', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
});

// POST - Crear estudiante
app.post('/estudiantes', async (req, res) => {
    try {
        const { nombre, nie, grado, seccion } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO usuarios (nombre, nie, grado, seccion) VALUES (?, ?, ?, ?)',
            [nombre, nie, grado, seccion]
        );
        res.status(201).json({ id: result.insertId, nombre, nie, grado, seccion });
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
});

// PUT - Actualizar estudiante
app.put('/estudiantes/:id', async (req, res) => {
    try {
        const { nombre, nie, grado, seccion } = req.body;
        const [result] = await promisePool.query(
            'UPDATE usuarios SET nombre = ?, nie = ?, grado = ?, seccion = ? WHERE id = ?',
            [nombre, nie, grado, seccion, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json({ id: req.params.id, nombre, nie, grado, seccion });
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        res.status(500).json({ error: 'Error al actualizar estudiante' });
    }
});

// DELETE - Eliminar estudiante
app.delete('/estudiantes/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json({ message: 'Estudiante eliminado' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar el estudiante porque tiene préstamos asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar estudiante' });
    }
});

// ==================== CRUD AUTORES ====================

// GET - Obtener todos los autores
app.get('/autores', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM marcas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener autores:', error);
        res.status(500).json({ error: 'Error al obtener autores' });
    }
});

// POST - Crear autor
app.post('/autores', async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO marcas (nombre, imagen) VALUES (?, ?)',
            [nombre, imagen || null]
        );
        res.status(201).json({ id: result.insertId, nombre, imagen });
    } catch (error) {
        console.error('Error al crear autor:', error);
        res.status(500).json({ error: 'Error al crear autor' });
    }
});

// PUT - Actualizar autor
app.put('/autores/:id', async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const [result] = await promisePool.query(
            'UPDATE marcas SET nombre = ?, imagen = ? WHERE id = ?',
            [nombre, imagen, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json({ id: req.params.id, nombre, imagen });
    } catch (error) {
        console.error('Error al actualizar autor:', error);
        res.status(500).json({ error: 'Error al actualizar autor' });
    }
});

// DELETE - Eliminar autor
app.delete('/autores/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM marcas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json({ message: 'Autor eliminado' });
    } catch (error) {
        console.error('Error al eliminar autor:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar el autor porque tiene libros asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar autor' });
    }
});

// ==================== CRUD CATEGORÍAS ====================

// GET - Obtener todas las categorías
app.get('/categorias', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM tipos');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// POST - Crear categoría
app.post('/categorias', async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO tipos (nombre, imagen) VALUES (?, ?)',
            [nombre, imagen || null]
        );
        res.status(201).json({ id: result.insertId, nombre, imagen });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});

// PUT - Actualizar categoría
app.put('/categorias/:id', async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const [result] = await promisePool.query(
            'UPDATE tipos SET nombre = ?, imagen = ? WHERE id = ?',
            [nombre, imagen, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ id: req.params.id, nombre, imagen });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
});

// DELETE - Eliminar categoría
app.delete('/categorias/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM tipos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar la categoría porque tiene libros asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
});

// ==================== CRUD LIBROS ====================

// GET - Obtener todos los libros con JOIN
app.get('/libros', async (req, res) => {
    try {
        const { categoria, autor, disponible } = req.query;

        let query = `
            SELECT
                l.id,
                l.nombre AS titulo,
                a.nombre AS autor,
                c.nombre AS categoria,
                l.cantidad,
                l.disponibles,
                COALESCE(l.imagen,
                    CASE LOWER(c.nombre)
                        WHEN 'laptops' THEN 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
                        WHEN 'laptop' THEN 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
                        WHEN 'macbook' THEN 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop'
                        WHEN 'tablets' THEN 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'
                        WHEN 'tablet' THEN 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'
                        WHEN 'ipad' THEN 'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop'
                        WHEN 'proyectores' THEN 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop'
                        WHEN 'proyector' THEN 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop'
                        WHEN 'cámaras' THEN 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'
                        WHEN 'camaras' THEN 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'
                        WHEN 'camara' THEN 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'
                        WHEN 'auriculares' THEN 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
                        WHEN 'headphones' THEN 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
                        WHEN 'teclados' THEN 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
                        WHEN 'teclado' THEN 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
                        WHEN 'keyboard' THEN 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
                        WHEN 'mouses' THEN 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
                        WHEN 'mouse' THEN 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
                        WHEN 'monitores' THEN 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
                        WHEN 'monitor' THEN 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
                        WHEN 'impresoras' THEN 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop'
                        WHEN 'impresora' THEN 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop'
                        WHEN 'computadoras' THEN 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
                        WHEN 'computadora' THEN 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
                        WHEN 'pc' THEN 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop'
                        WHEN 'servidores' THEN 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
                        WHEN 'servidor' THEN 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
                        WHEN 'consolas' THEN 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
                        WHEN 'consola' THEN 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
                        WHEN 'routers' THEN 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop'
                        WHEN 'router' THEN 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop'
                        WHEN 'discos' THEN 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop'
                        WHEN 'disco duro' THEN 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop'
                        WHEN 'memorias' THEN 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop'
                        WHEN 'memoria' THEN 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop'
                        WHEN 'microfonos' THEN 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'
                        WHEN 'microfono' THEN 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'
                        WHEN 'altavoces' THEN 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop'
                        WHEN 'altavoz' THEN 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop'
                        WHEN 'webcams' THEN 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop'
                        WHEN 'webcam' THEN 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop'
                        ELSE 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop'
                    END
                ) AS imagen,
                l.marca_id,
                l.categoria_id,
                l.estado,
                CONCAT('Equipo ', l.nombre, ' de marca ', a.nombre, ', categoría ', c.nombre,
                       CASE WHEN l.estado = 'Bueno' THEN '. Estado: Excelente' END,
                       CASE WHEN l.estado = 'Dañado' THEN '. Estado: Dañado' END,
                       CASE WHEN l.estado = 'En reparación' THEN '. Estado: En reparación' END,
                       CASE WHEN l.estado = 'Perdido' THEN '. Estado: Perdido' END,
                       CASE WHEN l.disponibles > 0 THEN CONCAT('. Disponibles: ', l.disponibles, ' de ', l.cantidad) END,
                       CASE WHEN l.disponibles = 0 THEN '. Sin unidades disponibles' END) AS descripcion
            FROM equipos l
            INNER JOIN marcas a ON l.marca_id = a.id
            INNER JOIN tipos c ON l.categoria_id = c.id
        `;

        const params = [];
        const conditions = [];

        if (categoria) {
            conditions.push('l.categoria_id = ?');
            params.push(categoria);
        }

        if (autor) {
            conditions.push('l.marca_id = ?');
            params.push(autor);
        }

        if (disponible === 'true') {
            conditions.push('l.disponibles > 0');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await promisePool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ error: 'Error al obtener libros' });
    }
});

// POST - Crear libro
app.post('/libros', async (req, res) => {
    try {
        const { titulo, marca_id, categoria_id, cantidad, disponibles, imagen, estado } = req.body;
        const [result] = await promisePool.query(
            'INSERT INTO equipos (nombre, marca_id, categoria_id, cantidad, disponibles, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [titulo, marca_id, categoria_id, cantidad, disponibles, imagen || null, estado || 'Bueno']
        );
        res.status(201).json({ id: result.insertId, titulo, marca_id, categoria_id, cantidad, disponibles, imagen, estado });
    } catch (error) {
        console.error('Error al crear libro:', error);
        res.status(500).json({ error: 'Error al crear libro' });
    }
});

// PUT - Actualizar libro
app.put('/libros/:id', async (req, res) => {
    try {
        const { titulo, marca_id, categoria_id, cantidad, disponibles, imagen, estado } = req.body;
        const [result] = await promisePool.query(
            'UPDATE equipos SET nombre = ?, marca_id = ?, categoria_id = ?, cantidad = ?, disponibles = ?, imagen = ?, estado = ? WHERE id = ?',
            [titulo, marca_id, categoria_id, cantidad, disponibles, imagen, estado, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ id: req.params.id, titulo, marca_id, categoria_id, cantidad, disponibles, imagen, estado });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
});

// DELETE - Eliminar libro
app.delete('/libros/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM equipos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ message: 'Libro eliminado' });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'No se puede eliminar el libro porque tiene préstamos asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
});

// ==================== CRUD PRÉSTAMOS ====================

// GET - Obtener todos los préstamos con JOIN
app.get('/prestamos', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT
                p.id,
                e.nombre AS estudiante,
                l.nombre AS libro,
                a.nombre AS autor,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                p.usuario_id AS estudiante_id,
                p.equipo_id AS libro_id,
                p.renovaciones,
                p.multa
            FROM prestamos p
            INNER JOIN usuarios e ON p.usuario_id = e.id
            INNER JOIN equipos l ON p.equipo_id = l.id
            INNER JOIN marcas a ON l.marca_id = a.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).json({ error: 'Error al obtener préstamos' });
    }
});

// POST - Crear préstamo
app.post('/prestamos', async (req, res) => {
    try {
        const { estudiante_id, libro_id, fecha_prestamo, fecha_devolucion } = req.body;

        // Verificar que el equipo exista
        const [libro] = await promisePool.query('SELECT * FROM equipos WHERE id = ?', [libro_id]);
        if (libro.length === 0) {
            return res.status(404).json({ error: 'El equipo no existe' });
        }

        // Verificar que el equipo esté en buen estado
        if (libro[0].estado !== 'Bueno') {
            return res.status(400).json({ error: 'El equipo no está disponible para préstamo (estado: ' + libro[0].estado + ')' });
        }

        // Verificar que haya ejemplares disponibles
        if (libro[0].disponibles <= 0) {
            return res.status(400).json({ error: 'No hay ejemplares disponibles de este equipo' });
        }

        // Verificar límite de préstamos por usuario
        const [config] = await promisePool.query('SELECT valor FROM configuracion WHERE clave = "limite_prestamos_usuario"');
        const limitePrestamos = config[0] ? parseInt(config[0].valor) : 3;

        const [prestamosUsuario] = await promisePool.query(
            'SELECT COUNT(*) as total FROM prestamos WHERE usuario_id = ? AND estado = "Prestado"',
            [estudiante_id]
        );

        if (prestamosUsuario[0].total >= limitePrestamos) {
            return res.status(400).json({ error: `Has alcanzado el límite de ${limitePrestamos} préstamos simultáneos` });
        }

        // Registrar el préstamo
        const [result] = await promisePool.query(
            'INSERT INTO prestamos (usuario_id, equipo_id, fecha_prestamo, fecha_devolucion, estado) VALUES (?, ?, ?, ?, ?)',
            [estudiante_id, libro_id, fecha_prestamo, fecha_devolucion, 'Prestado']
        );

        // Restar 1 a disponibles
        await promisePool.query(
            'UPDATE equipos SET disponibles = disponibles - 1 WHERE id = ?',
            [libro_id]
        );

        res.status(201).json({
            id: result.insertId,
            estudiante_id,
            libro_id,
            fecha_prestamo,
            fecha_devolucion,
            estado: 'Prestado'
        });
    } catch (error) {
        console.error('Error al crear préstamo:', error);
        res.status(500).json({ error: 'Error al crear préstamo' });
    }
});

// PUT - Actualizar préstamo (para devolución)
app.put('/prestamos/:id', async (req, res) => {
    try {
        const { estudiante_id, libro_id, fecha_prestamo, fecha_devolucion, estado } = req.body;

        // Obtener el préstamo actual
        const [prestamo] = await promisePool.query('SELECT * FROM prestamos WHERE id = ?', [req.params.id]);
        if (prestamo.length === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        // Si se está devolviendo el libro
        if (prestamo[0].estado === 'Prestado' && estado === 'Devuelto') {
            const fechaDevolucion = fecha_devolucion || new Date().toISOString().split('T')[0];
            const fechaLimite = prestamo[0].fecha_devolucion;

            // Calcular multa si hay atraso
            let multa = 0;
            if (fechaDevolucion > fechaLimite) {
                const [config] = await promisePool.query('SELECT valor FROM configuracion WHERE clave = "multa_por_dia"');
                const multaPorDia = config[0] ? parseFloat(config[0].valor) : 0.50;

                const diasAtraso = Math.ceil((new Date(fechaDevolucion) - new Date(fechaLimite)) / (1000 * 60 * 60 * 24));
                multa = diasAtraso * multaPorDia;
            }

            // Actualizar estado, fecha de devolución y multa
            const [result] = await promisePool.query(
                'UPDATE prestamos SET estado = ?, fecha_devolucion = ?, multa = ? WHERE id = ?',
                [estado, fechaDevolucion, multa, req.params.id]
            );

            // Aumentar disponibles en 1
            await promisePool.query(
                'UPDATE equipos SET disponibles = disponibles + 1 WHERE id = ?',
                [prestamo[0].equipo_id]
            );

            return res.json({ id: req.params.id, estado, fecha_devolucion: fechaDevolucion, multa });
        }

        // Actualización normal
        const [result] = await promisePool.query(
            'UPDATE prestamos SET usuario_id = ?, equipo_id = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ? WHERE id = ?',
            [estudiante_id, libro_id, fecha_prestamo, fecha_devolucion, estado, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        res.json({ id: req.params.id, estudiante_id, libro_id, fecha_prestamo, fecha_devolucion, estado });
    } catch (error) {
        console.error('Error al actualizar préstamo:', error);
        res.status(500).json({ error: 'Error al actualizar préstamo' });
    }
});

// DELETE - Eliminar préstamo
app.delete('/prestamos/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM prestamos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }
        res.json({ message: 'Préstamo eliminado' });
    } catch (error) {
        console.error('Error al eliminar préstamo:', error);
        res.status(500).json({ error: 'Error al eliminar préstamo' });
    }
});

// ==================== CRUD RESERVAS ====================

// GET - Obtener todas las reservas
app.get('/reservas', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT
                r.id,
                r.fecha_reserva,
                r.estado,
                u.nombre AS estudiante,
                u.nie,
                e.nombre AS equipo,
                e.marca_id,
                e.categoria_id
            FROM reservas r
            INNER JOIN usuarios u ON r.usuario_id = u.id
            INNER JOIN equipos e ON r.equipo_id = e.id
            ORDER BY r.fecha_reserva ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// POST - Crear reserva
app.post('/reservas', async (req, res) => {
    try {
        const { usuario_id, equipo_id } = req.body;

        // Verificar que el usuario exista
        const [usuario] = await promisePool.query('SELECT * FROM usuarios WHERE id = ?', [usuario_id]);
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }

        // Verificar que el equipo exista
        const [equipo] = await promisePool.query('SELECT * FROM equipos WHERE id = ?', [equipo_id]);
        if (equipo.length === 0) {
            return res.status(404).json({ error: 'El equipo no existe' });
        }

        // Verificar que el equipo no tenga disponibilidad
        if (equipo[0].disponibles > 0) {
            return res.status(400).json({ error: 'El equipo tiene disponibilidad, puede realizar un préstamo directamente' });
        }

        // Verificar si el usuario ya tiene una reserva para este equipo
        const [reservaExistente] = await promisePool.query(
            'SELECT * FROM reservas WHERE usuario_id = ? AND equipo_id = ? AND estado = "Pendiente"',
            [usuario_id, equipo_id]
        );
        if (reservaExistente.length > 0) {
            return res.status(400).json({ error: 'Ya tienes una reserva pendiente para este equipo' });
        }

        // Crear la reserva
        const [result] = await promisePool.query(
            'INSERT INTO reservas (usuario_id, equipo_id, estado) VALUES (?, ?, "Pendiente")',
            [usuario_id, equipo_id]
        );

        res.status(201).json({
            id: result.insertId,
            usuario_id,
            equipo_id,
            estado: 'Pendiente',
            fecha_reserva: new Date()
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear reserva' });
    }
});

// PUT - Actualizar reserva
app.put('/reservas/:id', async (req, res) => {
    try {
        const { estado } = req.body;
        const [result] = await promisePool.query(
            'UPDATE reservas SET estado = ? WHERE id = ?',
            [estado, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ id: req.params.id, estado });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ error: 'Error al actualizar reserva' });
    }
});

// DELETE - Eliminar reserva
app.delete('/reservas/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query('DELETE FROM reservas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).json({ error: 'Error al eliminar reserva' });
    }
});

// ==================== RENOVACIÓN DE PRÉSTAMOS ====================

// PUT - Renovar préstamo
app.put('/prestamos/:id/renovar', async (req, res) => {
    try {
        const [prestamo] = await promisePool.query('SELECT * FROM prestamos WHERE id = ?', [req.params.id]);
        if (prestamo.length === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        if (prestamo[0].estado !== 'Prestado') {
            return res.status(400).json({ error: 'Solo se pueden renovar préstamos activos' });
        }

        // Obtener configuración del sistema
        const [config] = await promisePool.query('SELECT valor FROM configuracion WHERE clave = "max_renovaciones"');
        const maxRenovaciones = config[0] ? parseInt(config[0].valor) : 1;

        if (prestamo[0].renovaciones >= maxRenovaciones) {
            return res.status(400).json({ error: 'Se ha alcanzado el máximo de renovaciones permitidas' });
        }

        // Calcular nueva fecha de devolución (extender por los días configurados)
        const [configDias] = await promisePool.query('SELECT valor FROM configuracion WHERE clave = "dias_prestamo"');
        const diasPrestamo = configDias[0] ? parseInt(configDias[0].valor) : 7;

        const fechaActual = new Date();
        const nuevaFechaDevolucion = new Date(fechaActual);
        nuevaFechaDevolucion.setDate(nuevaFechaDevolucion.getDate() + diasPrestamo);

        // Actualizar préstamo
        await promisePool.query(
            'UPDATE prestamos SET fecha_devolucion = ?, renovaciones = renovaciones + 1 WHERE id = ?',
            [nuevaFechaDevolucion.toISOString().split('T')[0], req.params.id]
        );

        res.json({
            id: req.params.id,
            fecha_devolucion: nuevaFechaDevolucion.toISOString().split('T')[0],
            renovaciones: prestamo[0].renovaciones + 1
        });
    } catch (error) {
        console.error('Error al renovar préstamo:', error);
        res.status(500).json({ error: 'Error al renovar préstamo' });
    }
});

// ==================== HISTORIAL DE PRÉSTAMOS ====================

// GET - Obtener historial de préstamos de un estudiante
app.get('/estudiantes/:id/historial', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT
                p.id,
                e.nombre AS equipo,
                a.nombre AS autor,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                p.renovaciones,
                p.multa
            FROM prestamos p
            INNER JOIN equipos e ON p.equipo_id = e.id
            INNER JOIN marcas a ON e.marca_id = a.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha_prestamo DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
});

// ==================== CONFIGURACIÓN DEL SISTEMA ====================

// GET - Obtener configuración
app.get('/configuracion', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM configuracion');
        const config = {};
        rows.forEach(row => {
            config[row.clave] = row.valor;
        });
        res.json(config);
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
});

// PUT - Actualizar configuración
app.put('/configuracion', async (req, res) => {
    try {
        const { clave, valor } = req.body;
        const [result] = await promisePool.query(
            'UPDATE configuracion SET valor = ? WHERE clave = ?',
            [valor, clave]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        res.json({ clave, valor });
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({ error: 'Error al actualizar configuración' });
    }
});

// ==================== ALERTAS DE DEVOLUCIÓN PRÓXIMA ====================

// GET - Obtener préstamos próximos a vencer
app.get('/prestamos/proximos-vencer', async (req, res) => {
    try {
        const [config] = await promisePool.query('SELECT valor FROM configuracion WHERE clave = "dias_renovacion"');
        const diasAlerta = config[0] ? parseInt(config[0].valor) : 3;

        const [rows] = await promisePool.query(`
            SELECT
                p.id,
                e.nombre AS estudiante,
                l.nombre AS libro,
                p.fecha_devolucion,
                DATEDIFF(p.fecha_devolucion, CURDATE()) AS dias_restantes
            FROM prestamos p
            INNER JOIN usuarios e ON p.usuario_id = e.id
            INNER JOIN equipos l ON p.equipo_id = l.id
            WHERE p.estado = 'Prestado'
            AND DATEDIFF(p.fecha_devolucion, CURDATE()) <= ?
            AND DATEDIFF(p.fecha_devolucion, CURDATE()) >= 0
            ORDER BY p.fecha_devolucion ASC
        `, [diasAlerta]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener préstamos próximos a vencer:', error);
        res.status(500).json({ error: 'Error al obtener préstamos próximos a vencer' });
    }
});

// ==================== ESTADÍSTICAS ====================

// GET - Obtener estadísticas
app.get('/estadisticas', async (req, res) => {
    try {
        const [totalLibros] = await promisePool.query('SELECT COUNT(*) as total FROM equipos');
        const [librosDisponibles] = await promisePool.query('SELECT SUM(disponibles) as disponibles FROM equipos');
        const [totalEstudiantes] = await promisePool.query('SELECT COUNT(*) as total FROM usuarios');
        const [prestamosActivos] = await promisePool.query('SELECT COUNT(*) as total FROM prestamos WHERE estado = "Prestado"');
        const [reservasPendientes] = await promisePool.query('SELECT COUNT(*) as total FROM reservas WHERE estado = "Pendiente"');

        // Ranking de equipos más prestados
        const [ranking] = await promisePool.query(`
            SELECT
                e.nombre AS equipo,
                a.nombre AS autor,
                COUNT(p.id) AS total_prestamos
            FROM prestamos p
            INNER JOIN equipos e ON p.equipo_id = e.id
            INNER JOIN marcas a ON e.marca_id = a.id
            GROUP BY e.id, e.nombre, a.nombre
            ORDER BY total_prestamos DESC
            LIMIT 10
        `);

        const total = totalLibros[0].total || 0;
        const disponibles = librosDisponibles[0].disponibles || 0;
        const prestados = Math.max(0, total - disponibles);

        res.json({
            totalLibros: total,
            librosDisponibles: disponibles,
            librosPrestados: prestados,
            totalEstudiantes: totalEstudiantes[0].total,
            prestamosActivos: prestamosActivos[0].total,
            reservasPendientes: reservasPendientes[0].total || 0,
            ranking: ranking
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en puerto ${PORT}`);
});
