import React, { useState, useRef } from 'react';
import supabase from './supabase';
import './addproducts.css';

const TABLE_OPTIONS = [
    { value: 'joyeria', label: 'Joyeria' },
    { value: 'cremas', label: 'Cremas' },
    { value: 'monederos', label: 'Monederos / Carteras' },
    { value: 'perfumes', label: 'Perfumes'},
    { value: 'sets', label: 'Sets de productos'}
];

function AddProduct() {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: null,
        
        tablaDestino: TABLE_OPTIONS[0].value 
    });
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'imagen') {
            setFormData(prev => ({
                ...prev,
                imagen: e.target.files[0]
            }));
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            imagen: null
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImage = async (image) => {
        const bucketName = 'product-images';
        const fileExt = image.name.split('.').pop();
        const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, image, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data } = await supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Validación adicional: asegurar que haya una imagen
        if (!formData.imagen) {
            setMessage({ text: 'Debe agregar una imagen del producto.', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            let imageUrl = '';
            
            // Subir la imagen si existe
            if (formData.imagen) {
                imageUrl = await uploadImage(formData.imagen);
            }

            // 2. CAMBIADO: Usar el valor de formData.tablaDestino para la inserción
            const { error } = await supabase
                .from(formData.tablaDestino) // <<--- ¡Aquí está el cambio clave!
                .insert([{
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    precio: parseFloat(formData.precio),
                    imagen_url: imageUrl || null
                }]);

            if (error) throw error;

            setMessage({ 
                text: `¡Producto agregado exitosamente a la tabla '${formData.tablaDestino}'!`, 
                type: 'success' 
            });
            
            // Limpiar el formulario
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: null,
                tablaDestino: TABLE_OPTIONS[0].value // Resetear al valor predeterminado
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('Error al agregar el producto:', error);
            setMessage({ 
                text: `Error al agregar el producto: ${error.message}`, 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='Content'>
            <h1>Agregar Nuevo Producto</h1>
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="product-form">
                
                {/* 3. AÑADIDO: Campo de menú desplegable (Select) */}
                <div className="form-group">
                    <label>Seleccionar Tabla de Destino:</label>
                    <select
                        name="tablaDestino"
                        value={formData.tablaDestino}
                        onChange={handleChange}
                        required
                    >
                        {TABLE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Nombre del Producto:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Precio (L.):</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Imagen del Producto:</label>
                    <input
                        type="file"
                        name="imagen"
                        onChange={handleChange}
                        required
                        accept="image/*"
                        ref={fileInputRef}
                        className="file-input"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img 
                                src={imagePreview} 
                                alt="Vista previa" 
                                className="preview-image"
                            />
                            <button 
                                type="button" 
                                onClick={handleRemoveImage}
                                className="remove-image-btn"
                            >
                                Eliminar imagen
                            </button>
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Agregando...' : 'Agregar Producto'}
                </button>
            </form>
        </div>
    );
}

export default AddProduct;
