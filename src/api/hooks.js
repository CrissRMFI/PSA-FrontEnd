'use client';

import { useState, useEffect } from 'react';
import { apiCall } from './config';

// ========================================
// HOOK SIMPLE PARA PROYECTOS (SIN PORTAFOLIO)
// ========================================

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Usar endpoint real que SÍ existe
      const proyectosData = await apiCall('/api/proyectos');
      setProyectos(proyectosData);
      
    } catch (err) {
      setError(err.message);
      console.error('Error cargando proyectos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const crearProyecto = async (proyecto) => {
    try {
      // ✅ Usar endpoint real
      const nuevoProyecto = await apiCall('/api/proyectos', {
        method: 'POST',
        body: JSON.stringify(proyecto),
      });
      await cargarProyectos(); // Recargar lista
      return nuevoProyecto;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      await apiCall(`/api/proyectos/${id}`, {
        method: 'DELETE',
      });
      await cargarProyectos(); // Recargar lista
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    proyectos,
    loading,
    error,
    cargarProyectos,
    crearProyecto,
    eliminarProyecto,
  };
};

// ========================================
// HOOK PARA PROYECTO INDIVIDUAL
// ========================================

export const useProyecto = (id) => {
  const [proyecto, setProyecto] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProyecto = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [proyectoData, statsData] = await Promise.all([
        apiCall(`/api/proyectos/${id}`),
        apiCall(`/api/proyectos/${id}/estadisticas`),
      ]);
      
      setProyecto(proyectoData);
      setEstadisticas(statsData);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando proyecto:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyecto();
  }, [id]);

  const cambiarEstado = async (nuevoEstado) => {
    try {
      const proyectoActualizado = await apiCall(`/api/proyectos/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      setProyecto(proyectoActualizado);
      await cargarProyecto(); // Recargar estadísticas
      return proyectoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const planificar = async (fechaInicio, fechaFin) => {
    try {
      const proyectoActualizado = await apiCall(`/api/proyectos/${id}/planificar`, {
        method: 'PUT',
        body: JSON.stringify({ fechaInicio, fechaFin }),
      });
      setProyecto(proyectoActualizado);
      return proyectoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    proyecto,
    estadisticas,
    loading,
    error,
    cargarProyecto,
    cambiarEstado,
    planificar,
  };
};

// ========================================
// HOOK PARA FASES DE UN PROYECTO
// ========================================

export const useFases = (proyectoId) => {
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarFases = async () => {
    if (!proyectoId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fasesData = await apiCall(`/api/proyectos/${proyectoId}/fases`);
      setFases(fasesData);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando fases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFases();
  }, [proyectoId]);

  const crearFase = async (fase) => {
    try {
      const nuevaFase = await apiCall(`/api/proyectos/${proyectoId}/fases`, {
        method: 'POST',
        body: JSON.stringify(fase),
      });
      await cargarFases(); // Recargar
      return nuevaFase;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const planificarFase = async (faseId, fechaInicio, fechaFin) => {
    try {
      const faseActualizada = await apiCall(`/api/proyectos/fases/${faseId}/planificar`, {
        method: 'PUT',
        body: JSON.stringify({ fechaInicio, fechaFin }),
      });
      await cargarFases(); // Recargar
      return faseActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    fases,
    loading,
    error,
    cargarFases,
    crearFase,
    planificarFase,
  };
};

// ========================================
// HOOK PARA GESTIÓN DE TAREAS
// ========================================

export const useTareas = () => {
  const [tareasVencidas, setTareasVencidas] = useState([]);
  const [tareasMultifase, setTareasMultifase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarTareasEspeciales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vencidas, multifase] = await Promise.all([
        apiCall('/api/proyectos/tareas/vencidas'),
        apiCall('/api/proyectos/tareas/multifase'),
      ]);
      
      setTareasVencidas(vencidas);
      setTareasMultifase(multifase);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando tareas especiales:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearTarea = async (tarea) => {
    try {
      const nuevaTarea = await apiCall('/api/proyectos/tareas', {
        method: 'POST',
        body: JSON.stringify(tarea),
      });
      return nuevaTarea;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const asignarTareaAFase = async (tareaId, faseId) => {
    try {
      const tareaActualizada = await apiCall(`/api/proyectos/tareas/${tareaId}/asignar-fase`, {
        method: 'PUT',
        body: JSON.stringify({ faseId }),
      });
      return tareaActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const iniciarTarea = async (tareaId) => {
    try {
      const tareaActualizada = await apiCall(`/api/proyectos/tareas/${tareaId}/iniciar`, {
        method: 'PUT',
      });
      return tareaActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completarTarea = async (tareaId) => {
    try {
      const tareaActualizada = await apiCall(`/api/proyectos/tareas/${tareaId}/completar`, {
        method: 'PUT',
      });
      return tareaActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tareasVencidas,
    tareasMultifase,
    loading,
    error,
    cargarTareasEspeciales,
    crearTarea,
    asignarTareaAFase,
    iniciarTarea,
    completarTarea,
  };
};

// ========================================
// HOOK PARA RIESGOS
// ========================================

export const useRiesgos = (proyectoId) => {
  const [riesgos, setRiesgos] = useState([]);
  const [riesgosAltos, setRiesgosAltos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarRiesgos = async () => {
    if (!proyectoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [riesgosProyecto, riesgosAltosData] = await Promise.all([
        apiCall(`/api/proyectos/${proyectoId}/riesgos`),
        apiCall('/api/proyectos/riesgos/altos'),
      ]);
      
      setRiesgos(riesgosProyecto);
      setRiesgosAltos(riesgosAltosData);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando riesgos:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearRiesgo = async (riesgo) => {
    try {
      const nuevoRiesgo = await apiCall(`/api/proyectos/${proyectoId}/riesgos`, {
        method: 'POST',
        body: JSON.stringify(riesgo),
      });
      await cargarRiesgos(); // Recargar
      return nuevoRiesgo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const mitigarRiesgo = async (riesgoId) => {
    try {
      const riesgoActualizado = await apiCall(`/api/proyectos/riesgos/${riesgoId}/mitigar`, {
        method: 'PUT',
      });
      await cargarRiesgos(); // Recargar
      return riesgoActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    riesgos,
    riesgosAltos,
    loading,
    error,
    cargarRiesgos,
    crearRiesgo,
    mitigarRiesgo,
  };
};

// ========================================
// HOOK PARA TESTING/DEBUG
// ========================================

export const useTestAPI = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [mensaje, setMensaje] = useState('');

  const probarConexion = async () => {
    try {
      // ✅ Probar endpoint real que existe
      await apiCall('/api/proyectos');
      setConnectionStatus('connected');
      setMensaje('✅ Conexión exitosa con el backend');
      return true;
    } catch (error) {
      setConnectionStatus('disconnected');
      setMensaje(`❌ Error de conexión: ${error.message}`);
      return false;
    }
  };

  const crearProyectoPrueba = async () => {
    try {
      const proyecto = {
        nombre: 'Proyecto de Prueba Frontend',
        descripcion: 'Prueba de conexión Next.js → Spring Boot → PostgreSQL',
        liderProyecto: 'Frontend Developer',
      };
      
      // ✅ Usar endpoint real
      const resultado = await apiCall('/api/proyectos', {
        method: 'POST',
        body: JSON.stringify(proyecto),
      });
      setMensaje(`✅ Proyecto "${resultado.nombre}" creado con ID: ${resultado.idProyecto}`);
      return resultado;
    } catch (error) {
      setMensaje(`❌ Error creando proyecto: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    probarConexion();
  }, []);

  return {
    connectionStatus,
    mensaje,
    probarConexion,
    crearProyectoPrueba,
  };
};
