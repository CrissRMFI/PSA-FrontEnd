// src/api/hooks.js
'use client'; // Para Next.js 13+ con app directory

import { useState, useEffect } from 'react';
import { portafolioAPI, proyectoAPI, faseAPI, tareaAPI, riesgoAPI } from './proyectos';

// ========================================
// HOOK PARA PORTAFOLIO COMPLETO
// ========================================

export const usePortafolio = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar solo estadísticas por ahora (funciona bien)
      const statsData = await portafolioAPI.obtenerEstadisticas();
      setEstadisticas(statsData);
      
      // Comentamos temporalmente la carga de proyectos hasta arreglar el JSON
      // const proyectosData = await portafolioAPI.obtenerProyectos();
      // setProyectos(proyectosData);
      
      // Datos mock temporales para mostrar que funciona
      setProyectos([
        {
          idProyecto: 4,
          nombre: "Proyecto de Prueba Frontend",
          estado: "ACTIVO",
          liderProyecto: "Frontend Developer",
          descripcion: "Proyecto creado desde Next.js"
        }
      ]);
      
    } catch (err) {
      setError(err.message);
      console.error('Error cargando portafolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearProyecto = async (proyecto) => {
    try {
      const nuevoProyecto = await portafolioAPI.crearProyecto(proyecto);
      await cargarDatos(); // Recargar todo
      return nuevoProyecto;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      await portafolioAPI.eliminarProyecto(id);
      await cargarDatos(); // Recargar todo
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    estadisticas,
    proyectos,
    loading,
    error,
    cargarDatos,
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
        proyectoAPI.obtenerPorId(id),
        proyectoAPI.obtenerEstadisticas(id),
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
      const proyectoActualizado = await proyectoAPI.cambiarEstado(id, nuevoEstado);
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
      const proyectoActualizado = await proyectoAPI.planificar(id, fechaInicio, fechaFin);
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
      const fasesData = await faseAPI.obtenerPorProyecto(proyectoId);
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
      const nuevaFase = await faseAPI.crear(proyectoId, fase);
      await cargarFases(); // Recargar
      return nuevaFase;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const planificarFase = async (faseId, fechaInicio, fechaFin) => {
    try {
      const faseActualizada = await faseAPI.planificar(faseId, fechaInicio, fechaFin);
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
        tareaAPI.obtenerVencidas(),
        tareaAPI.obtenerMultifase(),
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
      const nuevaTarea = await tareaAPI.crear(tarea);
      return nuevaTarea;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const asignarTareaAFase = async (tareaId, faseId) => {
    try {
      const tareaActualizada = await tareaAPI.asignarAFase(tareaId, faseId);
      return tareaActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const iniciarTarea = async (tareaId) => {
    try {
      const tareaActualizada = await tareaAPI.iniciar(tareaId);
      return tareaActualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completarTarea = async (tareaId) => {
    try {
      const tareaActualizada = await tareaAPI.completar(tareaId);
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
        riesgoAPI.obtenerPorProyecto(proyectoId),
        riesgoAPI.obtenerAltos(),
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
      const nuevoRiesgo = await riesgoAPI.crear(proyectoId, riesgo);
      await cargarRiesgos(); // Recargar
      return nuevoRiesgo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const mitigarRiesgo = async (riesgoId) => {
    try {
      const riesgoActualizado = await riesgoAPI.mitigar(riesgoId);
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
      await portafolioAPI.obtenerEstadisticas();
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
      
      const resultado = await portafolioAPI.crearProyecto(proyecto);
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
