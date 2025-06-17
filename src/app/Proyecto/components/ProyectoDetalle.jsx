"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Edit, Users, Calendar, Building2, Package, 
  TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart3,
  Plus, List, Target, FileText, Layers
} from 'lucide-react';
import { useProyecto, useFases, useRiesgos } from '../../../api/hooks'; // ✅ Hooks reales

function EstadoBadge({ estado }) {
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PAUSADO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getEstadoStyles(estado)}`}>
      {estado.replace('_', ' ')}
    </span>
  );
}

function MetricaCard({ titulo, valor, icono: Icon, color = "blue", descripcion, trend }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{valor}</p>
          {descripcion && (
            <p className="text-xs text-gray-500 mt-1">{descripcion}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% vs mes anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function FaseCard({ fase, onGestionarTareas }) {
  const getEstadoIcon = (estadoDescriptivo) => {
    switch (estadoDescriptivo) {
      case 'Completada':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'En Progreso':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Pendiente':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const isAtrasada = () => {
    if (!fase.fechaFinEstimada) return false;
    const hoy = new Date();
    const fechaFin = new Date(fase.fechaFinEstimada);
    return hoy > fechaFin && fase.estadoDescriptivo !== 'Completada';
  };

  // ✅ Calcular progreso basado en datos reales
  const porcentajeAvance = useMemo(() => {
    // Si no hay tareas, usar el estado descriptivo
    if (!fase.tareas || fase.tareas.length === 0) {
      switch (fase.estadoDescriptivo) {
        case 'Completada': return 100;
        case 'En Progreso': return 50;
        case 'Pendiente': return 0;
        default: return 0;
      }
    }
    
    // Calcular basado en tareas completadas
    const tareasCompletadas = fase.tareas.filter(t => t.estado === 'COMPLETADA').length;
    return Math.round((tareasCompletadas / fase.tareas.length) * 100);
  }, [fase.tareas, fase.estadoDescriptivo]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isAtrasada() ? 'border-red-500' : 
      fase.estadoDescriptivo === 'Completada' ? 'border-green-500' : 
      fase.estadoDescriptivo === 'En Progreso' ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getEstadoIcon(fase.estadoDescriptivo)}
            <h3 className="text-lg font-semibold text-gray-900">{fase.nombre}</h3>
            <EstadoBadge estado={fase.estadoDescriptivo} />
          </div>
          
          {isAtrasada() && (
            <div className="flex items-center gap-1 text-red-600 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Atrasada</span>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            {(fase.fechaInicio || fase.fechaFinEstimada) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {fase.fechaInicio ? new Date(fase.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha inicio'} - {' '}
                  {fase.fechaFinEstimada ? new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES') : 'Sin fecha fin'}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span>
                {fase.tareas ? `${fase.tareas.filter(t => t.estado === 'COMPLETADA').length} / ${fase.tareas.length} tareas completadas` : 'Sin tareas asignadas'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onGestionarTareas(fase)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded transition-colors"
        >
          Gestionar →
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progreso</span>
          <span className="font-medium">{porcentajeAvance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              fase.estadoDescriptivo === 'Completada' ? 'bg-green-500' :
              fase.estadoDescriptivo === 'En Progreso' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${porcentajeAvance}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProyectoDetalle({ proyectoId, onVolver, onEditar, onGestionarTareas, onGestionarFases }) {
  // ✅ Usar hooks reales
  const { proyecto, estadisticas, loading: proyectoLoading, error: proyectoError, cargarProyecto } = useProyecto(proyectoId);
  const { fases, loading: fasesLoading, error: fasesError } = useFases(proyectoId);
  const { riesgos, loading: riesgosLoading, error: riesgosError } = useRiesgos(proyectoId);
  
  const [vistaActual, setVistaActual] = useState('general');

  // ✅ Estado de carga combinado
  const loading = proyectoLoading || fasesLoading || riesgosLoading;
  const error = proyectoError || fasesError || riesgosError;

  // ✅ Cálculos basados en datos reales
  const metricas = useMemo(() => {
    if (!proyecto || !fases) return null;

    // Calcular métricas desde fases reales
    const totalTareas = fases.reduce((total, fase) => {
      return total + (fase.tareas ? fase.tareas.length : 0);
    }, 0);

    const tareasCompletadas = fases.reduce((total, fase) => {
      return total + (fase.tareas ? fase.tareas.filter(t => t.estado === 'COMPLETADA').length : 0);
    }, 0);

    const tareasEnProgreso = fases.reduce((total, fase) => {
      return total + (fase.tareas ? fase.tareas.filter(t => t.estado === 'EN_PROGRESO').length : 0);
    }, 0);

    const tareasPendientes = fases.reduce((total, fase) => {
      return total + (fase.tareas ? fase.tareas.filter(t => t.estado === 'PENDIENTE').length : 0);
    }, 0);

    // Calcular tareas vencidas (estimación)
    const tareasVencidas = fases.reduce((total, fase) => {
      if (!fase.tareas) return total;
      return total + fase.tareas.filter(tarea => {
        if (!tarea.fechaFinEstimada || tarea.estado === 'COMPLETADA') return false;
        return new Date() > new Date(tarea.fechaFinEstimada);
      }).length;
    }, 0);

    return {
      totalTareas,
      tareasCompletadas,
      tareasEnProgreso,
      tareasPendientes,
      tareasVencidas,
      presupuestoUtilizado: 68 // Mock por ahora
    };
  }, [proyecto, fases]);

  const calcularDiasRestantes = () => {
    if (!proyecto?.fechaFinEstimada) return 0;
    const hoy = new Date();
    const fechaFin = new Date(proyecto.fechaFinEstimada);
    const diferencia = fechaFin - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const porcentajeAvanceProyecto = useMemo(() => {
    if (!fases || fases.length === 0) return 0;
    
    const totalAvance = fases.reduce((total, fase) => {
      switch (fase.estadoDescriptivo) {
        case 'Completada': return total + 100;
        case 'En Progreso': return total + 50;
        case 'Pendiente': return total + 0;
        default: return total + 0;
      }
    }, 0);
    
    return Math.round(totalAvance / fases.length);
  }, [fases]);

  // ✅ Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar proyecto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={cargarProyecto}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={onVolver}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto desde la base de datos...</p>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
          <p className="text-gray-600 mb-4">El proyecto solicitado no existe o no tienes permisos para verlo</p>
          <button
            onClick={onVolver}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const diasRestantes = calcularDiasRestantes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onVolver}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{proyecto.nombre}</h1>
                  <EstadoBadge estado={proyecto.estado} />
                </div>
                <p className="text-gray-600">{proyecto.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => onGestionarFases && onGestionarFases(proyecto)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Gestionar Fases
              </button>
              <button
                onClick={() => onEditar && onEditar(proyecto)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => onGestionarTareas && onGestionarTareas(proyecto)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Gestionar Tareas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navegación de pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setVistaActual('general')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  vistaActual === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setVistaActual('fases')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${
                  vistaActual === 'fases'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="w-4 h-4" />
                Fases ({fases?.length || 0})
              </button>
              <button
                onClick={() => setVistaActual('cronograma')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  vistaActual === 'cronograma'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cronograma
              </button>
              <button
                onClick={() => setVistaActual('metricas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  vistaActual === 'metricas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Métricas
              </button>
            </nav>
          </div>
        </div>

        {/* Vista General */}
        {vistaActual === 'general' && (
          <div className="space-y-6">
            {/* Información del Proyecto */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info Principal */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Líder del Proyecto</p>
                        <p className="font-medium">{proyecto.liderProyecto || 'Sin asignar'}</p>
                      </div>
                    </div>

                    {(proyecto.fechaInicio || proyecto.fechaFinEstimada) && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Duración</p>
                          <p className="font-medium">
                            {proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha inicio'} - {' '}
                            {proyecto.fechaFinEstimada ? new Date(proyecto.fechaFinEstimada).toLocaleDateString('es-ES') : 'Sin fecha fin'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Fases</p>
                        <p className="font-medium">{fases?.length || 0} fases configuradas</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Progreso General</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${porcentajeAvanceProyecto}%` }}
                          />
                        </div>
                        <span className="font-semibold text-lg">{porcentajeAvanceProyecto}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Riesgos</p>
                      <div className="flex flex-wrap gap-2">
                        {riesgos && riesgos.length > 0 ? (
                          riesgos.slice(0, 3).map((riesgo, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                                riesgo.estado === 'ACTIVO' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {riesgo.probabilidad}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Sin riesgos registrados</span>
                        )}
                      </div>
                    </div>

                    {proyecto.fechaFinEstimada && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Días Restantes</p>
                        <p className={`font-semibold text-lg ${
                          diasRestantes < 0 ? 'text-red-600' : 
                          diasRestantes < 15 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {diasRestantes < 0 ? `${Math.abs(diasRestantes)} días atrasado` : `${diasRestantes} días`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
                {estadisticas ? (
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{estadisticas.totalTareas || 0}</div>
                      <div className="text-sm text-blue-800">Total Tareas</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{estadisticas.riesgosActivos || 0}</div>
                      <div className="text-sm text-green-800">Riesgos Activos</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{fases?.length || 0}</div>
                      <div className="text-sm text-purple-800">Fases</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Cargando estadísticas...</p>
                )}
              </div>
            </div>

            {/* Métricas Rápidas */}
            {metricas && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricaCard 
                  titulo="Total Tareas" 
                  valor={metricas.totalTareas}
                  icono={List}
                  color="blue"
                />
                <MetricaCard 
                  titulo="Completadas" 
                  valor={metricas.tareasCompletadas}
                  icono={CheckCircle}
                  color="green"
                />
                <MetricaCard 
                  titulo="En Progreso" 
                  valor={metricas.tareasEnProgreso}
                  icono={Clock}
                  color="yellow"
                />
                <MetricaCard 
                  titulo="Vencidas" 
                  valor={metricas.tareasVencidas}
                  icono={AlertTriangle}
                  color="red"
                />
              </div>
            )}
          </div>
        )}

        {/* Vista Fases */}
        {vistaActual === 'fases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Gestión de Fases del Proyecto</h2>
                  <p className="text-gray-600 text-sm mt-1">Vista resumida de las fases. Para gestión completa, usa el botón "Gestionar Fases"</p>
                </div>
                <button
                  onClick={() => onGestionarFases && onGestionarFases(proyecto)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Gestión Completa
                </button>
              </div>
              
              {fases && fases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fases.map((fase) => (
                    <div key={fase.idFase} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <h3 className="font-medium text-gray-900">{fase.nombre}</h3>
                        <EstadoBadge estado={fase.estadoDescriptivo} />
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Orden: {fase.orden}</span>
                        </div>
                        {(fase.fechaInicio || fase.fechaFinEstimada) && (
                          <div className="text-xs">
                            {fase.fechaInicio ? new Date(fase.fechaInicio).toLocaleDateString('es-ES') : 'Sin inicio'} - {' '}
                            {fase.fechaFinEstimada ? new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES') : 'Sin fin'}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => onGestionarTareas && onGestionarTareas(proyecto, fase)}
                        className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver tareas →
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fases configuradas</h3>
                  <p className="text-gray-600 mb-4">Crea las fases del proyecto para organizar el trabajo</p>
                  <button
                    onClick={() => onGestionarFases && onGestionarFases(proyecto)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Crear primera fase
                  </button>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Vista Rápida de Fases</span>
                </div>
                <p className="text-purple-700 text-sm">
                  Esta es una vista resumida de las fases del proyecto. Para gestión completa (crear, editar, reordenar fases), 
                  usa el botón "Gestión Completa" o "Gestionar Fases" en el header.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vista Cronograma */}
        {vistaActual === 'cronograma' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Cronograma del Proyecto</h2>
              <button
                onClick={() => onGestionarTareas && onGestionarTareas(proyecto)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Tarea
              </button>
            </div>

            {fases && fases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fases.map((fase) => (
                  <FaseCard 
                    key={fase.idFase} 
                    fase={fase} 
                    onGestionarTareas={(fase) => onGestionarTareas && onGestionarTareas(proyecto, fase)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fases para mostrar</h3>
                <p className="text-gray-600 mb-4">Crea fases para visualizar el cronograma del proyecto</p>
                <button
                  onClick={() => onGestionarFases && onGestionarFases(proyecto)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Crear fases
                </button>
              </div>
            )}
          </div>
        )}

        {/* Vista Métricas */}
        {vistaActual === 'metricas' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Métricas y Análisis</h2>
            
            {metricas ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MetricaCard 
                    titulo="Progreso General" 
                    valor={`${porcentajeAvanceProyecto}%`}
                    icono={TrendingUp}
                    color="blue"
                    descripcion="Completado del proyecto"
                  />
                  <MetricaCard 
                    titulo="Eficiencia" 
                    valor={`${metricas.totalTareas > 0 ? Math.round((metricas.tareasCompletadas / metricas.totalTareas) * 100) : 0}%`}
                    icono={Target}
                    color="green"
                    descripcion="Tareas completadas vs total"
                  />
                  <MetricaCard 
                    titulo="Días Restantes" 
                    valor={diasRestantes > 0 ? diasRestantes : 0}
                    icono={Calendar}
                    color={diasRestantes < 15 ? "yellow" : "green"}
                    descripcion="Para completar el proyecto"
                  />
                  <MetricaCard 
                    titulo="Presupuesto Usado" 
                    valor={`${metricas.presupuestoUtilizado}%`}
                    icono={BarChart3}
                    color="purple"
                    descripcion="Del presupuesto total (estimado)"
                  />
                  <MetricaCard 
                    titulo="Tareas Vencidas" 
                    valor={metricas.tareasVencidas}
                    icono={AlertTriangle}
                    color="red"
                    descripcion="Requieren atención"
                  />
                  <MetricaCard 
                    titulo="Riesgos Activos" 
                    valor={riesgos?.filter(r => r.estado === 'ACTIVO').length || 0}
                    icono={AlertTriangle}
                    color="yellow"
                    descripcion="Riesgos sin mitigar"
                  />
                </div>

                {/* Gráfico de progreso por fase */}
                {fases && fases.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Fase</h3>
                    <div className="space-y-4">
                      {fases.map((fase) => {
                        const progreso = (() => {
                          switch (fase.estadoDescriptivo) {
                            case 'Completada': return 100;
                            case 'En Progreso': return 50;
                            case 'Pendiente': return 0;
                            default: return 0;
                          }
                        })();

                        return (
                          <div key={fase.idFase} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium text-gray-700">
                              {fase.nombre}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div 
                                className={`h-4 rounded-full transition-all duration-300 ${
                                  fase.estadoDescriptivo === 'Completada' ? 'bg-green-500' :
                                  fase.estadoDescriptivo === 'En Progreso' ? 'bg-blue-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${progreso}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm font-medium text-gray-900">
                              {progreso}%
                            </div>
                            <div className="w-20 text-xs text-gray-500">
                              {fase.estadoDescriptivo}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Distribución de riesgos */}
                {riesgos && riesgos.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Riesgos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {riesgos.filter(r => r.probabilidad === 'ALTA').length}
                        </div>
                        <div className="text-sm text-red-800">Riesgos Alta Probabilidad</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {riesgos.filter(r => r.impacto === 'ALTO').length}
                        </div>
                        <div className="text-sm text-yellow-800">Riesgos Alto Impacto</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {riesgos.filter(r => r.estado === 'MITIGADO').length}
                        </div>
                        <div className="text-sm text-green-800">Riesgos Mitigados</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos para métricas</h3>
                <p className="text-gray-600 mb-4">Agrega fases y tareas para ver métricas detalladas</p>
                <button
                  onClick={() => onGestionarFases && onGestionarFases(proyecto)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Configurar proyecto
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
