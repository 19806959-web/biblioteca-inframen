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
        const [categorias] = await pool.promise().query('SELECT id, nombre FROM tipos');
        console.log('Categorías en la base de datos:');
        categorias.forEach(c => console.log(`- ID: ${c.id}, Nombre: ${c.nombre}`));
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
})();
