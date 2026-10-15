const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const imagenesPorNombre = {
    'Dell XPS 15': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'HP Pavilion': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'Lenovo ThinkPad': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'iPad Pro': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'Samsung Galaxy Tab': 'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
    'Epson Projector': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    'Canon EOS': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'Test': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
};

async function asignarImagenesEspecificas() {
    try {
        console.log('Obteniendo equipos...');
        const [equipos] = await pool.promise().query('SELECT id, nombre FROM equipos');

        console.log(`Encontrados ${equipos.length} equipos`);

        for (const equipo of equipos) {
            const imagen = imagenesPorNombre[equipo.nombre];

            if (imagen) {
                await pool.promise().query(
                    'UPDATE equipos SET imagen = ? WHERE id = ?',
                    [imagen, equipo.id]
                );
                console.log(`✓ Actualizado: ${equipo.nombre} -> ${imagen}`);
            } else {
                console.log(`⚠ Sin imagen para: ${equipo.nombre}`);
            }
        }

        console.log('\n✅ Imágenes asignadas exitosamente');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarImagenesEspecificas();
