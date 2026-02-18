import React from 'react';
import './SearchTable.css';

export default function SearchTable(){
    return (
        <div className='busqueda'>
            <h2>Que tabla desea administrar?</h2>
            <div className='buttons'><button type="button" className="dropdown-item" onClick={() => document.getElementById('cremas')?.scrollIntoView({ behavior: 'smooth' })}>Cremas</button>
            <button type="button" className="dropdown-item" onClick={() => document.getElementById('joyeria')?.scrollIntoView({ behavior: 'smooth' })}>Joyería</button>
            <button type="button" className="dropdown-item" onClick={() => document.getElementById('monederos')?.scrollIntoView({ behavior: 'smooth' })}>Monederos</button>
            <button type="button" className="dropdown-item" onClick={() => document.getElementById('perfumes')?.scrollIntoView({ behavior: 'smooth' })}>Perfumes</button>
            <button type="button" className="dropdown-item" onClick={() => document.getElementById('sets')?.scrollIntoView({ behavior: 'smooth' })}>Sets</button>
        </div></div>
            
    );
}