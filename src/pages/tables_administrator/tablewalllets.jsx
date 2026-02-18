import React, { useCallback, useEffect, useRef, useState } from 'react';
import supabase from '../../supabase';
import '../../productstable.css';

function WalletTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const mountedRef = useRef(true);

    const fetchProducts = useCallback(async ({ showLoading = false } = {}) => {
        if (showLoading && mountedRef.current) {
            setLoading(true);
        }

        try {
            const { data, error } = await supabase
                .from('monederos')
                .select('id, nombre, descripcion, precio, imagen_url')
                .order('id', { ascending: true });

            if (error) throw error;

            if (mountedRef.current) {
                setProducts(data || []);
                setError('');
            }
        } catch (err) {
            if (mountedRef.current) {
                console.error('Error al cargar productos:', err);
                setError('No se pudieron cargar los productos.');
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        fetchProducts({ showLoading: true });

        return () => {
            mountedRef.current = false;
        };
    }, [fetchProducts]);

    const handleDelete = async (productId) => {
        const confirmation = window.confirm('¿Deseas eliminar este producto?');
        if (!confirmation) {
            return;
        }

        setDeletingId(productId);

        try {
            const { error } = await supabase
                .from('monederos')
                .delete()
                .eq('id', productId);

            if (error) {
                throw error;
            }

            await fetchProducts({ showLoading: false });
        } catch (err) {
            if (mountedRef.current) {
                console.error('Error al eliminar producto:', err);
                setError('No se pudo eliminar el producto.');
            }
        } finally {
            if (mountedRef.current) {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return <div className="product-table__wrapper">Cargando productos...</div>;
    }

    if (error) {
        return <div className="product-table__wrapper product-table__error">{error}</div>;
    }

    return (
        <div className="product-table__wrapper">
            <h2>Administrar Carteras / Monederos</h2>
            {products.length === 0 ? (
                <p className="product-table__empty">No hay productos disponibles.</p>
            ) : (
                <div className="product-table__container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.nombre}</td>
                                    <td>{product.descripcion}</td>
                                    <td>
                                        {product.precio != null
                                            ? `L.${Number(product.precio).toFixed(2)}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {product.imagen_url ? (
                                            <img
                                                src={product.imagen_url}
                                                alt={product.nombre}
                                                className="product-table__thumb"
                                                loading="lazy"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            'Sin imagen'
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="product-table__delete"
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                        >
                                            {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default WalletTable;
