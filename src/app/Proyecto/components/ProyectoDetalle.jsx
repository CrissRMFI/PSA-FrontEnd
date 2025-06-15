"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit, Users, Calendar, Building2, Package, 
  TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart3,
  Plus, List, Target, FileText, Layers
} from 'lucide-react';

// Mock data - después esto viene del backend
const mockProyectoDetalle = {
  idProyecto: 1,
  nombre: "Implementación SAP ERP",
  descripcion: "Migración completa del sistema legacy a SAP ERP 7.51 para optimizar procesos de negocio y mejorar la eficiencia operacional",
  estado: "ACTIVO",
  liderProyecto: "Leonardo Felici",
  cliente: { 
    id: 1, 
    nombre: "Empresa ABC S.A.",
    email: "contacto@empresaabc.com" 
  },
  fechaInicio: "2024-01-15",
  fechaFinEstimada: "2024-06-30",
  fechaFinReal: null,
  porcentajeAvance: 65,
  productos: ["SAP ERP 7.51", "SAP Fiori"],
  recursos: [
    { id: 1, nombre: "Leonardo Felici", rol: "Project Manager" },
    { id: 2, nombre: "María González", rol: "Desarrollador Senior" },
    { id: 3, nombre: "Carlos Mendoza", rol: "Analista Funcional" },
    { id: 4, nombre: "Ana Rodríguez", rol: "Tester" }
  ],
  fases: [
    {
      id: 1,
      nombre: "Análisis y Diseño",
      orden: 1,
      fechaInicio: "2024-01-15",
      fechaFinEstimada: "2024-02-15",
      porcentajeAvance: 100,
      estado: "COMPLETADA",
      tareasTotal: 8,
      tareasCompletadas: 8,
      color: "#3B82F6"
    },
    {
      id: 2,
      nombre: "Desarrollo",
      orden: 2,
      fechaInicio: "2024-02-16",
      fechaFinEstimada: "2024-04-30",
      porcentajeAvance: 75,
      estado: "EN_PROGRESO",
      tareasTotal: 15,
      tareasCompletadas: 11,
      color: "#8B5CF6"
    },
    {
      id: 3,
      nombre: "Testing y QA",
      orden: 3,
      fechaInicio: "2024-05-01",
      fechaFinEstimada: "2024-06-15",
      porcentajeAvance: 30,
      estado: "EN_PROGRESO",
      tareasTotal: 10,
      tareasCompletadas: 3,
      color: "#10B981"
    },
    {
      id: 4,
      nombre: "Despliegue",
      orden: 4,
      fechaInicio: "2024-06-16",
      fechaFinEstimada: "2024-06-30",
      porcentajeAvance: 0,
      estado: "PENDIENTE",
      tareasTotal: 5,
      tareasCompletadas: 0,
      color: "#F59E0B"
    }
  ],
  metricas: {
    totalTareas: 38,
    tareasCompletadas: 22,
    tareasEnProgreso: 8,
    tareasPendientes: 8,
    tareasVencidas: 2,
    diasRestantes: 45,
    presupuestoUtilizado: 68
  }
};

