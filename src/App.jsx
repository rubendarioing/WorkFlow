import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  SelectionMode,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// MUI components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Componentes
import ControlPanel from './components/ControlPanel';

// Nodos personalizados
import { nodeTypes } from './nodes/nodeTypes';

// Datos iniciales
import { initialNodes } from './data/initialData';
import { nodeTemplates } from './data/nodeTemplates';
import { nodeAccionesTemplates } from './data/nodeAccionesTemplates';

// Estilos
import './styles/App.css';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function App() {
  // Estado para nodos y conexiones
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [bgColor, setBgColor] = useState('#f0f0f0');
  const [variant, setVariant] = useState('cross');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  
  // Referencias para drag & drop
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Handlers para actualizar nodos y conexiones
  const onNodesChange = useCallback(
    (changes) => {
      console.log('Node changes:', changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [],
  );
 
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true,
      label: `Conexión ${eds.length + 1}`,
      style: { stroke: '#1890ff' }
    }, eds)),
    [setEdges],
  );
  
  // Control de selección
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
  }, []);
  
  // Handlers para añadir y eliminar elementos
  const addNewNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      position: { 
        x: Math.random() * 300, 
        y: Math.random() * 300 
      },
      data: { label: `Nodo ${newNodeId}` },
      style: { 
        background: '#fffbe6', 
        border: '1px solid #ffe58f', 
        borderRadius: '8px' 
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onSaveWorkflow = (name) => {
    const workflowData = {
      name,
      nodes: [...nodes],
      edges: [...edges],
      bgColor,
      variant,
      lastModified: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
    const updatedWorkflows = [...savedWorkflows, workflowData];
    localStorage.setItem('savedWorkflows', JSON.stringify(updatedWorkflows));
    
    // Or send to a backend API
    // fetch('/api/workflows', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(workflowData)
    // });
    
    alert(`Workflow "${name}" guardado satisfactoriamente!`);
  };

  const deleteSelectedNodes = () => {
    if (selectedNodes.length === 0) return;
    
    const selectedNodeIds = selectedNodes.map(node => node.id);
    
    setNodes(nodes => nodes.filter(node => !selectedNodeIds.includes(node.id)));
    setEdges(edges => edges.filter(
      edge => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    ));
    
    setSelectedNodes([]);
  };

  const deleteEdge = (edgeId) => {
    setEdges(edges => edges.filter(edge => edge.id !== edgeId));
    setSelectedEdges(selectedEdges.filter(edge => edge.id !== edgeId));
  };
  
  // Handlers para drag & drop
  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragStart = (event, nodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeTemplate));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    
    const templateData = event.dataTransfer.getData('application/reactflow');
    if (!templateData) return;
    
    const nodeTemplate = JSON.parse(templateData);
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    const newNodeId = `${nodeTemplate.type}-${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: nodeTemplate.type,
      position,
      data: { 
        label: `${nodeTemplate.label} ${nodes.length + 1}`,
        value: 0
      },
      style: nodeTemplate.style
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  // Props para el panel de control
  const controlPanelProps = {
    nodes,
    edges,
    bgColor,
    setBgColor,
    variant,
    setVariant,
    selectedNodes,
    selectedEdges,
    nodeTemplates,
    onDragStart,
    addNewNode,
    deleteSelectedNodes,
    deleteEdge,
    nodeAccionesTemplates,
    onSaveWorkflow
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container" sx={{ display: 'flex', height: '100vh' }}>
        <ControlPanel {...controlPanelProps} />
        
        <Box 
          ref={reactFlowWrapper} 
          className="reactflow-wrapper" 
          sx={{ 
            flexGrow: 1,
            background: bgColor,
            border: '1px solid #ddd',
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <ReactFlow
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            panOnScroll
            selectionOnDrag
            panOnDrag={[1, 2]}
            selectionMode={SelectionMode.Partial}
          >
            <Controls />
            <MiniMap style={{ border: '1px solid #ddd' }} />
            <Background variant={variant} gap={12} size={1} color="#ccc"/>
          </ReactFlow>
        </Box>
      </Box>
    </ThemeProvider>
  );
}