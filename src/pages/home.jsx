import React from 'react';
import { Link } from 'react-router-dom';
import Products from '../products.jsx';
import AddProduct from '../addproduct.jsx';

function Home() {
    return (
        <>
            <div className="HOME">
                <h1>Bienvenido a Kikis</h1>
                <p>En kikis ofrecemos una gran variedad de productos para ti y tu familia de las mejores marcas americanas totamente originales</p>
            </div>
            
            <Products />
            
        </>
    );
}

export default Home;
