import React from 'react';

const EdgeList = ({ edges, selectedEdges, deleteEdge }) => {
  return (
    <div className="list-container">
      {edges.map(edge => (
        <div 
          key={edge.id} 
          className={`list-item list-item-with-action ${selectedEdges.some(e => e.id === edge.id) ? 'list-item-selected' : ''}`}
        >
          <span>{edge.label || `${edge.source} → ${edge.target}`}</span>
          <button 
            onClick={() => deleteEdge(edge.id)}
            className="delete-btn"
          >
            x
          </button>
        </div>
      ))}
      {edges.length === 0 && (
        <div className="list-item-empty">
          No hay conexiones disponibles
        </div>
      )}
    </div>
  );
};

export default EdgeList;
