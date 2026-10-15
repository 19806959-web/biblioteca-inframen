const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Logos PNG de alta calidad
const logosMarcasStock = {
    'Dell': 'https://logo.clearbit.com/dell-logo-800x600.png',
    'Lenovo': 'https://logo.clearbit.com/lenovo-logo-800x600.png',
    'Apple': 'https://logo.clearbit.com/apple-logo-800x600.png',
    'Google': 'https://logo.clearbit.com/google-logo-800x600.png',
    'Sony': 'https://logo.clearbit.com/sony-logo-800x600.png',
    'Nueva Marca': 'https://logo.clearbit.com/placeholder-logo-800x600.png'
};

async function asignarLogosStock() {
    try {
        console.log('Actualizando logos de stock...');
        const [marcas] = await pool.promise().query('SELECT id, nombre FROM marcas');

        console.log(`Encontradas ${marcas.length} marcas`);

        for (const marca of marcas) {
            const logo = logosMarcasStock[marca.nombre];

            if (logo) {
                await pool.promise().query(
                    'UPDATE marcas SET imagen = ? WHERE id = ?',
                    [logo, marca.id]
                );
                console.log(`✓ Logo actualizado: ${marca.nombre}`);
            } else {
                console.log(`⚠ Sin logo para: ${marca.nombre}`);
            }
        }

        console.log('\n✅ Logos actualizados');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarLogosStock();
