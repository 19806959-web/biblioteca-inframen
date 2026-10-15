import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaAutores() {
    const [autores, setAutores] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [autorSeleccionado, setAutorSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        imagen: ''
    });

    useEffect(() => {
        cargarAutores();
    }, []);

    const cargarAutores = async () => {
        try {
            const response = await api.get('/autores');
            setAutores(response.data);
        } catch (error) {
            console.error('Error al cargar autores:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/autores', formData);
            setMostrarFormulario(false);
            setFormData({ nombre: '', imagen: '' });
            cargarAutores();
        } catch (error) {
            console.error('Error al crear autor:', error);
            alert('Error al crear marca');
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/autores/${autorSeleccionado.id}`, formData);
            setMostrarEditar(false);
            setAutorSeleccionado(null);
            setFormData({ nombre: '', imagen: '' });
            cargarAutores();
        } catch (error) {
            console.error('Error al actualizar autor:', error);
            alert('Error al actualizar marca');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este autor?')) {
            try {
                await api.delete(`/autores/${id}`);
                cargarAutores();
            } catch (error) {
                console.error('Error al eliminar autor:', error);
                alert('Error al eliminar autor: ' + (error.response?.data?.error || 'Error desconocido'));
            }
        }
    };

    const abrirEditar = (autor) => {
        setAutorSeleccionado(autor);
        setFormData({ nombre: autor.nombre, imagen: autor.imagen || '' });
        setMostrarEditar(true);
    };

    return (
        <div>
            <div className="section-header">
                <h2>Marcas</h2>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>
                    + Nueva Marca
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {autores.map((autor) => (
                        <tr key={autor.id}>
                            <td>
                                <img
                                    src={autor.imagen || 'https://via.placeholder.com/100x100/4a5568/ffffff?text=👤'}
                                    alt={autor.nombre}
                                    className="author-photo"
                                />
                            </td>
                            <td>{autor.id}</td>
                            <td>{autor.nombre}</td>
                            <td className="actions">
                                <button className="btn-warning" onClick={() => abrirEditar(autor)}>
                                    Editar
                                </button>
                                <button className="btn-danger" onClick={() => handleEliminar(autor.id)}>
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
                            <h2>Nueva Marca</h2>
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
                                <label>URL de Foto (opcional):</label>
                                <input
                                    type="url"
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    placeholder="https://ejemplo.com/foto.jpg"
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
                            <h2>Editar Marca</h2>
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
                                <label>URL de Foto (opcional):</label>
                                <input
                                    type="url"
                                    value={formData.imagen}
                                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                    placeholder="https://ejemplo.com/foto.jpg"
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

export default ListaAutores;
