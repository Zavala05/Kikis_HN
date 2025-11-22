import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Administrator from './pages/administrator';


function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              <img src="/imgs/LOGOKIKIS.jpg" alt="Logo Kikis" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/administrator" element={<Administrator />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
