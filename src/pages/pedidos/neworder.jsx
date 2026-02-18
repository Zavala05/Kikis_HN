import { useState, useEffect, useRef } from 'react';
import supabase from '../../supabase.js';
import './neworder.css';

const TABLA_PRODUCTOS = [
    'joyeria',
    'cremas',
    'monederos',
    'perfumes',
    'sets'
];

export default function NewOrder() {
    const containerRef = useRef(null);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        descripcion: ''
    });

    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Cargar productos desde todas las tablas
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const todosLosProductos = [];
                for (const tabla of TABLA_PRODUCTOS) {
                    const { data, error } = await supabase
                        .from(tabla)
                        .select('*');

                    if (!error && data) {
                        const productosConCategoria = data.map(p => ({
                            ...p,
                            categoria: tabla
                        }));
                        todosLosProductos.push(...productosConCategoria);
                    }
                }
                setProductos(todosLosProductos);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            } finally {
                setLoadingProductos(false);
            }
        };

        cargarProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSeleccionarProducto = (producto) => {
        const yaSeleccionado = productosSeleccionados.find(
            p => p.id === producto.id && p.categoria === producto.categoria
        );

        if (yaSeleccionado) {
            setProductosSeleccionados(prev =>
                prev.map(p =>
                    p.id === producto.id && p.categoria === producto.categoria
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                )
            );
        } else {
            setProductosSeleccionados(prev => [
                ...prev,
                { ...producto, cantidad: 1 }
            ]);
        }
    };

    const handleDisminuirProducto = (id, categoria) => {
        setProductosSeleccionados(prev => {
            const actualizado = prev.map(p =>
                p.id === id && p.categoria === categoria
                    ? { ...p, cantidad: p.cantidad - 1 }
                    : p
            );
            return actualizado.filter(p => p.cantidad > 0);
        });
    };

    const handleEliminarProducto = (id, categoria) => {
        setProductosSeleccionados(prev =>
            prev.filter(p => !(p.id === id && p.categoria === categoria))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validaciones básicas
        if (!formData.nombre || !formData.direccion || !formData.telefono || !formData.descripcion) {
            setMessage({ type: 'error', text: 'Todos los campos son requeridos' });
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (productosSeleccionados.length === 0) {
            setMessage({ type: 'error', text: 'Debe seleccionar al menos un producto' });
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // 1. Preparar datos para Supabase
            const productosParaGuardar = productosSeleccionados.map(p => ({
                id: p.id,
                nombre: p.nombre,
                categoria: p.categoria,
                precio: p.precio,
                cantidad: p.cantidad
            }));

            // 2. Guardar en Supabase
            const { error: errorSupabase } = await supabase
                .from('usuarios_compras')
                .insert([
                    {
                        nombre: formData.nombre,
                        direccion: formData.direccion,
                        telefono: formData.telefono,
                        descripcion: formData.descripcion,
                        productos: productosParaGuardar
                    }
                ]);

            if (errorSupabase) throw new Error(errorSupabase.message);

            // 3. Enviar Correo con FormSubmit (Lógica AJAX)
            const destinatario = 'selizabethhn@yahoo.com' ; //correo al que se dirige 
            const emailData = new FormData();
            emailData.append('Nombre Cliente', formData.nombre);
            emailData.append('Teléfono', formData.telefono);
            emailData.append('Dirección', formData.direccion);
            emailData.append('Nota Adicional', formData.descripcion);
            
            // Crear una lista legible de productos para el correo
            const listaTexto = productosSeleccionados
                .map(p => `- ${p.nombre} (${p.categoria}) x${p.cantidad} - Precio: L.${p.precio}`)
                .join('\n');
            emailData.append('Productos Solicitados', listaTexto);

            // IMPORTANTE: Usamos la URL con /ajax/ para evitar redirecciones
            const responseEmail = await fetch(`https://formsubmit.co/ajax/${destinatario}`, {
                method: 'POST',
                body: emailData
            });

            if (responseEmail.ok) {
                setMessage({ type: 'success', text: 'Orden guardada y correo enviado exitosamente, lo contactaremos pronto.' });
                
                // Limpiar formulario
                setFormData({ nombre: '', direccion: '', telefono: '', descripcion: '' });
                setProductosSeleccionados([]);
            } else {
                throw new Error('La orden se guardó pero hubo un problema enviando el correo.');
            }

        } catch (err) {
            setMessage({ type: 'error', text: `Error: ${err.message}` });
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="new-order-container" ref={containerRef}>
            <h1>Nueva Orden de Compra</h1>
            
            {message.text && (
                <div className={`message message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Información de Contacto</h2>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese su nombre"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="direccion">Dirección:</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Colonia, Bloque y Numero de Casa"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ingrese su numero telefonico"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Detalles adicionales de su orden"
                            rows="5"
                            required
                        />
                    </div>
                </div>

                {productosSeleccionados.length > 0 && (
                    <div className="form-section">
                        <h2>Productos Seleccionados</h2>
                        <div className="productos-seleccionados">
                            {productosSeleccionados.map((producto) => (
                                <div key={`${producto.id}-${producto.categoria}`} className="producto-seleccionado">
                                    <div className="producto-info">
                                        <h4>{producto.nombre}</h4>
                                        <p className="categoria-small">{producto.categoria}</p>
                                        <p className="precio-small">L. {producto.precio}</p>
                                    </div>
                                    <div className="cantidad-controls">
                                        <button
                                            type="button"
                                            onClick={() => handleDisminuirProducto(producto.id, producto.categoria)}
                                            className="btn-cantidad"
                                        > − </button>
                                        <span className="cantidad">{producto.cantidad}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSeleccionarProducto(producto)}
                                            className="btn-cantidad"
                                        > + </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEliminarProducto(producto.id, producto.categoria)}
                                        className="btn-eliminar"
                                    > Eliminar </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-section">
                    <h2>Seleccionar Productos</h2>
                    {loadingProductos ? (
                        <p className="loading-text">Cargando productos...</p>
                    ) : productos.length === 0 ? (
                        <p className="no-products">No hay productos disponibles</p>
                    ) : (
                        <div className="productos-grid">
                            {productos.map((producto) => (
                                <div key={`${producto.id}-${producto.categoria}`} className="producto-card">
                                    {producto.imagen && (
                                        <img 
                                            src={producto.imagen} 
                                            alt={producto.nombre}
                                            className="producto-imagen"
                                        />
                                    )}
                                    <h3>{producto.nombre}</h3>
                                    <p className="categoria">{producto.categoria}</p>
                                    <p className="precio">L. {producto.precio}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleSeleccionarProducto(producto)}
                                        className="btn-agregar"
                                    > Agregar al Carrito </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="btn_guardarorden" type="submit" disabled={loading || loadingProductos}>
                    {loading ? 'Procesando...' : 'Guardar Orden'}
                </button>
            </form>
        </div>
    );
}