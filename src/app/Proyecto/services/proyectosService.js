// services/proyectosService.js
const API_BASE_URL = 'https://psa-backend-gerb.onrender.com/api';

class ProyectosService {
  // ================================
  // CRUD PROYECTOS
  // ================================
  
  async getAllProyectos() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos`);
      if (!response.ok) throw new Error('Error al obtener proyectos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getProyectoById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`);
      if (!response.ok) throw new Error('Error al obtener proyecto');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createProyecto(proyecto) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proyecto)
      });
      if (!response.ok) throw new Error('Error al crear proyecto');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateProyecto(id, proyecto) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proyecto)
      });
      if (!response.ok) throw new Error('Error al actualizar proyecto');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteProyecto(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar proyecto');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // PROYECTOS CON RECURSOS
  // ================================

  async createProyectoConRecurso(proyecto) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/con-recurso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proyecto)
      });
      if (!response.ok) throw new Error('Error al crear proyecto con recurso');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async asignarLiderRecurso(proyectoId, liderRecursoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/asignar-lider`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liderRecursoId })
      });
      if (!response.ok) throw new Error('Error al asignar líder');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async removerLiderRecurso(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/remover-lider`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al remover líder');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getProyectosPorLider(liderRecursoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/lider/${liderRecursoId}`);
      if (!response.ok) throw new Error('Error al obtener proyectos por líder');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getProyectosSinLider() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/sin-lider`);
      if (!response.ok) throw new Error('Error al obtener proyectos sin líder');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // GESTIÓN DE FASES
  // ================================
  
  async getFasesByProyecto(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/fases`);
      if (!response.ok) throw new Error('Error al obtener fases');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createFase(proyectoId, fase) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/fases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fase)
      });
      if (!response.ok) throw new Error('Error al crear fase');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateFase(faseId, fase) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/fases/${faseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fase)
      });
      if (!response.ok) throw new Error('Error al actualizar fase');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteFase(faseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/fases/${faseId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar fase');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteFaseForce(faseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/fases/${faseId}/forzar`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar fase forzadamente');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async canDeleteFase(faseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/fases/${faseId}/puede-eliminar`);
      if (!response.ok) throw new Error('Error al verificar eliminación de fase');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // GESTIÓN DE TAREAS
  // ================================
  
  async getTareasByProyecto(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/tareas`);
      if (!response.ok) throw new Error('Error al obtener tareas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createTarea(proyectoId, tarea) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error('Error al crear tarea');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateTarea(tareaId, tarea) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error('Error al actualizar tarea');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteTarea(tareaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar tarea');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // TAREAS CON RECURSOS
  // ================================

  async createTareaConRecurso(proyectoId, tarea) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/tareas/con-recurso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea)
      });
      if (!response.ok) throw new Error('Error al crear tarea con recurso');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async asignarResponsableRecurso(tareaId, responsableRecursoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}/asignar-responsable`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responsableRecursoId })
      });
      if (!response.ok) throw new Error('Error al asignar responsable');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async removerResponsableRecurso(tareaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}/remover-responsable`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al remover responsable');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getTareasPorResponsable(responsableRecursoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/responsable/${responsableRecursoId}`);
      if (!response.ok) throw new Error('Error al obtener tareas por responsable');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getTareasSinResponsable() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/sin-responsable`);
      if (!response.ok) throw new Error('Error al obtener tareas sin responsable');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getCargaTrabajoRecurso(recursoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/recursos/${recursoId}/carga-trabajo`);
      if (!response.ok) throw new Error('Error al obtener carga de trabajo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getCargaTrabajoTodosRecursos() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/recursos/carga-trabajo`);
      if (!response.ok) throw new Error('Error al obtener carga de trabajo de recursos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getRecursosDisponiblesParaTareas() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/recursos/disponibles-tareas`);
      if (!response.ok) throw new Error('Error al obtener recursos disponibles');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // TAREAS CON TICKETS (NUEVO)
  // ================================

  async getTareasConTickets(proyectoId) {
    try {
      // Cargar tareas y tickets en paralelo
      const [tareasResponse, ticketsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/proyectos/${proyectoId}/tareas`),
        fetch(`${API_BASE_URL}/tickets`)
      ]);
      
      if (!tareasResponse.ok) throw new Error('Error al obtener tareas');
      if (!ticketsResponse.ok) throw new Error('Error al obtener tickets');
      
      const tareas = await tareasResponse.json();
      const tickets = await ticketsResponse.json();
      
      const ticketPorTarea = new Map();
      tickets.forEach(ticket => {
        ticket.tareasAsignadas?.forEach(tarea => {
          ticketPorTarea.set(tarea.id, ticket);
        });
      });
      
      const tareasConTickets = tareas.map(tarea => ({
        ...tarea,
        ticketAsociado: ticketPorTarea.get(tarea.idTarea) || null
      }));
      
      return tareasConTickets;
    } catch (error) {
      console.error('Error en getTareasConTickets:', error);
      throw error;
    }
  }

  // ================================
  // GESTIÓN DE RECURSOS
  // ================================

  async getAllRecursos() {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos`);
      if (!response.ok) throw new Error('Error al obtener recursos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getRecursoById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/${id}`);
      if (!response.ok) throw new Error('Error al obtener recurso');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async buscarRecursos(termino) {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/buscar?termino=${encodeURIComponent(termino)}`);
      if (!response.ok) throw new Error('Error al buscar recursos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getRecursosPorRol(rolId) {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/rol/${rolId}`);
      if (!response.ok) throw new Error('Error al obtener recursos por rol');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getRecursosDisponibles() {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/disponibles`);
      if (!response.ok) throw new Error('Error al obtener recursos disponibles');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async sincronizarRecursos() {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/sincronizar`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Error al sincronizar recursos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async activarRecurso(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/${id}/activar`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al activar recurso');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async desactivarRecurso(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/${id}/desactivar`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al desactivar recurso');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getEstadisticasRecursos() {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/estadisticas`);
      if (!response.ok) throw new Error('Error al obtener estadísticas de recursos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async testApiExterna() {
    try {
      const response = await fetch(`${API_BASE_URL}/recursos/test-api-externa`);
      if (!response.ok) throw new Error('Error al probar API externa');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // MÉTODOS ORIGINALES DE TAREAS
  // ================================

  async asignarMultiplesFases(tareaId, faseIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}/asignar-multiples-fases`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faseIds })
      });
      if (!response.ok) throw new Error('Error al asignar fases');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async iniciarTarea(tareaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}/iniciar`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al iniciar tarea');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async completarTarea(tareaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/${tareaId}/completar`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Error al completar tarea');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // GESTIÓN DE RIESGOS
  // ================================
  
  async getRiesgosByProyecto(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/riesgos`);
      if (!response.ok) throw new Error('Error al obtener riesgos');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getRiesgoById(riesgoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/riesgos/${riesgoId}`);
      if (!response.ok) throw new Error('Error al obtener riesgo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async createRiesgo(proyectoId, riesgo) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/riesgos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riesgo)
      });
      if (!response.ok) throw new Error('Error al crear riesgo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateRiesgo(riesgoId, riesgo) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/riesgos/${riesgoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riesgo)
      });
      if (!response.ok) throw new Error('Error al actualizar riesgo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteRiesgo(riesgoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/riesgos/${riesgoId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar riesgo');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async cambiarEstadoRiesgo(riesgoId, estado) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/riesgos/${riesgoId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado })
      });
      if (!response.ok) throw new Error('Error al cambiar estado del riesgo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // ================================
  // CONSULTAS ESPECIALES
  // ================================
  
  async getEstadisticasProyecto(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/estadisticas`);
      if (!response.ok) throw new Error('Error al obtener estadísticas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getTareasMultifase() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/multifase`);
      if (!response.ok) throw new Error('Error al obtener tareas multifase');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getTareasVencidas() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/tareas/vencidas`);
      if (!response.ok) throw new Error('Error al obtener tareas vencidas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

// Exportar instancia única (singleton)
export const proyectosService = new ProyectosService();