function EstadoBadge({ estado }) {
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PAUSADO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDIENTE':
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
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'COMPLETADA':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'EN_PROGRESO':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'PENDIENTE':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const isAtrasada = () => {
    const hoy = new Date();
    const fechaFin = new Date(fase.fechaFinEstimada);
    return hoy > fechaFin && fase.estado !== 'COMPLETADA';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isAtrasada() ? 'border-red-500' : 
      fase.estado === 'COMPLETADA' ? 'border-green-500' : 
      fase.estado === 'EN_PROGRESO' ? 'border-blue-500' : 'border-gray-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getEstadoIcon(fase.estado)}
            <h3 className="text-lg font-semibold text-gray-900">{fase.nombre}</h3>
            <EstadoBadge estado={fase.estado} />
          </div>
          
          {isAtrasada() && (
            <div className="flex items-center gap-1 text-red-600 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Atrasada</span>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(fase.fechaInicio).toLocaleDateString('es-ES')} - {' '}
                {new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span>
                {fase.tareasCompletadas} / {fase.tareasTotal} tareas completadas
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
          <span className="font-medium">{fase.porcentajeAvance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              fase.estado === 'COMPLETADA' ? 'bg-green-500' :
              fase.estado === 'EN_PROGRESO' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            style={{ width: `${fase.porcentajeAvance}%` }}
          />
        </div>
      </div>
    </div>
  );
}
// Continúa desde Parte 1...

export default function ProyectoDetalle({ proyectoId, onVolver, onEditar, onGestionarTareas, onGestionarFases }) {
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('general'); // general, fases, cronograma, metricas

  useEffect(() => {
    cargarProyecto();
  }, [proyectoId]);

  const cargarProyecto = async () => {
    setLoading(true);
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProyecto(mockProyectoDetalle);
    } catch (error) {
      console.error('Error cargando proyecto:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularDiasRestantes = () => {
    if (!proyecto) return 0;
    const hoy = new Date();
    const fechaFin = new Date(proyecto.fechaFinEstimada);
    const diferencia = fechaFin - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
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
                <p className="text-gray-600">{proyecto.descripcion}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* ✨ NUEVO: Botón Gestionar Fases */}
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
              {/* ✨ NUEVA: Pestaña Fases */}
              <button
                onClick={() => setVistaActual('fases')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${
                  vistaActual === 'fases'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="w-4 h-4" />
                Fases
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
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-medium">{proyecto.cliente.nombre}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Líder del Proyecto</p>
                        <p className="font-medium">{proyecto.liderProyecto}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="font-medium">
                          {new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')} - {' '}
                          {new Date(proyecto.fechaFinEstimada).toLocaleDateString('es-ES')}
                        </p>
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
                            style={{ width: `${proyecto.porcentajeAvance}%` }}
                          />
                        </div>
                        <span className="font-semibold text-lg">{proyecto.porcentajeAvance}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Productos</p>
                      <div className="flex flex-wrap gap-2">
                        {proyecto.productos.map((producto, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                          >
                            <Package className="w-3 h-3" />
                            {producto}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Días Restantes</p>
                      <p className={`font-semibold text-lg ${
                        diasRestantes < 0 ? 'text-red-600' : 
                        diasRestantes < 15 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {diasRestantes < 0 ? `${Math.abs(diasRestantes)} días atrasado` : `${diasRestantes} días`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipo */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipo del Proyecto</h2>
                <div className="space-y-3">
                  {proyecto.recursos.map((recurso) => (
                    <div key={recurso.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{recurso.nombre}</p>
                        <p className="text-xs text-gray-500">{recurso.rol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricaCard 
                titulo="Total Tareas" 
                valor={proyecto.metricas.totalTareas}
                icono={List}
                color="blue"
              />
              <MetricaCard 
                titulo="Completadas" 
                valor={proyecto.metricas.tareasCompletadas}
                icono={CheckCircle}
                color="green"
              />
              <MetricaCard 
                titulo="En Progreso" 
                valor={proyecto.metricas.tareasEnProgreso}
                icono={Clock}
                color="yellow"
              />
              <MetricaCard 
                titulo="Vencidas" 
                valor={proyecto.metricas.tareasVencidas}
                icono={AlertTriangle}
                color="red"
              />
            </div>
          </div>
        )}

        {/* ✨ NUEVA: Vista Fases */}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {proyecto.fases.map((fase) => (
                  <div key={fase.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: fase.color || '#3B82F6' }}
                      />
                      <h3 className="font-medium text-gray-900">{fase.nombre}</h3>
                      <EstadoBadge estado={fase.estado} />
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Progreso: {fase.porcentajeAvance}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${fase.porcentajeAvance}%`,
                            backgroundColor: fase.color || '#3B82F6'
                          }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Tareas: {fase.tareasCompletadas}/{fase.tareasTotal}</span>
                      </div>
                      <div className="text-xs">
                        {new Date(fase.fechaInicio).toLocaleDateString('es-ES')} - {' '}
                        {new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES')}
                      </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proyecto.fases.map((fase) => (
                <FaseCard 
                  key={fase.id} 
                  fase={fase} 
                  onGestionarTareas={(fase) => onGestionarTareas && onGestionarTareas(proyecto, fase)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Vista Métricas */}
        {vistaActual === 'metricas' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Métricas y Análisis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricaCard 
                titulo="Progreso General" 
                valor={`${proyecto.porcentajeAvance}%`}
                icono={TrendingUp}
                color="blue"
                descripcion="Completado del proyecto"
                trend={5}
              />
              <MetricaCard 
                titulo="Eficiencia" 
                valor={`${Math.round((proyecto.metricas.tareasCompletadas / proyecto.metricas.totalTareas) * 100)}%`}
                icono={Target}
                color="green"
                descripcion="Tareas completadas vs total"
                trend={8}
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
                valor={`${proyecto.metricas.presupuestoUtilizado}%`}
                icono={BarChart3}
                color="purple"
                descripcion="Del presupuesto total"
                trend={-2}
              />
              <MetricaCard 
                titulo="Tareas Vencidas" 
                valor={proyecto.metricas.tareasVencidas}
                icono={AlertTriangle}
                color="red"
                descripcion="Requieren atención"
              />
              <MetricaCard 
                titulo="Equipo Asignado" 
                valor={proyecto.recursos.length}
                icono={Users}
                color="blue"
                descripcion="Recursos trabajando"
              />
            </div>

            {/* Gráfico de progreso por fase */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Fase</h3>
              <div className="space-y-4">
                {proyecto.fases.map((fase) => (
                  <div key={fase.id} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-gray-700">
                      {fase.nombre}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-300 ${
                          fase.estado === 'COMPLETADA' ? 'bg-green-500' :
                          fase.estado === 'EN_PROGRESO' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${fase.porcentajeAvance}%` }}
                      />
                    </div>
                    <div className="w-16 text-sm font-medium text-gray-900">
                      {fase.porcentajeAvance}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
