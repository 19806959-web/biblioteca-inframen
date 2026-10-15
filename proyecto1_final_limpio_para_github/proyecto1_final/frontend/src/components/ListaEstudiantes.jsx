import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaEstudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        nie: '',
        grado: '',
        seccion: ''
    });

    useEffect(() => {
        cargarEstudiantes();
    }, []);

    const cargarEstudiantes = async () => {
        try {
            const response = await api.get('/estudiantes');
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/estudiantes', formData);
            setMostrarFormulario(false);
            setFormData({ nombre: '', nie: '', grado: '', seccion: '' });
            cargarEstudiantes();
        } catch (error) {
            console.error('Error al crear estudiante:', error);
            alert('Error al crear estudiante');
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/estudiantes/${estudianteSeleccionado.id}`, formData);
            setMostrarEditar(false);
            setEstudianteSeleccionado(null);
            setFormData({ nombre: '', nie: '', grado: '', seccion: '' });
            cargarEstudiantes();
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            alert('Error al actualizar estudiante');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este estudiante?')) {
            try {
                await api.delete(`/estudiantes/${id}`);
                cargarEstudiantes();
            } catch (error) {
                console.error('Error al eliminar estudiante:', error);
                alert('Error al eliminar estudiante: ' + (error.response?.data?.error || 'Error desconocido'));
            }
        }
    };

    const abrirEditar = (estudiante) => {
        setEstudianteSeleccionado(estudiante);
        setFormData({
            nombre: estudiante.nombre,
            nie: estudiante.nie,
            grado: estudiante.grado,
            seccion: estudiante.seccion
        });
        setMostrarEditar(true);
    };

    const verHistorial = async (estudiante) => {
        try {
            const response = await api.get(`/estudiantes/${estudiante.id}/historial`);
            setHistorial(response.data);
            setEstudianteSeleccionado(estudiante);
            setMostrarHistorial(true);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            alert('Error al cargar historial');
        }
    };

    return (
        <div>
            <div className="section-header">
                <h2>Usuarios</h2>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>
                    + Nuevo Usuario
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>NIE</th>
                        <th>Grado</th>
                        <th>Sección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((estudiante) => (
                        <tr key={estudiante.id}>
                            <td>{estudiante.nombre}</td>
                            <td>{estudiante.nie}</td>
                            <td>{estudiante.grado}</td>
                            <td>{estudiante.seccion}</td>
                            <td className="actions">
                                <button className="btn-info" onClick={() => verHistorial(estudiante)}>
                                    Historial
                                </button>
                                <button className="btn-warning" onClick={() => abrirEditar(estudiante)}>
                                    Editar
                                </button>
                                <button className="btn-danger" onClick={() => handleEliminar(estudiante.id)}>
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
                            <h2>Nuevo Usuario</h2>
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
                                <label>NIE:</label>
                                <input
                                    type="text"
                                    value={formData.nie}
                                    onChange={(e) => setFormData({ ...formData, nie: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Grado:</label>
                                <input
                                    type="text"
                                    value={formData.grado}
                                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sección:</label>
                                <input
                                    type="text"
                                    value={formData.seccion}
                                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
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
                            <h2>Editar Usuario</h2>
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
                                <label>NIE:</label>
                                <input
                                    type="text"
                                    value={formData.nie}
                                    onChange={(e) => setFormData({ ...formData, nie: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Grado:</label>
                                <input
                                    type="text"
                                    value={formData.grado}
                                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sección:</label>
                                <input
                                    type="text"
                                    value={formData.seccion}
                                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
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

            {mostrarHistorial && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Historial de Préstamos - {estudianteSeleccionado?.nombre}</h2>
                            <button className="close-modal" onClick={() => setMostrarHistorial(false)}>
                                ×
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Equipo</th>
                                        <th>Marca</th>
                                        <th>Fecha Préstamo</th>
                                        <th>Fecha Devolución</th>
                                        <th>Estado</th>
                                        <th>Renovaciones</th>
                                        <th>Multa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.length > 0 ? (
                                        historial.map((prestamo) => (
                                            <tr key={prestamo.id}>
                                                <td>{prestamo.equipo}</td>
                                                <td>{prestamo.autor}</td>
                                                <td>{prestamo.fecha_prestamo ? new Date(prestamo.fecha_prestamo).toLocaleDateString() : '-'}</td>
                                                <td>{prestamo.fecha_devolucion ? new Date(prestamo.fecha_devolucion).toLocaleDateString() : '-'}</td>
                                                <td>
                                                    <span className={`badge ${prestamo.estado === 'Devuelto' ? 'badge-success' : 'badge-warning'}`}>
                                                        {prestamo.estado}
                                                    </span>
                                                </td>
                                                <td>{prestamo.renovaciones || 0}</td>
                                                <td>{prestamo.multa > 0 ? `$${prestamo.multa.toFixed(2)}` : '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No hay préstamos registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaEstudiantes;
