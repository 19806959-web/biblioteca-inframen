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
        const [equipos] = await pool.promise().query('SELECT COUNT(*) as total FROM equipos');
        const [marcas] = await pool.promise().query('SELECT COUNT(*) as total FROM marcas');
        const [categorias] = await pool.promise().query('SELECT COUNT(*) as total FROM tipos');
        
        console.log('=== ESTADO ACTUAL DE LA BASE DE DATOS ===');
        console.log(`Total de equipos: ${equipos[0].total}`);
        console.log(`Total de marcas: ${marcas[0].total}`);
        console.log(`Total de categorías: ${categorias[0].total}`);
        
        console.log('\n=== EQUIPOS POR CATEGORÍA ===');
        const [porCategoria] = await pool.promise().query(`
            SELECT t.nombre as categoria, COUNT(*) as total
            FROM equipos e
            INNER JOIN tipos t ON e.categoria_id = t.id
            GROUP BY t.nombre
        `);
        porCategoria.forEach(c => console.log(`${c.categoria}: ${c.total} equipos`));
        
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
})();
