const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Logos PNG directos de fuentes confiables
const logosMarcasPNG = {
    'Dell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dell_Logo.png/400px-Dell_Logo.png',
    'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Lenovo_2015.svg/400px-Lenovo_2015.svg.png',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/400px-Apple_logo_white.svg.png',
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/400px-Google_2015_logo.svg.png',
    'Sony': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Sony_2021.svg/400px-Sony_2021.svg.png',
    'Nueva Marca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Brand_generic.svg/400px-Brand_generic.svg.png'
};

async function asignarLogosMarcasPNG() {
    try {
        console.log('Actualizando logos PNG de marcas...');
        const [marcas] = await pool.promise().query('SELECT id, nombre FROM marcas');

        console.log(`Encontradas ${marcas.length} marcas`);

        for (const marca of marcas) {
            const logo = logosMarcasPNG[marca.nombre];

            if (logo) {
                await pool.promise().query(
                    'UPDATE marcas SET imagen = ? WHERE id = ?',
                    [logo, marca.id]
                );
                console.log(`✓ Logo PNG actualizado: ${marca.nombre}`);
            } else {
                console.log(`⚠ Sin logo para: ${marca.nombre}`);
            }
        }

        console.log('\n✅ Logos PNG de marcas actualizados');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarLogosMarcasPNG();
