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

const masEquipos = [
    // Más Laptops Dell
    { nombre: 'Dell XPS 15', marca_id: 1, categoria_id: 1, cantidad: 5, disponibles: 3 },
    { nombre: 'Dell Inspiron 14', marca_id: 1, categoria_id: 1, cantidad: 7, disponibles: 4 },
    { nombre: 'Dell Latitude 5420', marca_id: 1, categoria_id: 1, cantidad: 8, disponibles: 5 },
    { nombre: 'Dell G16 Gaming', marca_id: 1, categoria_id: 1, cantidad: 4, disponibles: 2 },
    { nombre: 'Dell Alienware x14', marca_id: 1, categoria_id: 1, cantidad: 3, disponibles: 1 },
    { nombre: 'Dell Precision 5560', marca_id: 1, categoria_id: 1, cantidad: 4, disponibles: 2 },
    
    // Más Laptops Lenovo
    { nombre: 'Lenovo ThinkPad T14', marca_id: 3, categoria_id: 1, cantidad: 6, disponibles: 4 },
    { nombre: 'Lenovo IdeaPad 5', marca_id: 3, categoria_id: 1, cantidad: 7, disponibles: 5 },
    { nombre: 'Lenovo Legion 7', marca_id: 3, categoria_id: 1, cantidad: 5, disponibles: 3 },
    { nombre: 'Lenovo Yoga 9i', marca_id: 3, categoria_id: 1, cantidad: 4, disponibles: 2 },
    { nombre: 'Lenovo ThinkPad P15', marca_id: 3, categoria_id: 1, cantidad: 5, disponibles: 3 },
    
    // Más Laptops Apple
    { nombre: 'MacBook Pro 13"', marca_id: 4, categoria_id: 1, cantidad: 6, disponibles: 4 },
    { nombre: 'MacBook Air 13"', marca_id: 4, categoria_id: 1, cantidad: 8, disponibles: 6 },
    { nombre: 'Mac Studio', marca_id: 4, categoria_id: 1, cantidad: 3, disponibles: 1 },
    { nombre: 'Mac mini M2', marca_id: 4, categoria_id: 1, cantidad: 5, disponibles: 3 },
    
    // Más Tablets
    { nombre: 'iPad 10"', marca_id: 4, categoria_id: 2, cantidad: 10, disponibles: 7 },
    { nombre: 'iPad 9"', marca_id: 4, categoria_id: 2, cantidad: 12, disponibles: 9 },
    { nombre: 'Galaxy Tab S8', marca_id: 6, categoria_id: 2, cantidad: 5, disponibles: 3 },
    { nombre: 'Galaxy Tab S7', marca_id: 6, categoria_id: 2, cantidad: 4, disponibles: 2 },
    { nombre: 'Surface Pro 9', marca_id: 8, categoria_id: 2, cantidad: 6, disponibles: 4 },
    
    // Más Proyectores
    { nombre: 'Epson Home Cinema', marca_id: 7, categoria_id: 3, cantidad: 4, disponibles: 2 },
    { nombre: 'BenQ TH671ST', marca_id: 10, categoria_id: 3, cantidad: 3, disponibles: 1 },
    { nombre: 'Optoma UHD38', marca_id: 11, categoria_id: 3, cantidad: 4, disponibles: 2 },
    
    // Más Cámaras
    { nombre: 'Canon EOS R7', marca_id: 7, categoria_id: 4, cantidad: 3, disponibles: 1 },
    { nombre: 'Canon EOS 90D', marca_id: 7, categoria_id: 4, cantidad: 4, disponibles: 2 },
    { nombre: 'Sony A7 IV', marca_id: 7, categoria_id: 4, cantidad: 3, disponibles: 1 },
    { nombre: 'Sony ZV-E10', marca_id: 7, categoria_id: 4, cantidad: 5, disponibles: 3 },
    { nombre: 'Nikon Z50', marca_id: 13, categoria_id: 4, cantidad: 4, disponibles: 2 },
    
    // Más Componentes
    { nombre: 'Samsung SSD 2TB', marca_id: 6, categoria_id: 5, cantidad: 12, disponibles: 8 },
    { nombre: 'Samsung SSD 500GB', marca_id: 6, categoria_id: 5, cantidad: 15, disponibles: 10 },
    { nombre: 'Crucial RAM 32GB', marca_id: 15, categoria_id: 5, cantidad: 18, disponibles: 12 },
    { nombre: 'Crucial RAM 8GB', marca_id: 15, categoria_id: 5, cantidad: 25, disponibles: 18 },
    { nombre: 'Western Digital 1TB', marca_id: 16, categoria_id: 5, cantidad: 14, disponibles: 10 },
    { nombre: 'Kingston NVMe 1TB', marca_id: 17, categoria_id: 5, cantidad: 16, disponibles: 11 },
    { nombre: 'Kingston NVMe 2TB', marca_id: 17, categoria_id: 5, cantidad: 10, disponibles: 7 },
    { nombre: 'Seagate External 2TB', marca_id: 18, categoria_id: 5, cantidad: 12, disponibles: 8 },
];

async function agregarMasEquipos() {
    try {
        console.log('Agregando más equipos...');
        
        let agregados = 0;
        for (const equipo of masEquipos) {
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

agregarMasEquipos();
