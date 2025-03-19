import React from 'react';

const NodeList = ({ nodes, selectedNodes }) => {
  return (
    <div className="list-container">
      {nodes.map(node => (
        <div 
          key={node.id} 
          className={`list-item ${selectedNodes.some(n => n.id === node.id) ? 'list-item-selected' : ''}`}
        >
          {node.data.label || `Nodo ${node.id}`}
        </div>
      ))}
      {nodes.length === 0 && (
        <div className="list-item-empty">
          No hay nodos disponibles
        </div>
      )}
    </div>
  );
};

export default NodeList;
