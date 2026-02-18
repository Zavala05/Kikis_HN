import { useState, useEffect } from 'react';
import supabase from '../../supabase.js';
import './admin_orders.css'; 

export default function AdminPanel() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');

    // Función para cargar los pedidos
    const fetchPedidos = async () => {
        try {
            setLoading(true);
            // Traemos todos los datos, ordenados por fecha de creación (descendente)
            const { data, error } = await supabase
                .from('usuarios_compras')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPedidos(data);
        } catch (error) {
            console.error('Error cargando pedidos:', error.message);
            alert('Error al cargar la lista de pedidos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    // Función para actualizar el estado del pedido en Supabase
    const handleUpdateStatus = async (id, nuevoEstado) => {
        try {
            const { error } = await supabase
                .from('usuarios_compras')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;

            // Actualizamos el estado localmente para que se refleje rápido sin recargar
            setPedidos(prevPedidos => 
                prevPedidos.map(pedido => 
                    pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
                )
            );
        } catch (error) {
            console.error('Error actualizando estado:', error);
            alert('No se pudo actualizar el estado.');
        }
    };

    // Función auxiliar para calcular el total de la venta sumando los productos del JSON
    const calcularTotal = (productosJSON) => {
        if (!productosJSON || !Array.isArray(productosJSON)) return 0;
        return productosJSON.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    // Función para formatear la fecha
    const formatearFecha = (fechaString) => {
        if (!fechaString) return '-';
        return new Date(fechaString).toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Filtrar pedidos según selección
    const pedidosFiltrados = filtroEstado === 'todos' 
        ? pedidos 
        : pedidos.filter(p => (p.estado || 'Pendiente') === filtroEstado);

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>Panel de Ventas</h1>
                <div className="filters">
                    <label>Filtrar por estado:</label>
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
            </header>

            {loading ? (
                <div className="loading">Cargando ventas...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Detalle Pedido (Productos)</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{formatearFecha(pedido.created_at)}</td>
                                    <td>
                                        <strong>{pedido.nombre}</strong><br/>
                                        <small>{pedido.telefono}</small><br/>
                                        <small className="direccion-text">{pedido.direccion}</small>
                                    </td>
                                    <td>
                                        <ul className="product-list">
                                            {pedido.productos && pedido.productos.map((prod, index) => (
                                                <li key={index}>
                                                    {prod.cantidad}x {prod.nombre} 
                                                    <span className="precio-item">(L. {prod.precio})</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {pedido.descripcion && (
                                            <p className="nota-cliente">Nota: {pedido.descripcion}</p>
                                        )}
                                    </td>
                                    <td className="total-cell">
                                        L. {calcularTotal(pedido.productos).toFixed(2)}
                                    </td>
                                    <td>
                                        <select 
                                            value={pedido.estado || 'Pendiente'} 
                                            onChange={(e) => handleUpdateStatus(pedido.id, e.target.value)}
                                            className={`status-select ${pedido.estado ? pedido.estado.toLowerCase() : 'pendiente'}`}
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Preparación">En Preparación</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pedidosFiltrados.length === 0 && <p className="no-data">No hay pedidos en esta categoría.</p>}
                </div>
            )}
        </div>
    );
}