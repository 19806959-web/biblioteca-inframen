const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

(async () => {
    try {
        const [marcas] = await pool.promise().query('SELECT id, nombre, imagen FROM marcas');
        console.log('Marcas y sus imágenes actuales:');
        marcas.forEach(m => console.log(`- ${m.nombre}: ${m.imagen}`));
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
})();
