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
        'Authorization': 'Bearer 4VKEhTALyaV3T9x0SfS7vhZJL50tA2yGdj9n2rvSGGkXdyaOw2QNBc3b2YtjLku/t46mGyrgh5EjsI8HjEhN8uOLUGKDwiBmyDA8WWBq/9K7wBxr81Z3t1FpZyO4EbDT4BDkicZNWnNSJV4oowLtR35B1uV59frnxVOdLXvnK0s6JucPJeXCj0d8FqDTCeXsrWoEVw0UXjetY8KAeffoytzvqR0UXRHcp2r68sM7ixfxx34SDduTJHBTmDSjZ1KMrhCEoCo8y1N6dG/r/0+Qc0QrlRlY6uyX2wq0JiIdQdJOwV/G/nBUJ7EFflmdeBY4sXeAzoCJIc3vFvJEZkIaWzaelQL9zdzKf6zZPyftS2/jbu6XQYLTXelT6Q2u0wjBdP9QNYolSQ69AQkrvNd6Fw==',
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

