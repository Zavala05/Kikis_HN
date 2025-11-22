import React, { useState } from 'react';
import './administrator.css';
import AddProduct from '../addproduct.jsx';
function administrator() {
    return (
        <div className="administrator">
            <h1>Administrador</h1>
            <AddProduct />
        </div>
    );
}

export default administrator;
