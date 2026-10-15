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

const equiposRestantes = [
    { nombre: 'BenQ W1070', marca_id: 10, categoria_id: 3, cantidad: 3, disponibles: 1 },
    { nombre: 'Optoma HD146X', marca_id: 11, categoria_id: 3, cantidad: 5, disponibles: 3 },
    { nombre: 'ViewSonic PA503W', marca_id: 12, categoria_id: 3, cantidad: 4, disponibles: 2 },
    { nombre: 'Nikon Z6 II', marca_id: 13, categoria_id: 4, cantidad: 2, disponibles: 1 },
    { nombre: 'GoPro Hero 11', marca_id: 14, categoria_id: 4, cantidad: 5, disponibles: 3 },
    { nombre: 'Crucial RAM 16GB', marca_id: 15, categoria_id: 5, cantidad: 20, disponibles: 15 },
    { nombre: 'Western Digital 2TB', marca_id: 16, categoria_id: 5, cantidad: 12, disponibles: 8 },
    { nombre: 'Kingston NVMe 500GB', marca_id: 17, categoria_id: 5, cantidad: 18, disponibles: 12 },
    { nombre: 'Seagate Barracuda 4TB', marca_id: 18, categoria_id: 5, cantidad: 10, disponibles: 7 },
];

async function agregarEquiposRestantes() {
    try {
        console.log('Agregando equipos restantes...');
        
        let agregados = 0;
        for (const equipo of equiposRestantes) {
            try {
                await pool.promise().query(
                    'INSERT INTO equipos (nombre, marca_id, categoria_id, cantidad, disponibles, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [equipo.nombre, equipo.marca_id, equipo.categoria_id, equipo.cantidad, equipo.disponibles, imagenConsistente, 'Bueno']
                );
                agregados++;
                console.log(`✓ Agregado: ${equipo.nombre}`);
            } catch (error) {
                console.error(`✗ Error al agregar ${equipo.nombre}:`, error.message);
            }
        }

        console.log(`\n✅ Total de equipos agregados: ${agregados}`);
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

agregarEquiposRestantes();
