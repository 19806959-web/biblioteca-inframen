const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

const promisePool = pool.promise();

const imagenesPorCategoria = {
    'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    'tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'ipad': 'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
    'proyectores': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    'proyector': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    'cámaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'camaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'camara': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'auriculares': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'teclados': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    'teclado': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    'mouses': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    'monitores': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    'impresoras': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    'impresora': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
    'computadoras': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'computadora': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'pc': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'servidores': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    'servidor': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    'consolas': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    'consola': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    'routers': 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop',
    'router': 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop',
    'discos': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    'disco duro': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    'memorias': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
    'memoria': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
    'microfonos': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop',
    'microfono': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop',
    'altavoces': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
    'altavoz': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
    'webcams': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
    'webcam': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
};

async function actualizarImagenes() {
    try {
        console.log('Obteniendo equipos sin imagen...');
        const [equipos] = await promisePool.query(`
            SELECT e.id, e.nombre, t.nombre as categoria
            FROM equipos e
            INNER JOIN tipos t ON e.categoria_id = t.id
            WHERE e.imagen IS NULL OR e.imagen = ''
        `);

        console.log(`Encontrados ${equipos.length} equipos sin imagen`);

        for (const equipo of equipos) {
            const categoriaLower = equipo.categoria.toLowerCase();
            const imagen = imagenesPorCategoria[categoriaLower] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop';

            await promisePool.query(
                'UPDATE equipos SET imagen = ? WHERE id = ?',
                [imagen, equipo.id]
            );

            console.log(`✓ Actualizado: ${equipo.nombre} (${equipo.categoria})`);
        }

        console.log('\n✅ Todas las imágenes han sido actualizadas exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al actualizar imágenes:', error);
        process.exit(1);
    }
}

actualizarImagenes();
