import React from 'react';
import './administrator.css';
import AddProduct from '../addproduct.jsx';
import TablesSelection from './tables_administrator/tables_selection.jsx';
import AdminOrders from './tables_administrator/admin_orders.jsx';



function Administrator() {
    return (
        <div className="administrator">
            <h1>Administrador</h1>
            <AdminOrders/>
            <AddProduct />
            <TablesSelection />
            
            
        </div>
    );
}

export default Administrator;
