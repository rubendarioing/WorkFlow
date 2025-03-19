/**
 * Modelo para los datos de Workflow según la estructura de la base de datos
 * 
 * Corresponde a la tabla CBR.Workflows:
 * - id_wf: INT IDENTITY(1,1) NOT NULL (autogenerado en BD)
 * - name_wf: VARCHAR(100) NOT NULL
 * - description_wf: VARCHAR(100) NULL
 * - bg_color: VARCHAR(30) NULL
 * - variant: VARCHAR(50) NULL
 * - created_at: SMALLDATETIME (gestionado automáticamente)
 * - updated_at: SMALLDATETIME (gestionado automáticamente)
 * - created_by: VARCHAR(100)
 * - status_wf: VARCHAR(10) DEFAULT 'active'
 */

/**
 * Crea un objeto workflow con valores predeterminados
 * @returns {Object} Objeto workflow con estructura compatible con la BD
 */
export const createWorkflowModel = (data = {}) => {
  return {
    id: data.id_wf || null, // Será null para nuevos workflows
    nombre: data.name_wf,
    descripcion: data.description_wf,
    color: data.bg_color,
    variante: data.variant,
    creadoPor: data.created_by, // Usuario actual o valor predeterminado
    status: data.status_wf, // Valores permitidos: 'active', 'draft', 'archived'
    fechaCreacion:data.created_at, //Fecha de creación
    fechaActualiza: data.updated_at
    // created_at y updated_at se manejarán en el backend
  };
};

/**
 * Valida que un workflow tenga los campos requeridos correctos
 * @param {Object} workflow - Workflow a validar
 * @returns {Object} Resultado de la validación {isValid, errors}
 */
export const validateWorkflow = (workflow) => {
  const errors = {};
  
  if (!workflow.nombre) {
    errors.nombre = 'El nombre del workflow es obligatorio';
  }
  
  if (workflow.status && !['active', 'draft', 'archived'].includes(workflow.status)) {
    errors.status = 'El estado debe ser: active, draft o archived';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
