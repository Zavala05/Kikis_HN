import React, { useState, useEffect } from 'react';
import './products.css';
import supabase from './supabase';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')  // Asegúrate de que 'products' sea el nombre exacto de tu tabla en Supabase
                    .select('*');
                
                if (error) {
                    throw error;
                }
                
                setProducts(data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="products">Cargando productos...</div>;
    }

    if (error) {
        return <div className="products error">{error}</div>;
    }

    return (
        <div className="products">
            <h1>Nuestros Productos</h1>
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            {product.imagen_url ? (
                                <img 
                                    src={product.imagen_url} 
                                    alt={product.nombre} 
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.onerror = null; // Evita bucles de error
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                            ) : (
                                <div className="no-image">
                                    Sin imagen
                                </div>
                            )}
                            <h3>{product.nombre}</h3>
                            <p>{product.descripcion}</p>
                            <p className="price">L.{product.precio.toFixed(2)}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay productos disponibles</p>
                )}
            </div>
        </div>
    );
}

export default Products;