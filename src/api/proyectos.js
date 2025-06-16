// src/api/proyectos.js
import { apiCall } from './config';

// ========================================
// SERVICIOS PARA PORTAFOLIO (GerentePortafolio)
// ========================================

export const portafolioAPI = {
  // GET /api/portafolio/estadisticas
  obtenerEstadisticas: () => apiCall('/api/portafolio/estadisticas'),

  // GET /api/portafolio/proyectos  
  obtenerProyectos: () => apiCall('/api/portafolio/proyectos'),

  // POST /api/portafolio/proyectos
  crearProyecto: (proyecto) => apiCall('/api/portafolio/proyectos', {
    method: 'POST',
    body: JSON.stringify(proyecto),
  }),

  // GET /api/portafolio/proyectos/activos
  obtenerProyectosActivos: () => apiCall('/api/portafolio/proyectos/activos'),

  // DELETE /api/portafolio/proyectos/{id}
  eliminarProyecto: (id) => apiCall(`/api/portafolio/proyectos/${id}`, {
    method: 'DELETE',
  }),
};

// ========================================
// SERVICIOS PARA PROYECTOS INDIVIDUALES (GerenteProyecto)
// ========================================

export const proyectoAPI = {
  // GET /api/proyectos/{id}
  obtenerPorId: (id) => apiCall(`/api/proyectos/${id}`),

  // GET /api/proyectos/{id}/estadisticas  
  obtenerEstadisticas: (id) => apiCall(`/api/proyectos/${id}/estadisticas`),

  // PUT /api/proyectos/{id}/estado
  cambiarEstado: (id, estado) => apiCall(`/api/proyectos/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  }),

  // PUT /api/proyectos/{id}/planificar
  planificar: (id, fechaInicio, fechaFin) => apiCall(`/api/proyectos/${id}/planificar`, {
    method: 'PUT',
    body: JSON.stringify({ fechaInicio, fechaFin }),
  }),
};

// ========================================
// SERVICIOS PARA FASES
// ========================================

export const faseAPI = {
  // GET /api/proyectos/{proyectoId}/fases
  obtenerPorProyecto: (proyectoId) => apiCall(`/api/proyectos/${proyectoId}/fases`),

  // POST /api/proyectos/{proyectoId}/fases  
  crear: (proyectoId, fase) => apiCall(`/api/proyectos/${proyectoId}/fases`, {
    method: 'POST',
    body: JSON.stringify(fase),
  }),

  // PUT /api/fases/{faseId}/planificar
  planificar: (faseId, fechaInicio, fechaFin) => apiCall(`/api/proyectos/fases/${faseId}/planificar`, {
    method: 'PUT',
    body: JSON.stringify({ fechaInicio, fechaFin }),
  }),
};

// ========================================
// SERVICIOS PARA TAREAS
// ========================================

export const tareaAPI = {
  // POST /api/proyectos/tareas
  crear: (tarea) => apiCall('/api/proyectos/tareas', {
    method: 'POST',
    body: JSON.stringify(tarea),
  }),

  // PUT /api/tareas/{id}/asignar-fase
  asignarAFase: (tareaId, faseId) => apiCall(`/api/proyectos/tareas/${tareaId}/asignar-fase`, {
    method: 'PUT',
    body: JSON.stringify({ faseId }),
  }),

  // PUT /api/tareas/{id}/asignar-multiples-fases
  asignarAMultiplesFases: (tareaId, faseIds) => apiCall(`/api/proyectos/tareas/${tareaId}/asignar-multiples-fases`, {
    method: 'PUT',
    body: JSON.stringify({ faseIds }),
  }),

  // PUT /api/tareas/{id}/iniciar
  iniciar: (tareaId) => apiCall(`/api/proyectos/tareas/${tareaId}/iniciar`, {
    method: 'PUT',
  }),

  // PUT /api/tareas/{id}/completar
  completar: (tareaId) => apiCall(`/api/proyectos/tareas/${tareaId}/completar`, {
    method: 'PUT',
  }),

  // PUT /api/tareas/{id}/responsable
  asignarResponsable: (tareaId, responsable) => apiCall(`/api/proyectos/tareas/${tareaId}/responsable`, {
    method: 'PUT',
    body: JSON.stringify({ responsable }),
  }),

  // PUT /api/tareas/{id}/planificar
  planificar: (tareaId, fechaInicio, fechaFin) => apiCall(`/api/proyectos/tareas/${tareaId}/planificar`, {
    method: 'PUT',
    body: JSON.stringify({ fechaInicio, fechaFin }),
  }),

  // GET /api/proyectos/tareas/vencidas
  obtenerVencidas: () => apiCall('/api/proyectos/tareas/vencidas'),

  // GET /api/proyectos/tareas/multifase
  obtenerMultifase: () => apiCall('/api/proyectos/tareas/multifase'),
};

// ========================================
// SERVICIOS PARA RIESGOS  
// ========================================

export const riesgoAPI = {
  // GET /api/proyectos/{id}/riesgos
  obtenerPorProyecto: (proyectoId) => apiCall(`/api/proyectos/${proyectoId}/riesgos`),

  // POST /api/proyectos/{id}/riesgos
  crear: (proyectoId, riesgo) => apiCall(`/api/proyectos/${proyectoId}/riesgos`, {
    method: 'POST',
    body: JSON.stringify(riesgo),
  }),

  // PUT /api/riesgos/{id}/mitigar
  mitigar: (riesgoId) => apiCall(`/api/proyectos/riesgos/${riesgoId}/mitigar`, {
    method: 'PUT',
  }),

  // GET /api/proyectos/riesgos/altos
  obtenerAltos: () => apiCall('/api/proyectos/riesgos/altos'),
};
