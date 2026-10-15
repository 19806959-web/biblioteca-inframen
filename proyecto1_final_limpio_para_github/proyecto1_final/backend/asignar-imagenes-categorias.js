const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const imagenesPorCategoria = {
    'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'Proyectores': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    'Cámaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'Cßmaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'componentes': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop'
};

async function asignarImagenesCategorias() {
    try {
        console.log('Obteniendo categorías...');
        const [categorias] = await pool.promise().query('SELECT id, nombre FROM tipos');

        console.log(`Encontradas ${categorias.length} categorías`);

        for (const categoria of categorias) {
            const imagen = imagenesPorCategoria[categoria.nombre];

            if (imagen) {
                await pool.promise().query(
                    'UPDATE tipos SET imagen = ? WHERE id = ?',
                    [imagen, categoria.id]
                );
                console.log(`✓ Actualizado: ${categoria.nombre} -> ${imagen}`);
            } else {
                console.log(`⚠ Sin imagen para: ${categoria.nombre}`);
            }
        }

        console.log('\n✅ Imágenes de categorías asignadas exitosamente');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarImagenesCategorias();
