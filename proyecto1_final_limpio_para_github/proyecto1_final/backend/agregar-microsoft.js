const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const imagenConsistente = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';

async function agregarMicrosoft() {
    try {
        console.log('Agregando marca Microsoft...');
        const [result] = await pool.promise().query(
            'INSERT INTO marcas (nombre, imagen) VALUES (?, ?)',
            ['Microsoft', imagenConsistente]
        );
        console.log(`✓ Marca Microsoft agregada (ID: ${result.insertId})`);
        
        console.log('Agregando Surface Pro 9...');
        await pool.promise().query(
            'INSERT INTO equipos (nombre, marca_id, categoria_id, cantidad, disponibles, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Surface Pro 9', result.insertId, 2, 6, 4, imagenConsistente, 'Bueno']
        );
        console.log('✓ Surface Pro 9 agregado');
        
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

agregarMicrosoft();
