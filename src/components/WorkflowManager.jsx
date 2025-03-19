import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CloneIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getWorkflows, getWorkflowById } from '../services/workflowService';

const WorkflowManager = ({ onSelectWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (err) {
      setError('Error al cargar los workflows: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewWorkflow = async (id) => {
    try {
      setLoading(true);
      const workflow = await getWorkflowById(id);
      setSelectedWorkflow(workflow);
      setDialogOpen(true);
    } catch (err) {
      setError('Error al cargar el workflow: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWorkflow = () => {
    if (selectedWorkflow && onSelectWorkflow) {
      onSelectWorkflow(selectedWorkflow);
      setDialogOpen(false);
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Workflows Guardados
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading && <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto' }} />}
      
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && workflows.length === 0 && (
        <Typography color="textSecondary" sx={{ textAlign: 'center', my: 4 }}>
          No hay workflows guardados
        </Typography>
      )}

      <List>
        {workflows.map((workflow) => (
          <ListItem key={workflow.id} divider>
            <ListItemText
              primary={workflow.name}
              secondary={
                <>
                  <Typography variant="body2" component="span">
                    {workflow.description || 'Sin descripción'}
                  </Typography>
                  <br />
                  <Typography variant="caption" component="span">
                    Creado: {new Date(workflow.metadata?.createdAt).toLocaleString()}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Ver">
                <IconButton edge="end" onClick={() => handleViewWorkflow(workflow.id)}>
                  <ViewIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedWorkflow && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Descripción:
              </Typography>
              <Typography paragraph>
                {selectedWorkflow.description || 'Sin descripción'}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Nodos: {selectedWorkflow.nodes?.length || 0}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Conexiones: {selectedWorkflow.edges?.length || 0}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Creado: {new Date(selectedWorkflow.metadata?.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoadWorkflow}
          >
            Cargar Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default WorkflowManager;
