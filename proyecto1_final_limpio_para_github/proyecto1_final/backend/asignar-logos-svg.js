const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Logos SVG directos de Wikipedia (más confiables)
const logosMarcasSVG = {
    'Dell': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Dell_Logo.png',
    'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Lenovo_2015.svg',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'Sony': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Sony_2021.svg',
    'Nueva Marca': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Brand_generic.svg'
};

async function asignarLogosSVG() {
    try {
        console.log('Actualizando logos SVG de marcas...');
        const [marcas] = await pool.promise().query('SELECT id, nombre FROM marcas');

        console.log(`Encontradas ${marcas.length} marcas`);

        for (const marca of marcas) {
            const logo = logosMarcasSVG[marca.nombre];

            if (logo) {
                await pool.promise().query(
                    'UPDATE marcas SET imagen = ? WHERE id = ?',
                    [logo, marca.id]
                );
                console.log(`✓ Logo SVG actualizado: ${marca.nombre}`);
            } else {
                console.log(`⚠ Sin logo para: ${marca.nombre}`);
            }
        }

        console.log('\n✅ Logos SVG actualizados');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarLogosSVG();
