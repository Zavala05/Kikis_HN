import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import Sections from './tables_administrator/sections';
import Footer from '../footer';
import '../products.css';
import '../index.css';

export default function Home() {
  const [products, setProducts] = useState({
    cremas: [],
    joyeria: [],
    monederos: [],
    perfumes: [],
    sets: [],
    hombres: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [currntPage, setCurrntPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const tables = ['cremas', 'joyeria', 'monederos', 'perfumes', 'sets', 'hombres'];
        const allProducts = {};

        for (const table of tables) {
          const { data, error: queryError } = await supabase
            .from(table)
            .select('*');

          if (queryError) {
            if (queryError.message.includes('Failed to fetch') || 
                queryError.message.includes('invalid') ||
                queryError.message.includes('undefined')) {
              setIsConfigured(false);
              throw new Error('Supabase no esta configurado correctamente');
            }
            throw queryError;
          }
          allProducts[table] = data || [];
        }

        setProducts(allProducts);
        setError(null);
        setIsConfigured(true);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        
        if (err.message.includes('undefined') || err.message.includes('Failed to fetch')) {
          setIsConfigured(false);
          setError('Por favor, configura las variables de Supabase en el archivo .env.local');
        } else {
          setError(`Error al cargar los productos: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Scroll hacia arriba cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currntPage]);

  const renderProductCategory = (categoryKey, categoryTitle) => {
    const categoryProducts = products[categoryKey] || [];
    return (
      <div key={categoryKey} id={categoryKey} className="category-section">
        <h2>{categoryTitle}</h2>
        {categoryProducts.length > 0 ? (
          <div className="products-grid">
            {categoryProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.imagen_url ? (
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
                <h3>{product.nombre}</h3>
                <p>{product.descripcion}</p>
                <p className="price">L.{parseFloat(product.precio).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos disponibles en esta categoria</p>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="home">Cargando productos...</div>;
  }

  // Paginacion - Filtrar por categoria si esta seleccionada
  let allProducts = [];
  
  if (selectedCategory) {
    allProducts = products[selectedCategory] || [];
  } else {
    allProducts = [
      ...products.cremas,
      ...products.joyeria,
      ...products.monederos,
      ...products.perfumes,
      ...products.sets,
      ...products.hombres
    ];
  }

  const lastPostIndex = currntPage * PostPerPage;
  const firstPostIndex = lastPostIndex - PostPerPage;
  const currentPosts = allProducts.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(allProducts.length / PostPerPage);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setCurrntPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (currntPage < totalPages) {
      setCurrntPage(currntPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currntPage > 1) {
      setCurrntPage(currntPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isConfigured) {
    return (
      <div className="home">
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#856404' }}>Configuracion Requerida</h2>
          <p style={{ color: '#856404', fontSize: '16px' }}>
            No se puede conectar a Supabase. Asegurate de:
          </p>
          <ol style={{ color: '#856404', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <li>Editar el archivo .env.local con tus credenciales de Supabase</li>
            <li>Crear las tablas requeridas (cremas, joyeria, monederos, perfumes, sets, hombres)</li>
            <li>Configurar RLS para permitir lecturas publicas</li>
            <li>Reiniciar el servidor: npm run dev</li>
            <li>Limpiar cache: Ctrl+F5</li>
          </ol>
          <p style={{ color: '#856404', marginTop: '15px', fontSize: '14px' }}>
            Ver SETUP.md para instrucciones detalladas
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="home">
        <Sections onSelectCategory={handleSelectCategory} selectedCategory={selectedCategory} />
        {error && <div className="error-message">{error}</div>}
        
        <div className="all-products-section">
          <h2>
            {selectedCategory === 'cremas' && 'Cremas'}
            {selectedCategory === 'joyeria' && 'Joyeria'}
            {selectedCategory === 'monederos' && 'Monederos / Carteras'}
            {selectedCategory === 'perfumes' && 'Perfumes / Splash'}
            {selectedCategory === 'sets' && 'Sets de Productos'}
            {selectedCategory === 'hombres' && 'Hombres'}
            {!selectedCategory && 'Nuestros Productos'}
          </h2>
          {currentPosts.length > 0 ? (
            <div className="products-grid">
              {currentPosts.map((product) => (
                <div key={product.id} className="product-card">
                  {product.imagen_url ? (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                  <h3>{product.nombre}</h3>
                  <p>{product.descripcion}</p>
                  <p className="price">L.{parseFloat(product.precio).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay productos disponibles</p>
          )}

          {/* Controles de Paginacion */}
          {allProducts.length > 0 && (
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currntPage === 1}
                className="pagination-btn"
              >
                Anterior
              </button>
              
              <span className="pagination-info">
                Pagina {currntPage} de {totalPages}
              </span>
              
              <button 
                onClick={handleNextPage} 
                disabled={currntPage === totalPages}
                className="pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}