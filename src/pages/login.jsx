import React, { useState } from 'react';
import './login.css';

function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

       
        const HARDCODED_EMAIL = 'david@gmail.com';
        const HARDCODED_PASSWORD = 'David2015';

        if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
            setMessage({ 
                text: '¡Inicio de sesión exitoso!', 
                type: 'success' 
            });
            
            setTimeout(() => {
                window.location.href = '/administrator';
            }, 1000);
        } else {
            setMessage({ 
                text: 'Credenciales incorrectas. Usuario: admin@example.com, Contraseña: admin123', 
                type: 'error' 
            });
        }
        
        setLoading(false);
    };

    return (
        <div className='Content'>
            <h1>Iniciar Sesión</h1>
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
        </div>
    );
}

export default login;