import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        imagen: ''
    });

    useEffect(() => {
        cargarCategorias();
    }, []);

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
            await api.post('/categorias', formData);
            setMostrarFormulario(false);
            setFormData({ nombre: '' });
            cargarCategorias();
        } catch (error) {
            console.error('Error al crear categoría:', error);
            alert('Error al crear categoría');
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/categorias/${categoriaSeleccionada.id}`, formData);
            setMostrarEditar(false);
            setCategoriaSeleccionada(null);
            setFormData({ nombre: '', imagen: '' });
            cargarCategorias();
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            alert('Error al actualizar categoría');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
            try {
                await api.delete(`/categorias/${id}`);
                cargarCategorias();
            } catch (error) {
                console.error('Error al eliminar categoría:', error);
                alert('Error al eliminar categoría: ' + (error.response?.data?.error || 'Error desconocido'));
            }
        }
    };

    const abrirEditar = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setFormData({ nombre: categoria.nombre, imagen: categoria.imagen || '' });
        setMostrarEditar(true);
    };

    return (
        <div>
            <div className="section-header">
                <h2>Tipos</h2>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>
                    + Nuevo Tipo
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>
                                <img
                                    src={categoria.imagen || 'https://via.placeholder.com/100x100/4a5568/ffffff?text=🏷️'}
                                    alt={categoria.nombre}
                                    className="category-image"
                                />
                            </td>
                            <td>{categoria.id}</td>
                            <td>{categoria.nombre}</td>
                            <td className="actions">
                                <button className="btn-warning" onClick={() => abrirEditar(categoria)}>
                                    Editar
                                </button>
                                <button className="btn-danger" onClick={() => handleEliminar(categoria.id)}>
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
                            <h2>Nuevo Tipo</h2>
                            <button className="close-modal" onClick={() => setMostrarFormulario(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                            <h2>Editar Tipo</h2>
                            <button className="close-modal" onClick={() => setMostrarEditar(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEditar}>
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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

export default ListaCategorias;
