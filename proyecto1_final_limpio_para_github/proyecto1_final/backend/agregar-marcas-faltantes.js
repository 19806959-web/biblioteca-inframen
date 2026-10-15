const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

const marcasAAgregar = [
    { nombre: 'BenQ', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Optoma', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'ViewSonic', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Nikon', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'GoPro', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Crucial', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Western Digital', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Kingston', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
    { nombre: 'Seagate', imagen: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop' },
];

async function agregarMarcas() {
    try {
        console.log('Agregando marcas faltantes...');
        
        let agregadas = 0;
        for (const marca of marcasAAgregar) {
            try {
                const [result] = await pool.promise().query(
                    'INSERT INTO marcas (nombre, imagen) VALUES (?, ?)',
                    [marca.nombre, marca.imagen]
                );
                agregadas++;
                console.log(`✓ Agregada marca: ${marca.nombre} (ID: ${result.insertId})`);
            } catch (error) {
                console.error(`✗ Error al agregar ${marca.nombre}:`, error.message);
            }
        }

        console.log(`\n✅ Total de marcas agregadas: ${agregadas}`);
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

agregarMarcas();
