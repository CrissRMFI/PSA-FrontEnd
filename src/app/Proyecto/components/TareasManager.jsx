'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, User, Flag, Clock, 
  CheckCircle, AlertTriangle, Edit, Trash2, MoreVertical,
  List, Grid, ArrowLeft, Save, X, Users, Target, Layers,
  Percent, Split, Link
} from 'lucide-react';
import { useTareas, useFases } from '../../../api/hooks'; // ✅ Usar hooks reales
import TareaAvanzadaForm from './TareaAvanzadaForm'; // ✅ Importar formulario

// Recursos temporales - TODO: Mover a API cuando esté disponible
const mockRecursos = [
  { id: 1, nombre: "Leonardo Felici", rol: "Project Manager" },
  { id: 2, nombre: "María González", rol: "Desarrollador Senior" },
  { id: 3, nombre: "Carlos Mendoza", rol: "Analista Funcional" },
  { id: 4, nombre: "Ana Rodríguez", rol: "Tester" }
];

function EstadoBadge({ estado }) {
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case 'COMPLETADA':
      case 'Completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_PROGRESO':
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDIENTE':
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'VENCIDA':
      case 'Vencida':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const estadoTexto = estado?.replace('_', ' ') || 'Sin estado';

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getEstadoStyles(estado)}`}>
      {estadoTexto}
    </span>
  );
}

function PrioridadBadge({ prioridad }) {
  const getPrioridadStyles = (prioridad) => {
    switch (prioridad) {
      case 'ALTA':
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'MEDIA':
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAJA':
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case 'ALTA':
      case 'Alta':
        return '🔴';
      case 'MEDIA':
      case 'Media':
        return '🟡';
      case 'BAJA':
      case 'Baja':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getPrioridadStyles(prioridad)}`}>
      <span>{getPrioridadIcon(prioridad)}</span>
      {prioridad || 'Sin prioridad'}
    </span>
  );
}

