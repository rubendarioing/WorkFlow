import React from 'react';

const DraggableNodeTemplates = ({ nodeTemplates, onDragStart }) => {
  return (
    <div className="draggable-container">
      {nodeTemplates.map((template, index) => (
        <div 
          key={index}
          draggable
          onDragStart={(event) => onDragStart(event, template)}
          className="draggable-item"
          style={{
            background: template.style.background,
            border: template.style.border,
            borderRadius: template.style.borderRadius,
          }}
        >
          {template.label}
        </div>
      ))}
      <div className="draggable-hint">
        Arrastra y suelta en el canvas
      </div>
    </div>
  );
};

export default DraggableNodeTemplates;
