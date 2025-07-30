/**
 * Servicio para gestionar operaciones de workflows con la API
 */

import { validateWorkflow } from '../models/workflowModel';

const API_URL = 'http://localhost:54656/WorkFlow'; // Ajusta esto a tu URL real de API

/**
 * Guarda un workflow en la base de datos
 * @param {Object} workflow - Datos del workflow a guardar
 * @returns {Promise} - Promesa con la respuesta de la API
 */
export const saveWorkflow = async (workflow) => {
  try {
    // Validamos el workflow antes de enviarlo
    const { isValid, errors } = validateWorkflow(workflow);
    if (!isValid) {
      throw new Error(`Datos de workflow inválidos: ${JSON.stringify(errors)}`);
    }
    
    console.log('Guardando workflow:', workflow);
    const response = await fetch(`${API_URL}/AgregarWorkFlow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Aquí puedes agregar headers de autenticación si es necesario
        'Authorization': 'Bearer pxuKEuJFNqZpz+gcV6qkuN2Tdi1//k3iz3G/xMQxzwJPSeH8lKQ7BKzhXKgC8kxdDsvpYQ4gW8xBkypUjB7muyIYTcwmWMKjBxDvbWmmaedttEvcYaSaeEzOxy3V2vcikDTNquzbOnDX4fb/cOkZ1b7sBQzqKETLZy93VVnZ3QaX6CCMBOL3JMJZbrIl2jSSQsktfxgKxaANGPFZhU4oH0SFoQJuYbG39kuwnZHo9AI7RDDHY8jiAw+vQYW15EZ+XGYX/PTzljafov+To30eU9y85hD4fWdSVD8FyMbSJYP0DuDdyJ0HAkpdt4P5X9W/wl5ZpavYEVqZtQA13U/41cj19iN1Y5q6KJ3oWE7XkVJ2qhjY8FDzvh4PtUML1KwLaWuj669O564nH0mcWx6S8w==',
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar el workflow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en saveWorkflow:', error);
    throw error;
  }
};

/**
 * Obtiene todos los workflows
 * @returns {Promise} - Promesa con la lista de workflows
 */
export const getWorkflows = async () => {
  try {
    const response = await fetch(`${API_URL}/workflows`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los workflows');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getWorkflows:', error);
    throw error;
  }
};

/**
 * Obtiene un workflow por su ID
 * @param {string} id - ID del workflow
 * @returns {Promise} - Promesa con el workflow
 */
export const getWorkflowById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/workflows/${id}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el workflow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getWorkflowById:', error);
    throw error;
  }
};

