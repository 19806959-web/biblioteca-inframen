const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Imagen consistente para todos los equipos (laptops)
const imagenConsistente = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';

// Muchos laptops y equipos para agregar
const equiposAAgregar = [
    // Laptops Dell
    { nombre: 'Dell XPS 13', marca_id: 1, categoria_id: 1, cantidad: 5, disponibles: 3 },
    { nombre: 'Dell Inspiron 15', marca_id: 1, categoria_id: 1, cantidad: 8, disponibles: 5 },
    { nombre: 'Dell Latitude 7490', marca_id: 1, categoria_id: 1, cantidad: 10, disponibles: 7 },
    { nombre: 'Dell G15 Gaming', marca_id: 1, categoria_id: 1, cantidad: 6, disponibles: 4 },
    { nombre: 'Dell Alienware m15', marca_id: 1, categoria_id: 1, cantidad: 4, disponibles: 2 },
    { nombre: 'Dell Vostro 3510', marca_id: 1, categoria_id: 1, cantidad: 12, disponibles: 8 },
    
    // Laptops Lenovo
    { nombre: 'Lenovo ThinkPad X1', marca_id: 3, categoria_id: 1, cantidad: 5, disponibles: 3 },
    { nombre: 'Lenovo IdeaPad 3', marca_id: 3, categoria_id: 1, cantidad: 8, disponibles: 6 },
    { nombre: 'Lenovo Legion 5', marca_id: 3, categoria_id: 1, cantidad: 6, disponibles: 4 },
    { nombre: 'Lenovo Yoga 7i', marca_id: 3, categoria_id: 1, cantidad: 7, disponibles: 5 },
    { nombre: 'Lenovo ThinkPad E14', marca_id: 3, categoria_id: 1, cantidad: 10, disponibles: 6 },
    
    // Laptops Apple
    { nombre: 'MacBook Air M2', marca_id: 4, categoria_id: 1, cantidad: 5, disponibles: 3 },
    { nombre: 'MacBook Pro 14', marca_id: 4, categoria_id: 1, cantidad: 4, disponibles: 2 },
    { nombre: 'MacBook Pro 16', marca_id: 4, categoria_id: 1, cantidad: 3, disponibles: 1 },
    { nombre: 'MacBook Air M3', marca_id: 4, categoria_id: 1, cantidad: 6, disponibles: 4 },
    { nombre: 'iMac 24"', marca_id: 4, categoria_id: 1, cantidad: 4, disponibles: 2 },
    
    // Tablets
    { nombre: 'iPad Air 5', marca_id: 4, categoria_id: 2, cantidad: 8, disponibles: 5 },
    { nombre: 'iPad Pro 11"', marca_id: 4, categoria_id: 2, cantidad: 5, disponibles: 3 },
    { nombre: 'iPad Pro 12.9"', marca_id: 4, categoria_id: 2, cantidad: 4, disponibles: 2 },
    { nombre: 'iPad Mini 6', marca_id: 4, categoria_id: 2, cantidad: 10, disponibles: 7 },
    { nombre: 'Galaxy Tab S9', marca_id: 6, categoria_id: 2, cantidad: 6, disponibles: 4 },
    { nombre: 'Galaxy Tab A8', marca_id: 6, categoria_id: 2, cantidad: 8, disponibles: 6 },
    
    // Proyectores
    { nombre: 'Epson PowerLite', marca_id: 7, categoria_id: 3, cantidad: 4, disponibles: 2 },
    { nombre: 'BenQ W1070', marca_id: 8, categoria_id: 3, cantidad: 3, disponibles: 1 },
    { nombre: 'Optoma HD146X', marca_id: 8, categoria_id: 3, cantidad: 5, disponibles: 3 },
    { nombre: 'ViewSonic PA503W', marca_id: 8, categoria_id: 3, cantidad: 4, disponibles: 2 },
    
    // Cámaras
    { nombre: 'Canon EOS R6', marca_id: 7, categoria_id: 4, cantidad: 3, disponibles: 1 },
    { nombre: 'Canon EOS R5', marca_id: 7, categoria_id: 4, cantidad: 4, disponibles: 2 },
    { nombre: 'Sony A7 III', marca_id: 7, categoria_id: 4, cantidad: 3, disponibles: 1 },
    { nombre: 'Nikon Z6 II', marca_id: 8, categoria_id: 4, cantidad: 2, disponibles: 1 },
    { nombre: 'GoPro Hero 11', marca_id: 8, categoria_id: 4, cantidad: 5, disponibles: 3 },
    
    // Componentes
    { nombre: 'Samsung SSD 1TB', marca_id: 6, categoria_id: 5, cantidad: 15, disponibles: 10 },
    { nombre: 'Crucial RAM 16GB', marca_id: 8, categoria_id: 5, cantidad: 20, disponibles: 15 },
    { nombre: 'Western Digital 2TB', marca_id: 8, categoria_id: 5, cantidad: 12, disponibles: 8 },
    { nombre: 'Kingston NVMe 500GB', marca_id: 8, categoria_id: 5, cantidad: 18, disponibles: 12 },
    { nombre: 'Seagate Barracuda 4TB', marca_id: 8, categoria_id: 5, cantidad: 10, disponibles: 7 },
];

async function agregarEquiposMasivos() {
    try {
        console.log('Agregando equipos masivos...');
        
        let agregados = 0;
        for (const equipo of equiposAAgregar) {
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

agregarEquiposMasivos();