function ParticipacionFases({ participaciones = [], fases = [], compact = false }) {
  if (!participaciones || participaciones.length === 0) {
    return compact ? null : <p className="text-sm text-gray-500">Sin asignación a fases</p>;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {participaciones.map((participacion, index) => {
          const fase = fases.find(f => f.idFase === participacion.faseId || f.id === participacion.faseId);
          return (
            <span 
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: fase?.color || '#3B82F6' }}
            >
              <Layers className="w-3 h-3" />
              {participacion.porcentajeParticipacion || 100}%
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Participación en fases:</h4>
      <div className="space-y-2">
        {participaciones.map((participacion, index) => {
          const fase = fases.find(f => f.idFase === participacion.faseId || f.id === participacion.faseId);
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: fase?.color || '#3B82F6' }}
              />
              <span className="text-sm text-gray-700 flex-1">
                {participacion.faseName || fase?.nombre || 'Fase desconocida'}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {participacion.porcentajeParticipacion || 100}%
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${participacion.porcentajeParticipacion || 100}%`,
                    backgroundColor: fase?.color || '#3B82F6'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TareaAvanzadaCard({ tarea, onEditar, onEliminar, onCambiarEstado, recursos, fases }) {
  const [showMenu, setShowMenu] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const calcularDiasRestantes = () => {
    if (!tarea.fechaFin) return null;
    const hoy = new Date();
    const fechaFin = new Date(tarea.fechaFin);
    const diferencia = fechaFin - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias;
  };

  const diasRestantes = calcularDiasRestantes();
  const isVencida = diasRestantes !== null && diasRestantes < 0 && tarea.estado !== 'COMPLETADA' && tarea.estado !== 'Completada';

  const getEstadoIcon = (estado) => {
    const estadoNormalizado = estado?.toLowerCase();
    switch (estadoNormalizado) {
      case 'completada':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'en progreso':
      case 'en_progreso':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pendiente':
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
      case 'vencida':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // ✅ Adaptar a la estructura real de la API con fallbacks
  const participaciones = tarea.participacionFases || [];
  const asignadoA = tarea.asignadoA || tarea.asignado || { nombre: 'Sin asignar' };
  const dependencias = tarea.dependencias || [];

  // Obtener fase principal (la que más participación tiene)
  const fasePrincipal = participaciones.length > 0 
    ? participaciones.reduce((prev, current) => 
        (current.porcentajeParticipacion || 100) > (prev.porcentajeParticipacion || 100) ? current : prev
      )
    : null;

  const faseColor = fasePrincipal 
    ? fases.find(f => f.idFase === fasePrincipal.faseId || f.id === fasePrincipal.faseId)?.color || '#3B82F6'
    : '#3B82F6';

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
      isVencida ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            {getEstadoIcon(isVencida ? 'vencida' : tarea.estado)}
            <h3 className="font-medium text-gray-900 line-clamp-2">{tarea.nombre}</h3>
            {participaciones.length > 1 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                <Split className="w-3 h-3" />
                Multi-fase
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{tarea.descripcion || 'Sin descripción'}</p>
          
          <div className="flex gap-2 mb-3">
            <EstadoBadge estado={isVencida ? 'VENCIDA' : tarea.estado} />
            <PrioridadBadge prioridad={tarea.prioridad} />
          </div>

          {participaciones.length > 0 && (
            <div className="mb-3">
              <ParticipacionFases participaciones={participaciones} fases={fases} compact={true} />
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setMostrarDetalles(!mostrarDetalles);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  {mostrarDetalles ? 'Ocultar' : 'Ver'} detalles
                </button>
                <button
                  onClick={() => {
                    onEditar(tarea);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onCambiarEstado(tarea);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Cambiar estado
                </button>
                <button
                  onClick={() => {
                    onEliminar(tarea);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>{asignadoA.nombre}</span>
        </div>

        {(tarea.fechaInicio || tarea.fechaFin) && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {tarea.fechaInicio ? new Date(tarea.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha'} - {' '}
              {tarea.fechaFin ? new Date(tarea.fechaFin).toLocaleDateString('es-ES') : 'Sin fecha'}
            </span>
          </div>
        )}

        {diasRestantes !== null && (
          <div className={`flex items-center gap-2 ${
            isVencida ? 'text-red-600' : 
            diasRestantes <= 3 ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {isVencida 
                ? `${Math.abs(diasRestantes)} días vencida`
                : `${diasRestantes} días restantes`
              }
            </span>
          </div>
        )}

        {/* Progreso - mostrar solo si existe */}
        {tarea.porcentajeAvance !== undefined && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Progreso:</span>
              <span className="font-medium">{tarea.porcentajeAvance || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${tarea.porcentajeAvance || 0}%`,
                  backgroundColor: faseColor
                }}
              />
            </div>
          </>
        )}

        {/* Horas - mostrar solo si existe */}
        {(tarea.horasReales !== undefined || tarea.estimacionHoras !== undefined) && (
          <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
            <span>{tarea.horasReales || 0}h / {tarea.estimacionHoras || 0}h</span>
            <span>{tarea.comentarios || 0} comentarios</span>
          </div>
        )}
      </div>

      {mostrarDetalles && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <ParticipacionFases participaciones={participaciones} fases={fases} />
          
          {dependencias.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Dependencias:</h4>
              <div className="flex gap-1">
                {dependencias.map((dep, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    <Link className="w-3 h-3" />
                    Tarea #{dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TareasManagerAvanzado({ proyectoId, faseIdSeleccionada = null, onVolver }) {
  // ✅ Usar hooks reales en lugar de mock data
  const { 
    tareasVencidas, 
    tareasMultifase, 
    loading: tareasLoading, 
    error: tareasError,
    cargarTareasEspeciales,
    crearTarea,
    asignarTareaAFase,
    iniciarTarea,
    completarTarea
  } = useTareas();

  const { 
    fases, 
    loading: fasesLoading, 
    error: fasesError 
  } = useFases(proyectoId);

  const [recursos, setRecursos] = useState([]);
  const [loadingRecursos, setLoadingRecursos] = useState(true);
  const [tareas, setTareas] = useState([]);
  const [vista, setVista] = useState('fases');
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    prioridad: '',
    asignado: '',
    fase: faseIdSeleccionada || '',
    soloMultifase: false
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = async () => {
    try {
      // ✅ Cargar tareas especiales (vencidas y multifase)
      await cargarTareasEspeciales();
      
      // ✅ Cargar recursos (temporal)
      await cargarRecursos();
      
      // TODO: Cargar todas las tareas del proyecto cuando esté disponible
      // const tareasProyecto = await apiCall(`/api/proyectos/${proyectoId}/tareas`);
      // setTareas(tareasProyecto);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const cargarRecursos = async () => {
    setLoadingRecursos(true);
    try {
      // TODO: Reemplazar con API real cuando esté disponible
      // const recursosData = await apiCall('/api/recursos');
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecursos(mockRecursos);
    } catch (error) {
      console.error('Error cargando recursos:', error);
    } finally {
      setLoadingRecursos(false);
    }
  };

  // ✅ Combinar tareas de diferentes fuentes
  const todasLasTareas = [
    ...tareasVencidas.map(t => ({ ...t, esVencida: true })),
    ...tareasMultifase.map(t => ({ ...t, esMultifase: true })),
    ...tareas
  ];

  // ✅ Filtrar tareas según criterios
  const tareasFiltradas = todasLasTareas.filter(tarea => {
    const cumpleBusqueda = tarea.nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleEstado = !filtros.estado || tarea.estado === filtros.estado;
    const cumplePrioridad = !filtros.prioridad || tarea.prioridad === filtros.prioridad;
    const cumpleAsignado = !filtros.asignado || (tarea.asignadoA?.id || tarea.asignado?.id) == filtros.asignado;
    const cumpleFase = !filtros.fase || (tarea.participacionFases && tarea.participacionFases.some(p => p.faseId == filtros.fase));
    const cumpleMultifase = !filtros.soloMultifase || (tarea.participacionFases && tarea.participacionFases.length > 1) || tarea.esMultifase;
    
    return cumpleBusqueda && cumpleEstado && cumplePrioridad && cumpleAsignado && cumpleFase && cumpleMultifase;
  });

  // ✅ Agrupar tareas por fase
  const tareasPorFase = fases.map(fase => ({
    ...fase,
    tareas: tareasFiltradas.filter(tarea => 
      tarea.participacionFases && tarea.participacionFases.some(p => p.faseId === fase.idFase || p.faseId === fase.id)
    )
  }));

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleNuevaTarea = (faseId = null) => {
    setTareaEditando(null);
    if (faseId) {
      setFiltros(prev => ({ ...prev, fase: faseId }));
    }
    setMostrarFormulario(true);
  };

  const handleEditarTarea = (tarea) => {
    setTareaEditando(tarea);
    setMostrarFormulario(true);
  };

  const handleGuardarTarea = async (tareaData) => {
    try {
      if (tareaEditando) {
        // TODO: Implementar actualización cuando esté disponible
        console.log('Actualizar tarea:', tareaEditando.id, tareaData);
        setTareas(prev => prev.map(t => 
          t.id === tareaEditando.id ? { ...tareaData, id: tareaEditando.id } : t
        ));
      } else {
        // ✅ Crear nueva tarea usando el hook real
        const nuevaTarea = await crearTarea(tareaData);
        setTareas(prev => [...prev, nuevaTarea]);
      }
      
      setMostrarFormulario(false);
      setTareaEditando(null);
      
      // Recargar datos
      await cargarTareasEspeciales();
      
    } catch (error) {
      console.error('Error guardando tarea:', error);
    }
  };

  const handleEliminarTarea = (tarea) => {
    if (confirm(`¿Eliminar "${tarea.nombre}"?`)) {
      // TODO: Implementar eliminación real cuando esté disponible
      console.log('Eliminar tarea:', tarea.id);
      setTareas(prev => prev.filter(t => t.id !== tarea.id));
    }
  };

  const handleCambiarEstado = async (tarea) => {
    try {
      const estados = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
      const estadoActualIndex = estados.indexOf(tarea.estado);
      const siguienteEstado = estados[(estadoActualIndex + 1) % estados.length];
      
      if (siguienteEstado === 'EN_PROGRESO') {
        await iniciarTarea(tarea.id);
      } else if (siguienteEstado === 'COMPLETADA') {
        await completarTarea(tarea.id);
      }
      
      // Actualizar localmente
      setTareas(prev => prev.map(t => 
        t.id === tarea.id ? { ...t, estado: siguienteEstado } : t
      ));
      
      // Recargar datos
      await cargarTareasEspeciales();
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  const calcularEstadisticasFase = (fase) => {
    const tareasEnFase = todasLasTareas.filter(t => 
      t.participacionFases && t.participacionFases.some(p => p.faseId === fase.idFase || p.faseId === fase.id)
    );
    
    const completadas = tareasEnFase.filter(t => t.estado === 'COMPLETADA' || t.estado === 'Completada').length;
    const progreso = tareasEnFase.length > 0 ? Math.round((completadas / tareasEnFase.length) * 100) : 0;

    const horasEnFase = tareasEnFase.reduce((sum, tarea) => {
      const participacion = tarea.participacionFases?.find(p => p.faseId === fase.idFase || p.faseId === fase.id);
      return sum + (participacion?.horasEnFase || tarea.horasReales || 0);
    }, 0);

    return { total: tareasEnFase.length, completadas, progreso, horasEnFase };
  };

  // ✅ Manejo de errores
  if (tareasError || fasesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error cargando tareas</h2>
          <p className="text-gray-600 mb-4">{tareasError || fasesError}</p>
          <button 
            onClick={cargarDatos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (tareasLoading || fasesLoading || loadingRecursos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas avanzadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button onClick={onVolver} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión Avanzada de Tareas</h1>
                <p className="text-gray-600 mt-1">Tareas con participación en múltiples fases</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVista('fases')}
                  className={`p-2 rounded text-sm ${vista === 'fases' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  Por Fases
                </button>
                <button
                  onClick={() => setVista('lista')}
                  className={`p-2 rounded text-sm ${vista === 'lista' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setVista('multifase')}
                  className={`p-2 rounded text-sm ${vista === 'multifase' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  Multi-fase
                </button>
              </div>
              
              <button onClick={() => handleNuevaTarea()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              />
            </div>

            <select value={filtros.fase} onChange={(e) => handleFiltroChange('fase', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Todas las fases</option>
              {fases.map(fase => (
                <option key={fase.idFase || fase.id} value={fase.idFase || fase.id}>{fase.nombre}</option>
              ))}
            </select>

            <select value={filtros.estado} onChange={(e) => handleFiltroChange('estado', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
            </select>

            <select value={filtros.prioridad} onChange={(e) => handleFiltroChange('prioridad', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Todas las prioridades</option>
              <option value="ALTA">🔴 Alta</option>
              <option value="MEDIA">🟡 Media</option>
              <option value="BAJA">🟢 Baja</option>
            </select>

            <select value={filtros.asignado} onChange={(e) => handleFiltroChange('asignado', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">Todos los asignados</option>
              {recursos.map(recurso => (
                <option key={recurso.id} value={recurso.id}>{recurso.nombre}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filtros.soloMultifase}
                onChange={(e) => handleFiltroChange('soloMultifase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Solo multi-fase</span>
            </label>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Tareas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{tareasFiltradas.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tareasVencidas.length} vencidas, {tareasMultifase.length} multi-fase
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Split className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Multi-fase</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {tareasFiltradas.filter(t => (t.participacionFases && t.participacionFases.length > 1) || t.esMultifase).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completadas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {tareasFiltradas.filter(t => t.estado === 'COMPLETADA' || t.estado === 'Completada').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Vencidas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {tareasVencidas.length}
            </p>
          </div>
        </div>

        {/* Vista por Fases */}
        {vista === 'fases' && (
          <div className="space-y-6">
            {tareasPorFase.map(fase => {
              const stats = calcularEstadisticasFase(fase);
              
              return (
                <div key={fase.idFase || fase.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: fase.color || '#3B82F6' }} />
                        <h2 className="text-lg font-semibold text-gray-900">{fase.nombre}</h2>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                          {stats.total} tareas
                        </span>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                          {stats.horasEnFase}h asignadas
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">Progreso: {stats.progreso}%</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${stats.progreso}%`, backgroundColor: fase.color || '#3B82F6' }} />
                        </div>
                        <button onClick={() => handleNuevaTarea(fase.idFase || fase.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {fase.tareas.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {fase.tareas.map(tarea => (
                          <TareaAvanzadaCard 
                            key={tarea.id || tarea.idTarea}
                            tarea={tarea}
                            recursos={recursos}
                            fases={fases}
                            onEditar={handleEditarTarea}
                            onEliminar={handleEliminarTarea}
                            onCambiarEstado={handleCambiarEstado}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No hay tareas en esta fase</p>
                        <button onClick={() => handleNuevaTarea(fase.idFase || fase.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                          Crear primera tarea
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Vista Lista */}
        {vista === 'lista' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Tareas</h2>
            </div>
            <div className="p-4">
              {tareasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tareasFiltradas.map(tarea => (
                    <TareaAvanzadaCard 
                      key={tarea.id || tarea.idTarea}
                      tarea={tarea}
                      recursos={recursos}
                      fases={fases}
                      onEditar={handleEditarTarea}
                      onEliminar={handleEliminarTarea}
                      onCambiarEstado={handleCambiarEstado}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tareas</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista Multi-fase */}
        {vista === 'multifase' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tareas Multi-fase</h2>
              <p className="text-sm text-gray-600">Tareas que participan en múltiples fases del proyecto</p>
            </div>
            <div className="p-4">
              {tareasFiltradas.filter(t => (t.participacionFases && t.participacionFases.length > 1) || t.esMultifase).length > 0 ? (
                <div className="space-y-6">
                  {tareasFiltradas
                    .filter(t => (t.participacionFases && t.participacionFases.length > 1) || t.esMultifase)
                    .map(tarea => (
                      <div key={tarea.id || tarea.idTarea} className="border border-gray-200 rounded-lg p-4">
                        <TareaAvanzadaCard 
                          tarea={tarea}
                          recursos={recursos}
                          fases={fases}
                          onEditar={handleEditarTarea}
                          onEliminar={handleEliminarTarea}
                          onCambiarEstado={handleCambiarEstado}
                        />
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Split className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas multi-fase</h3>
                  <p className="text-gray-600 mb-4">
                    Las tareas multi-fase participan en varias fases del proyecto simultáneamente
                  </p>
                  <button onClick={() => handleNuevaTarea()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Crear Tarea Multi-fase
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sin resultados general */}
        {tareasFiltradas.length === 0 && vista !== 'multifase' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tareas</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filtros).some(f => f) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea la primera tarea del proyecto'
              }
            </p>
            <button onClick={() => handleNuevaTarea()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Nueva Tarea
            </button>
          </div>
        )}

        {/* Información sobre datos de API */}
        {(tareasVencidas.length > 0 || tareasMultifase.length > 0) && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Datos de API</span>
            </div>
            <p className="text-sm text-blue-700">
              Mostrando {tareasVencidas.length} tareas vencidas y {tareasMultifase.length} tareas multi-fase desde la API real.
              {' '}Las funcionalidades completas de gestión de tareas estarán disponibles cuando se implemente la API completa.
            </p>
          </div>
        )}
      </div>

      {/* Modal Formulario */}
      {mostrarFormulario && (
        <TareaAvanzadaForm 
          tarea={tareaEditando}
          fases={fases}
          recursos={recursos}
          proyectoId={proyectoId}
          onGuardar={handleGuardarTarea}
          onCancelar={() => {
            setMostrarFormulario(false);
            setTareaEditando(null);
          }}
        />
      )}
    </div>
  );
}
