import React from 'react';
import './sections.css';

export default function Sections({ onSelectCategory, selectedCategory }) {
  const categories = [
    { id: 'cremas', label: 'Cremas' },
    { id: 'joyeria', label: 'Joyeria' },
    { id: 'monederos', label: 'Monederos' },
    { id: 'perfumes', label: 'Perfumes' },
    { id: 'sets', label: 'Sets' }
  ];

  return (
    <div className='sections'>
      <h2>Visita Nuestras Secciones</h2>
      <div className='sections__buttons'>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            type="button" 
            className={`dropdown-item ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}