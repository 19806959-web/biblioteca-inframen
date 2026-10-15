import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaLibros({ actualizarEstadisticas, categoriaFiltro }) {
    const [libros, setLibros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroAutor, setFiltroAutor] = useState('');
    const [filtroDisponible, setFiltroDisponible] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        autor_id: '',
        categoria_id: '',
        cantidad: 1,
        disponibles: 1,
        imagen: '',
        estado: 'Bueno'
    });

    useEffect(() => {
        cargarLibros();
        cargarAutores();
        cargarCategorias();
    }, [categoriaFiltro, filtroCategoria, filtroAutor, filtroDisponible]);

    const cargarLibros = async () => {
        try {
            const params = {};
            if (filtroCategoria) params.categoria = filtroCategoria;
            if (filtroAutor) params.autor = filtroAutor;
            if (filtroDisponible) params.disponible = 'true';

            const response = await api.get('/libros', { params });
            let librosFiltrados = response.data;
            if (categoriaFiltro) {
                librosFiltrados = librosFiltrados.filter(libro => libro.categoria_id === categoriaFiltro.id);
            }
            setLibros(librosFiltrados);
        } catch (error) {
            console.error('Error al cargar libros:', error);
        }
    };

    const cargarAutores = async () => {
        try {
            const response = await api.get('/autores');
            setAutores(response.data);
        } catch (error) {
            console.error('Error al cargar autores:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                titulo: formData.titulo,
                marca_id: formData.autor_id,
                categoria_id: formData.categoria_id,
                cantidad: formData.cantidad,
                disponibles: formData.disponibles,
                imagen: formData.imagen,
                estado: formData.estado
            };
            await api.post('/libros', dataToSend);
            setMostrarFormulario(false);
            setFormData({ titulo: '', autor_id: '', categoria_id: '', cantidad: 1, disponibles: 1, imagen: '', estado: 'Bueno' });
            cargarLibros();
            actualizarEstadisticas();
        } catch (error) {
            console.error('Error al crear libro:', error);
            alert('Error al crear libro');
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                titulo: formData.titulo,
                marca_id: formData.autor_id,
                categoria_id: formData.categoria_id,
                cantidad: formData.cantidad,
                disponibles: formData.disponibles,
                imagen: formData.imagen,
                estado: formData.estado
            };
            await api.put(`/libros/${libroSeleccionado.id}`, dataToSend);
            setMostrarEditar(false);
            setLibroSeleccionado(null);
            setFormData({ titulo: '', autor_id: '', categoria_id: '', cantidad: 1, disponibles: 1, imagen: '', estado: 'Bueno' });
            cargarLibros();
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            alert('Error al actualizar libro');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este libro?')) {
            try {
                await api.delete(`/libros/${id}`);
                cargarLibros();
                actualizarEstadisticas();
            } catch (error) {
                console.error('Error al eliminar libro:', error);
                alert('Error al eliminar libro: ' + (error.response?.data?.error || 'Error desconocido'));
            }
        }
    };

    const abrirEditar = (libro) => {
        setLibroSeleccionado(libro);
        setFormData({
            titulo: libro.titulo,
            autor_id: libro.marca_id,
            categoria_id: libro.categoria_id,
            cantidad: libro.cantidad,
            disponibles: libro.disponibles,
            imagen: libro.imagen || '',
            estado: libro.estado || 'Bueno'
        });
        setMostrarEditar(true);
    };

    const librosFiltrados = libros.filter(libro =>
        libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
        libro.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <div className="section-header">
                <h2>Equipos</h2>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>
                    + Nuevo Equipo
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre, marca o tipo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
                <select
                    value={filtroAutor}
                    onChange={(e) => setFiltroAutor(e.target.value)}
                >
                    <option value="">Todas las marcas</option>
                    {autores.map((aut) => (
                        <option key={aut.id} value={aut.id}>{aut.nombre}</option>
                    ))}
                </select>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={filtroDisponible}
                        onChange={(e) => setFiltroDisponible(e.target.checked)}
                    />
                    Solo disponibles
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Disponibles</th>
                        <th>Estado Equipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {librosFiltrados.map((libro) => (
                        <tr key={libro.id}>
                            <td>
                                <img
                                    src={libro.imagen || 'https://via.placeholder.com/50x70/4a5568/ffffff?text=📚'}
                                    alt={libro.titulo}
                                    className="book-cover"
                                />
                            </td>
                            <td>{libro.titulo}</td>
                            <td>{libro.autor}</td>
                            <td>{libro.categoria}</td>
                            <td style={{ maxWidth: '300px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{libro.descripcion}</td>
                            <td>{libro.cantidad}</td>
                            <td>{libro.disponibles}</td>
                            <td>
                                <span className={`estado-badge estado-${libro.estado?.toLowerCase() || 'bueno'}`}>
                                    {libro.estado || 'Bueno'}
                                </span>
                            </td>
                            <td className="actions">
                                <button className="btn-warning" onClick={() => abrirEditar(libro)}>
                                    Editar
                                </button>
                                <button className="btn-danger" onClick={() => handleEliminar(libro.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarFormulario && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Nuevo Equipo</h2>
                            <button className="close-modal" onClick={() => setMostrarFormulario(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Marca:</label>
                                <select
                                    value={formData.autor_id}
                                    onChange={(e) => setFormData({ ...formData, autor_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar marca</option>
                                    {autores.map((autor) => (
                                        <option key={autor.id} value={autor.id}>
                                            {autor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tipo:</label>
                                <select
                                    value={formData.categoria_id}
                                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cantidad:</label>
                                <input
                                    type="number"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Disponibles:</label>
                                <input
                                    type="number"
                                    value={formData.disponibles}
                                    onChange={(e) => setFormData({ ...formData, disponibles: parseInt(e.target.value) })}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen (opcional):</label>
                                <input
                                    type="url"
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    required
                                >
                                    <option value="Bueno">Bueno</option>
                                    <option value="Dañado">Dañado</option>
                                    <option value="En reparación">En reparación</option>
                                    <option value="Perdido">Perdido</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Guardar</button>
                                <button type="button" className="btn-secondary" onClick={() => setMostrarFormulario(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarEditar && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Editar Equipo</h2>
                            <button className="close-modal" onClick={() => setMostrarEditar(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEditar}>
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Marca:</label>
                                <select
                                    value={formData.autor_id}
                                    onChange={(e) => setFormData({ ...formData, autor_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar marca</option>
                                    {autores.map((autor) => (
                                        <option key={autor.id} value={autor.id}>
                                            {autor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tipo:</label>
                                <select
                                    value={formData.categoria_id}
                                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Cantidad:</label>
                                <input
                                    type="number"
                                    value={formData.cantidad}
                                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Disponibles:</label>
                                <input
                                    type="number"
                                    value={formData.disponibles}
                                    onChange={(e) => setFormData({ ...formData, disponibles: parseInt(e.target.value) })}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen (opcional):</label>
                                <input
                                    type="url"
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    required
                                >
                                    <option value="Bueno">Bueno</option>
                                    <option value="Dañado">Dañado</option>
                                    <option value="En reparación">En reparación</option>
                                    <option value="Perdido">Perdido</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Actualizar</button>
                                <button type="button" className="btn-secondary" onClick={() => setMostrarEditar(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaLibros;
