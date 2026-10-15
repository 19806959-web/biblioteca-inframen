const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const imagenesPorMarca = {
    'Dell': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
    'HP': 'https://images.unsplash.com/photo-158887265757-3d77ad8029a9?w=400&h=300&fit=crop',
    'Lenovo': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'Apple': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    'Amazon': 'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
    'Google': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    'Sony': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'Nueva Marca': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop'
};

async function asignarImagenesMarcas() {
    try {
        console.log('Obteniendo marcas...');
        const [marcas] = await pool.promise().query('SELECT id, nombre FROM marcas');

        console.log(`Encontradas ${marcas.length} marcas`);

        for (const marca of marcas) {
            const imagen = imagenesPorMarca[marca.nombre];

            if (imagen) {
                await pool.promise().query(
                    'UPDATE marcas SET imagen = ? WHERE id = ?',
                    [imagen, marca.id]
                );
                console.log(`✓ Actualizado: ${marca.nombre} -> ${imagen}`);
            } else {
                console.log(`⚠ Sin imagen para: ${marca.nombre}`);
            }
        }

        console.log('\n✅ Imágenes de marcas asignadas exitosamente');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarImagenesMarcas();
