const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Imágenes diferentes por categoría
const imagenesPorCategoria = {
    'Laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'Proyectores': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    'Cámaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'Cßmaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    'componentes': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop'
};

async function actualizarImagenesPorCategoria() {
    try {
        console.log('Actualizando imágenes por categoría...');
        
        const [equipos] = await pool.promise().query(`
            SELECT e.id, e.nombre, t.nombre as categoria
            FROM equipos e
            INNER JOIN tipos t ON e.categoria_id = t.id
        `);
        
        let actualizados = 0;
        for (const equipo of equipos) {
            const imagen = imagenesPorCategoria[equipo.categoria];
            
            if (imagen) {
                await pool.promise().query(
                    'UPDATE equipos SET imagen = ? WHERE id = ?',
                    [imagen, equipo.id]
                );
                actualizados++;
                console.log(`✓ ${equipo.nombre} (${equipo.categoria})`);
            }
        }
        
        console.log(`\n✅ Total de equipos actualizados: ${actualizados}`);
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

actualizarImagenesPorCategoria();
