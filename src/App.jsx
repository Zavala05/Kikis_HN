
import './App.css';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Administrator from './pages/administrator';
import NewOrder from './pages/pedidos/neworder';
import { useState } from 'react';

function ProtectedRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem('isAdmin') === 'true';
  return isAdminAuthenticated ? children : <Navigate to="/login" replace />;
}


function App() {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    localStorage.removeItem('isAdmin');
  };
  const goToSection = (id) => {
    if (window.location.pathname === '/administrator') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/administrator', { state: { scrollTo: id } });
    }
  };


  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Link to="/login" onClick={handleHomeClick}>
              <img src="/imgs/LOGOKIKIS.jpg" alt="Logo Kikis" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={handleHomeClick}>Inicio</Link>
            <Link to="/nuevopedido" className="nav-link">Hacer Pedido</Link>
            
            
          
            
            
            
          </div>
        </div>
      </nav>
     
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nuevopedido" element={<NewOrder />} />
          <Route
            path="/administrator"
            element={
              <ProtectedRoute>
                <Administrator />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </main>
    </div>
    
  );
}

export default App
