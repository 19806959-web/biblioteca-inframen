const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Logos oficiales de Wikimedia Commons (licencias permisivas)
const logosMarcas = {
    'Dell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Dell_Logo.png/600px-Dell_Logo.png',
    'HP': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/HP_logo_2012.svg/600px-HP_logo_2012.svg.png',
    'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/600px-Lenovo_logo_2015.svg.png',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/600px-Apple_logo_black.svg.png',
    'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/600px-Amazon_logo.svg.png',
    'Google': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/600px-Google_2015_logo.svg.png',
    'Sony': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Sony_logo.svg/600px-Sony_logo.svg.png',
    'Nueva Marca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Logo_Generic.svg/600px-Logo_Generic.svg.png'
};

async function asignarLogosMarcas() {
    try {
        console.log('Actualizando logos de marcas...');
        const [marcas] = await pool.promise().query('SELECT id, nombre FROM marcas');

        console.log(`Encontradas ${marcas.length} marcas`);

        for (const marca of marcas) {
            const logo = logosMarcas[marca.nombre];

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

        console.log('\n✅ Logos de marcas actualizados exitosamente');
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

asignarLogosMarcas();
