// services/ticketsService.js
const API_BASE_URL = '';

class TicketsService {
  async sincronizar() {
    const response = await fetch(`${API_BASE_URL}/api/tickets/sincronizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al sincronizar tickets');
    }

    return await response.text(); // Retorna mensaje de sincronización
  }

  // Consultas
  async obtenerTodos() {
    const response = await fetch(`${API_BASE_URL}/api/tickets`);
    
    if (!response.ok) {
      throw new Error('Error al obtener tickets');
    }

    return await response.json();
  }

  async obtenerSinAsignar() {
    const response = await fetch(`${API_BASE_URL}/api/tickets/sin-asignar`);
    
    if (!response.ok) {
      throw new Error('Error al obtener tickets sin asignar');
    }

    return await response.json();
  }

  async obtenerPorId(id) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener ticket');
    }

    return await response.json();
  }

  // Asignación de tareas
  async asignarTareas(ticketId, tareaIds) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/asignar-tareas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tareaIds),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al asignar tareas');
    }

    return await response.json();
  }

  async desasignarTareas(ticketId, tareaIds) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/desasignar-tareas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tareaIds),
    });

    if (!response.ok) {
      throw new Error('Error al desasignar tareas');
    }

    return await response.json();
  }

  // Métricas para dashboard
  async obtenerMetricas() {
    const tickets = await this.obtenerTodos();
    
    const metricas = {
      total: tickets.length,
      pendientes: tickets.filter(t => t.estado === 'RECIBIDO').length,
      asignados: tickets.filter(t => t.estado === 'ASIGNADO').length,
      enProceso: tickets.filter(t => t.estado === 'EN_PROCESO').length,
      resueltos: tickets.filter(t => t.estado === 'RESUELTO').length,
    };

    return metricas;
  }

  // Utilidades para UI
  obtenerColorPorPrioridad(prioridad) {
    const colores = {
      'HIGH_PRIORITY': 'bg-red-100 text-red-800 border-red-200',
      'MEDIUM_PRIORITY': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'LOW_PRIORITY': 'bg-green-100 text-green-800 border-green-200',
    };
    return colores[prioridad] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  obtenerTextoprioridad(prioridad) {
    const textos = {
      'HIGH_PRIORITY': 'Alta',
      'MEDIUM_PRIORITY': 'Media',
      'LOW_PRIORITY': 'Baja',
    };
    return textos[prioridad] || prioridad;
  }

  obtenerTextoSeveridad(severidad) {
    const textos = {
      'LEVEL_1': 'Nivel 1',
      'LEVEL_2': 'Nivel 2', 
      'LEVEL_3': 'Nivel 3',
      'LEVEL_4': 'Nivel 4',
    };
    return textos[severidad] || severidad;
  }

  obtenerTextoEstado(estado) {
    const textos = {
      'RECIBIDO': 'Pendiente',
      'ASIGNADO': 'Asignado',
      'EN_PROCESO': 'En Proceso',
      'RESUELTO': 'Resuelto',
    };
    return textos[estado] || estado;
  }

  obtenerColorPorEstado(estado) {
    const colores = {
      'RECIBIDO': 'bg-blue-100 text-blue-800',
      'ASIGNADO': 'bg-purple-100 text-purple-800',
      'EN_PROCESO': 'bg-orange-100 text-orange-800',
      'RESUELTO': 'bg-green-100 text-green-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  }
}

// Exportar instancia única (singleton)
export const ticketsService = new TicketsService();
