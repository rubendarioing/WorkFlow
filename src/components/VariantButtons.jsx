import React from 'react';

const VariantButtons = ({ variant, setVariant }) => {
  return (
    <div className="variant-buttons">
      <button 
        onClick={() => setVariant('dots')} 
        className={`variant-btn ${variant === 'dots' ? 'variant-btn-selected' : 'variant-btn-unselected'}`}
      >
        Puntos
      </button>
      <button 
        onClick={() => setVariant('lines')} 
        className={`variant-btn ${variant === 'lines' ? 'variant-btn-selected' : 'variant-btn-unselected'}`}
      >
        Líneas
      </button>
      <button 
        onClick={() => setVariant('cross')} 
        className={`variant-btn ${variant === 'cross' ? 'variant-btn-selected' : 'variant-btn-unselected'}`}
      >
        Cruz
      </button>
    </div>
  );
};

export default VariantButtons;
