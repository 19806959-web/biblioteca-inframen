import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaPrestamos({ actualizarEstadisticas }) {
    const [prestamos, setPrestamos] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [libros, setLibros] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        estudiante_id: '',
        libro_id: '',
        fecha_prestamo: '',
        fecha_devolucion: '',
        estado: 'Prestado'
    });

    useEffect(() => {
        cargarPrestamos();
        cargarEstudiantes();
        cargarLibros();
    }, []);

    const cargarPrestamos = async () => {
        try {
            const response = await api.get('/prestamos');
            setPrestamos(response.data);
        } catch (error) {
            console.error('Error al cargar préstamos:', error);
        }
    };

    const cargarEstudiantes = async () => {
        try {
            const response = await api.get('/estudiantes');
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    };

    const cargarLibros = async () => {
        try {
            const response = await api.get('/libros');
            setLibros(response.data);
        } catch (error) {
            console.error('Error al cargar libros:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/prestamos', formData);
            setMostrarFormulario(false);
            setFormData({ estudiante_id: '', libro_id: '', fecha_prestamo: '', fecha_devolucion: '', estado: 'Prestado' });
            cargarPrestamos();
            cargarLibros();
            actualizarEstadisticas();
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            alert('Error al crear préstamo: ' + (error.response?.data?.error || 'Error desconocido'));
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/prestamos/${prestamoSeleccionado.id}`, formData);
            setMostrarEditar(false);
            setPrestamoSeleccionado(null);
            setFormData({ estudiante_id: '', libro_id: '', fecha_prestamo: '', fecha_devolucion: '', estado: 'Prestado' });
            cargarPrestamos();
            cargarLibros();
            actualizarEstadisticas();
        } catch (error) {
            console.error('Error al actualizar préstamo:', error);
            alert('Error al actualizar préstamo');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este préstamo?')) {
            try {
                await api.delete(`/prestamos/${id}`);
                cargarPrestamos();
                actualizarEstadisticas();
            } catch (error) {
                console.error('Error al eliminar préstamo:', error);
                alert('Error al eliminar préstamo');
            }
        }
    };

    const handleDevolver = async (prestamo) => {
        if (window.confirm('¿Seguro que deseas marcar este préstamo como devuelto?')) {
            try {
                const fechaDevolucion = new Date().toISOString().split('T')[0];
                const response = await api.put(`/prestamos/${prestamo.id}`, {
                    estudiante_id: prestamo.estudiante_id,
                    libro_id: prestamo.libro_id,
                    fecha_prestamo: prestamo.fecha_prestamo,
                    fecha_devolucion: fechaDevolucion,
                    estado: 'Devuelto'
                });
                if (response.data.multa > 0) {
                    alert(`Devolución registrada. Multa por atraso: $${response.data.multa.toFixed(2)}`);
                }
                cargarPrestamos();
                cargarLibros();
                actualizarEstadisticas();
            } catch (error) {
                console.error('Error al devolver libro:', error);
                alert('Error al devolver libro');
            }
        }
    };

    const handleRenovar = async (prestamo) => {
        if (window.confirm('¿Seguro que deseas renovar este préstamo?')) {
            try {
                await api.put(`/prestamos/${prestamo.id}/renovar`);
                cargarPrestamos();
                alert('Préstamo renovado exitosamente');
            } catch (error) {
                console.error('Error al renovar préstamo:', error);
                alert('Error al renovar préstamo: ' + (error.response?.data?.error || 'Error desconocido'));
            }
        }
    };

    const abrirEditar = (prestamo) => {
        setPrestamoSeleccionado(prestamo);
        setFormData({
            estudiante_id: prestamo.estudiante_id,
            libro_id: prestamo.libro_id,
            fecha_prestamo: prestamo.fecha_prestamo,
            fecha_devolucion: prestamo.fecha_devolucion,
            estado: prestamo.estado
        });
        setMostrarEditar(true);
    };

    const librosDisponibles = libros.filter(libro => libro.disponibles > 0);

    return (
        <div>
            <div className="section-header">
                <h2>Préstamos</h2>
                <button className="btn-primary" onClick={() => setMostrarFormulario(true)}>
                    + Nuevo Préstamo
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Libro</th>
                        <th>Autor</th>
                        <th>Fecha Préstamo</th>
                        <th>Fecha Devolución</th>
                        <th>Estado</th>
                        <th>Renovaciones</th>
                        <th>Multa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {prestamos.map((prestamo) => (
                        <tr key={prestamo.id}>
                            <td>{prestamo.estudiante}</td>
                            <td>{prestamo.libro}</td>
                            <td>{prestamo.autor}</td>
                            <td>{prestamo.fecha_prestamo ? new Date(prestamo.fecha_prestamo).toLocaleDateString('es-ES') : '-'}</td>
                            <td>{prestamo.fecha_devolucion ? new Date(prestamo.fecha_devolucion).toLocaleDateString('es-ES') : '-'}</td>
                            <td>
                                <span className={prestamo.estado === 'Prestado' ? 'estado-agotado' : 'estado-disponible'}>
                                    {prestamo.estado}
                                </span>
                            </td>
                            <td>{prestamo.renovaciones || 0}</td>
                            <td>{prestamo.multa > 0 ? `$${prestamo.multa.toFixed(2)}` : '-'}</td>
                            <td className="actions">
                                {prestamo.estado === 'Prestado' && (
                                    <>
                                        <button className="btn-info" onClick={() => handleRenovar(prestamo)}>
                                            Renovar
                                        </button>
                                        <button className="btn-success" onClick={() => handleDevolver(prestamo)}>
                                            Devolver
                                        </button>
                                    </>
                                )}
                                <button className="btn-warning" onClick={() => abrirEditar(prestamo)}>
                                    Editar
                                </button>
                                <button className="btn-danger" onClick={() => handleEliminar(prestamo.id)}>
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
                            <h2>Nuevo Préstamo</h2>
                            <button className="close-modal" onClick={() => setMostrarFormulario(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Estudiante:</label>
                                <select
                                    value={formData.estudiante_id}
                                    onChange={(e) => setFormData({ ...formData, estudiante_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {estudiantes.map((estudiante) => (
                                        <option key={estudiante.id} value={estudiante.id}>
                                            {estudiante.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Libro:</label>
                                <select
                                    value={formData.libro_id}
                                    onChange={(e) => setFormData({ ...formData, libro_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar libro</option>
                                    {librosDisponibles.map((libro) => (
                                        <option key={libro.id} value={libro.id}>
                                            {libro.titulo} ({libro.disponibles} disponibles)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fecha de Préstamo:</label>
                                <input
                                    type="date"
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => setFormData({ ...formData, fecha_prestamo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Devolución (prevista):</label>
                                <input
                                    type="date"
                                    value={formData.fecha_devolucion}
                                    onChange={(e) => setFormData({ ...formData, fecha_devolucion: e.target.value })}
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
                            <h2>Editar Préstamo</h2>
                            <button className="close-modal" onClick={() => setMostrarEditar(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEditar}>
                            <div className="form-group">
                                <label>Estudiante:</label>
                                <select
                                    value={formData.estudiante_id}
                                    onChange={(e) => setFormData({ ...formData, estudiante_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {estudiantes.map((estudiante) => (
                                        <option key={estudiante.id} value={estudiante.id}>
                                            {estudiante.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Libro:</label>
                                <select
                                    value={formData.libro_id}
                                    onChange={(e) => setFormData({ ...formData, libro_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar libro</option>
                                    {libros.map((libro) => (
                                        <option key={libro.id} value={libro.id}>
                                            {libro.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Fecha de Préstamo:</label>
                                <input
                                    type="date"
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => setFormData({ ...formData, fecha_prestamo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Devolución:</label>
                                <input
                                    type="date"
                                    value={formData.fecha_devolucion}
                                    onChange={(e) => setFormData({ ...formData, fecha_devolucion: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    required
                                >
                                    <option value="Prestado">Prestado</option>
                                    <option value="Devuelto">Devuelto</option>
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

export default ListaPrestamos;
