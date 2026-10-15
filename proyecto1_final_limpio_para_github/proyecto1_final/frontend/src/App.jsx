import { useState, useEffect } from 'react';
import { api } from './api';
import ListaLibros from './components/ListaLibros';
import ListaEstudiantes from './components/ListaEstudiantes';
import ListaPrestamos from './components/ListaPrestamos';
import ListaAutores from './components/ListaAutores';
import ListaCategorias from './components/ListaCategorias';
import ListaReservas from './components/ListaReservas';

function App() {
    const [vista, setVista] = useState('dashboard');
    const [estadisticas, setEstadisticas] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [libros, setLibros] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    useEffect(() => {
        cargarEstadisticas();
        cargarCategorias();
        cargarLibros();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const response = await api.get('/estadisticas');
            setEstadisticas(response.data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            const categoriasConImagen = response.data.map(cat => ({
                ...cat,
                imagen: obtenerImagenCategoria(cat.nombre)
            }));
            setCategorias(categoriasConImagen);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const obtenerImagenCategoria = (nombre) => {
        const nombreLower = nombre.toLowerCase();
        const imagenes = {
            'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
            'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
            'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
            'tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
            'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
            'ipad': 'https://images.unsplash.com/photo-1542751111-97427bbecf20?w=400&h=300&fit=crop',
            'proyectores': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
            'proyector': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
            'cámaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
            'camaras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
            'camara': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
            'auriculares': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
            'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
            'teclados': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
            'teclado': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
            'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
            'mouses': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
            'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
            'monitores': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
            'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
            'impresoras': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
            'impresora': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
            'computadoras': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
            'computadora': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
            'pc': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
            'servidores': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
            'servidor': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
            'consolas': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
            'consola': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
            'routers': 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop',
            'router': 'https://images.unsplash.com/photo-1542903660-eedba2cda473?w=400&h=300&fit=crop',
            'discos': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
            'disco duro': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
            'memorias': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
            'memoria': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop',
            'microfonos': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop',
            'microfono': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop',
            'altavoces': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
            'altavoz': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
            'webcams': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
            'webcam': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
        };
        return imagenes[nombreLower] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop';
    };

    const cargarLibros = async () => {
        try {
            const response = await api.get('/libros');
            setLibros(response.data);
        } catch (error) {
            console.error('Error al cargar libros:', error);
        }
    };

    const seleccionarCategoria = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setVista('libros-categoria');
    };

    const obtenerLibrosPorCategoria = (categoriaId) => {
        return libros.filter(libro => libro.categoria_id === categoriaId).slice(0, 4);
    };

    const renderVista = () => {
        switch (vista) {
            case 'dashboard':
                return (
                    <div className="dashboard">
                        <h2>Panel Principal</h2>
                        {estadisticas && (
                            <div className="estadisticas">
                                <div className="estadistica-card">
                                    <h3>Total de Equipos</h3>
                                    <p>{estadisticas.totalLibros}</p>
                                </div>
                                <div className="estadistica-card">
                                    <h3>Equipos Disponibles</h3>
                                    <p>{estadisticas.librosDisponibles}</p>
                                </div>
                                <div className="estadistica-card">
                                    <h3>Equipos Prestados</h3>
                                    <p>{estadisticas.librosPrestados}</p>
                                </div>
                                <div className="estadistica-card">
                                    <h3>Total de Usuarios</h3>
                                    <p>{estadisticas.totalEstudiantes}</p>
                                </div>
                                <div className="estadistica-card">
                                    <h3>Préstamos Activos</h3>
                                    <p>{estadisticas.prestamosActivos}</p>
                                </div>
                            </div>
                        )}
                        <div className="pasillos-con-carrusel">
                            {categorias.map((categoria) => {
                                const librosCategoria = obtenerLibrosPorCategoria(categoria.id);
                                return (
                                    <div key={categoria.id} className="pasillo-section">
                                        <div className="pasillo-header" onClick={() => seleccionarCategoria(categoria)}>
                                            <img
                                                src={categoria.imagen || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop'}
                                                alt={categoria.nombre}
                                                className="pasillo-imagen"
                                            />
                                            <h4>{categoria.nombre}</h4>
                                        </div>
                                        <div className="carrusel-section">
                                            <div className="carrusel-section-header">
                                                <h5>Productos disponibles</h5>
                                            </div>
                                            <div className="carrusel-pasillo">
                                                {librosCategoria.length > 0 ? (
                                                    librosCategoria.map((libro) => (
                                                        <div key={libro.id} className="carrusel-item" onClick={() => { setCategoriaSeleccionada(categoria); setVista('libros-categoria'); }}>
                                                            <img src={libro.imagen || 'https://via.placeholder.com/120x130/4a5568/ffffff?text=📚'} alt={libro.titulo} className="carrusel-imagen" />
                                                            <p className="carrusel-titulo">{libro.titulo}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="sin-libros">No hay equipos disponibles en esta categoría</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'libros':
                return (
                    <div>
                        <ListaLibros actualizarEstadisticas={cargarEstadisticas} />
                    </div>
                );
            case 'libros-categoria':
                return (
                    <div>
                        <button className="btn-secondary" onClick={() => setVista('dashboard')}>← Volver a Pasillos</button>
                        <ListaLibros actualizarEstadisticas={cargarEstadisticas} categoriaFiltro={categoriaSeleccionada} />
                    </div>
                );
            case 'estudiantes':
                return (
                    <div>
                        <ListaEstudiantes />
                    </div>
                );
            case 'prestamos':
                return (
                    <div>
                        <ListaPrestamos actualizarEstadisticas={cargarEstadisticas} />
                    </div>
                );
            case 'autores':
                return (
                    <div>
                        <ListaAutores />
                    </div>
                );
            case 'categorias':
                return (
                    <div>
                        <ListaCategorias />
                    </div>
                );
            case 'reservas':
                return (
                    <div>
                        <ListaReservas />
                    </div>
                );
            default:
                return <div>Vista no encontrada</div>;
        }
    };

    return (
        <div className="app">
            <header>
                <h1>Sistema de Préstamos de Tecnología INFRAMEN</h1>
                <nav>
                    <button onClick={() => setVista('dashboard')} className={vista === 'dashboard' ? 'active' : ''}>Dashboard</button>
                    <button onClick={() => setVista('libros')} className={vista === 'libros' ? 'active' : ''}>Equipos</button>
                    <button onClick={() => setVista('estudiantes')} className={vista === 'estudiantes' ? 'active' : ''}>Usuarios</button>
                    <button onClick={() => setVista('prestamos')} className={vista === 'prestamos' ? 'active' : ''}>Préstamos</button>
                    <button onClick={() => setVista('reservas')} className={vista === 'reservas' ? 'active' : ''}>Reservas</button>
                    <button onClick={() => setVista('autores')} className={vista === 'autores' ? 'active' : ''}>Marcas</button>
                    <button onClick={() => setVista('categorias')} className={vista === 'categorias' ? 'active' : ''}>Tipos</button>
                </nav>
            </header>
            <main>
                {renderVista()}
            </main>
        </div>
    );
}

export default App;
