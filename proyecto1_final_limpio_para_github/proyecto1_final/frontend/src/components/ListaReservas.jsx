import { useState, useEffect } from 'react';
import { api } from '../api';

function ListaReservas() {
    const [reservas, setReservas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        usuario_id: '',
        equipo_id: ''
    });
    const [estudiantes, setEstudiantes] = useState([]);
    const [libros, setLibros] = useState([]);

    useEffect(() => {
        cargarReservas();
        cargarEstudiantes();
        cargarLibros();
    }, []);

    const cargarReservas = async () => {
        try {
            const response = await api.get('/reservas');
            setReservas(response.data);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
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
            await api.post('/reservas', formData);
            setShowModal(false);
            setFormData({ usuario_id: '', equipo_id: '' });
            cargarReservas();
        } catch (error) {
            console.error('Error al crear reserva:', error);
            alert(error.response?.data?.error || 'Error al crear reserva');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
            try {
                await api.delete(`/reservas/${id}`);
                cargarReservas();
            } catch (error) {
                console.error('Error al eliminar reserva:', error);
            }
        }
    };

    const handleEstadoChange = async (id, nuevoEstado) => {
        try {
            await api.put(`/reservas/${id}`, { estado: nuevoEstado });
            cargarReservas();
        } catch (error) {
            console.error('Error al actualizar reserva:', error);
        }
    };

    const getEstadoBadge = (estado) => {
        const estilos = {
            'Pendiente': 'badge-warning',
            'Notificado': 'badge-info',
            'Cancelada': 'badge-danger',
            'Completada': 'badge-success'
        };
        return estilos[estado] || 'badge-secondary';
    };

    return (
        <div className="lista-container">
            <div className="lista-header">
                <h2>Gestión de Reservas</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Nueva Reserva
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Estudiante</th>
                            <th>NIE</th>
                            <th>Equipo</th>
                            <th>Fecha Reserva</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{reserva.id}</td>
                                <td>{reserva.estudiante}</td>
                                <td>{reserva.nie}</td>
                                <td>{reserva.equipo}</td>
                                <td>{new Date(reserva.fecha_reserva).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${getEstadoBadge(reserva.estado)}`}>
                                        {reserva.estado}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={reserva.estado}
                                        onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                                        className="action-select"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Notificado">Notificado</option>
                                        <option value="Cancelada">Cancelada</option>
                                        <option value="Completada">Completada</option>
                                    </select>
                                    <button
                                        className="btn-danger btn-sm"
                                        onClick={() => handleDelete(reserva.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Nueva Reserva</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Estudiante:</label>
                                <select
                                    value={formData.usuario_id}
                                    onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {estudiantes.map((est) => (
                                        <option key={est.id} value={est.id}>{est.nombre} - {est.nie}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Equipo:</label>
                                <select
                                    value={formData.equipo_id}
                                    onChange={(e) => setFormData({ ...formData, equipo_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar equipo</option>
                                    {libros.filter(l => l.disponibles === 0).map((lib) => (
                                        <option key={lib.id} value={lib.id}>{lib.titulo} (Sin disponibilidad)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Reserva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaReservas;
