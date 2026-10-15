const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Múltiples imágenes por categoría para que no se repitan
const imagenesPorCategoria = {
    'Laptops': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-158887265757-3d77ad8029a9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504222490345-c075b6008014?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1497250681960-ef049c0d16fb?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    ],
    'Tablets': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531297461086-d2dce1b7d3a2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=300&fit=crop',
    ],
    'Proyectores': [
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
    ],
    'Cámaras': [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop',
    ],
    'Cßmaras': [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    ],
    'componentes': [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
    ]
};

async function actualizarImagenesUnicas() {
    try {
        console.log('Actualizando imágenes únicas por equipo...');
        
        const [equipos] = await pool.promise().query(`
            SELECT e.id, e.nombre, t.nombre as categoria
            FROM equipos e
            INNER JOIN tipos t ON e.categoria_id = t.id
            ORDER BY t.nombre, e.id
        `);
        
        let actualizados = 0;
        const contadorPorCategoria = {};
        
        for (const equipo of equipos) {
            const categoria = equipo.categoria;
            const imagenes = imagenesPorCategoria[categoria];
            
            if (imagenes && imagenes.length > 0) {
                // Inicializar contador si no existe
                if (!contadorPorCategoria[categoria]) {
                    contadorPorCategoria[categoria] = 0;
                }
                
                // Obtener imagen cíclicamente
                const imagen = imagenes[contadorPorCategoria[categoria] % imagenes.length];
                
                await pool.promise().query(
                    'UPDATE equipos SET imagen = ? WHERE id = ?',
                    [imagen, equipo.id]
                );
                
                actualizados++;
                contadorPorCategoria[categoria]++;
                console.log(`✓ ${equipo.nombre} (${categoria}) - Imagen #${contadorPorCategoria[categoria]}`);
            }
        }
        
        console.log(`\n✅ Total de equipos actualizados: ${actualizados}`);
        console.log('\nContador por categoría:');
        Object.entries(contadorPorCategoria).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} imágenes asignadas`);
        });
        
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

actualizarImagenesUnicas();
