// services/proyectosService.js
const API_BASE_URL = 'http://localhost:8080/api';

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
