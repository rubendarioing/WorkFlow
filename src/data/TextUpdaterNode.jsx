import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
 
const handleStyle = { left: 10 };
const handleStyleRight = { right: 10 };
// Este componente representa un nodo personalizado para React Flow
function TextUpdaterNode({ data, isConnectable }) {
  // Función de callback que se ejecuta cuando cambia el input
  // useCallback se usa para memorizar la función y evitar recreaciones innecesarias
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="text-updater-node">
      {/* Handle superior - Punto de conexión que recibe conexiones (entrada) */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      {/* Contenido del nodo: una etiqueta y un campo de entrada */}
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      {/* Dos Handles inferiores - Puntos de conexión que envían conexiones (salida) */}
      {/* Handle 'a' con estilo personalizado */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      {/* Handle 'b' sin estilo personalizado */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />      
    </div>
  );
}
 
export default TextUpdaterNode;