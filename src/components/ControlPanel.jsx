import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ColorLens as ColorLensIcon,
  Settings as SettingsIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { saveWorkflow } from '../services/workflowService';

function ControlPanel({
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
}) {
  const backgroundVariants = ['dots', 'lines', 'cross'];
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      showNotification('Por favor ingrese un nombre para el workflow', 'error');
      return;
    }

    try {
      setSaving(true);
      console.log('Preparando datos del workflow para guardar:', {
        name: workflowName,
        nodes: nodes.length,
        edges: edges.length
      });

      // Crear el objeto de workflow a guardar
      const workflowData = {
        name: workflowName,
        description: description,
        nodes: nodes,
        edges: edges,
        metadata: {
          bgColor,
          variant,
          createdAt: new Date().toISOString()
        }
      };

      // Create the workflow model as a local variable
      const createWorkflowModel = {
        id: 0, // Será null para nuevos workflows
        Name: workflowName || '',  //Nombre del workflow
        Description: description || '', //Descripción del workflow
        BgColor: bgColor || '#ffffff', //Color de fondo
        Variant: variant || 'default', //Variante
        Nodes: nodes,
        Edges: edges
      }
     
      console.log('Datos del workflowData a guardar:', workflowData);
      console.log('Datos del createWorkflowModel a guardar:', createWorkflowModel);
      
      // Llamar al servicio para guardar
      const result = await saveWorkflow(createWorkflowModel);
      
    
      showNotification('Workflow guardado exitosamente', 'success');
      
      // Si tienes una función de callback para manejar el guardado,
      // puedes llamarla aquí
      // if (typeof onSaveWorkflow === 'function') {
      //   onSaveWorkflow(result);
      // }
    } catch (error) {
      console.error('Error al guardar el workflow:', error);
      showNotification(`Error al guardar: ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: 280, 
        height: '100%',
        p: 2, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Automatizaciones
      </Typography>
      
      <Divider />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Canvas Configuraciones</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Color de fondo"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <ColorLensIcon fontSize="small" sx={{ mr: 1 }} />
            }}
          />
          
          <FormControl size="small">
            <InputLabel>Variantes de Canvas</InputLabel>
            <Select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              label="Variantes de Canvas"
            >
              {backgroundVariants.map((v) => (
                <MenuItem key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="h6">Agregar Segmento</Typography>
        <List dense>
          {nodeTemplates.map((template, index) => (
            <ListItem 
              key={`segment-${template.type}-${index}`}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
              sx={{ 
                border: '1px dashed #ccc',
                borderRadius: 1,
                mb: 1,
                cursor: 'grab',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ListItemText 
                primary={template.label} 
                // secondary={`Type: ${template.type}`} 
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Agregar Acción</Typography>
        <List dense>
          {nodeAccionesTemplates.map((template, index) => (
            <ListItem 
              key={`accion-${template.type}-${index}`}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
              sx={{ 
                border: '1px dashed #ccc',
                borderRadius: 1,
                mb: 1,
                cursor: 'grab',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}
            >
              <ListItemText 
                primary={template.label} 
                // secondary={`Type: ${template.type}`} 
              />
            </ListItem>
          ))}
        </List>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={addNewNode}
          fullWidth
          sx={{ mt: 1 }}
        >
         Agregar nodo básico
        </Button>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="h6">Elementos Seleccionados</Typography>
        {selectedNodes.length > 0 ? (
          <>
            <Typography variant="subtitle2">{selectedNodes.length} nodos seleccionados</Typography>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={deleteSelectedNodes}
              size="small"
              sx={{ mt: 1 }}
            >
              Eliminar Selección
            </Button>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">Nodos sin Seleccionar</Typography>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Typography variant="h6">Flow Statistics</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Total Nodes" secondary={nodes.length} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Total Conecciones" secondary={edges.length} />
          </ListItem>
        </List>
      </Box>
      
      <Divider />
      
      <Box>
        <Typography variant="h6">Guardar Workflow</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre Workflow"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            size="small"
            fullWidth
            required
            error={workflowName.trim() === ''}
            helperText={workflowName.trim() === '' ? 'El nombre es requerido' : ''}
          />
          
          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={2}
          />
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveWorkflow}
            fullWidth
            disabled={saving || workflowName.trim() === ''}
          >
            {saving ? 'Guardando...' : 'Workflow Guardado'}
          </Button>
        </Box>
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ControlPanel;
