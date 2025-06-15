'use client';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, TrendingUp, Users, Clock, AlertCircle, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data - después esto viene del backend
const mockProyectos = [
  {
    idProyecto: 1,
    nombre: "Implementación SAP ERP",
    descripcion: "Migración completa a SAP ERP 7.51",
    estado: "ACTIVO",
    liderProyecto: "Leonardo Felici",
    cliente: { nombre: "Empresa ABC S.A." },
    fechaInicio: "2024-01-15",
    fechaFinEstimada: "2024-06-30",
    porcentajeAvance: 65,
    totalTareas: 24,
    tareasCompletadas: 16,
    riesgosActivos: 2,
    productos: ["SAP ERP 7.51"]
  },
  {
    idProyecto: 2,
    nombre: "Migración Oracle Cloud",
    descripcion: "Actualización a Oracle ERP Cloud 23C",
    estado: "ACTIVO", 
    liderProyecto: "María González",
    cliente: { nombre: "TechCorp Ltd." },
    fechaInicio: "2024-02-01",
    fechaFinEstimada: "2024-08-15",
    porcentajeAvance: 30,
    totalTareas: 18,
    tareasCompletadas: 5,
    riesgosActivos: 1,
    productos: ["Oracle ERP Cloud 23C"]
  },
  {
    idProyecto: 3,
    nombre: "Deploy Salesforce CRM",
    descripcion: "Implementación Salesforce 2025 Spring Release",
    estado: "PAUSADO",
    liderProyecto: "Carlos Mendoza", 
    cliente: { nombre: "InnovateCorp" },
    fechaInicio: "2024-03-01",
    fechaFinEstimada: "2024-07-30",
    porcentajeAvance: 45,
    totalTareas: 15,
    tareasCompletadas: 7,
    riesgosActivos: 3,
    productos: ["Salesforce CRM 2025 Spring Release"]
  }
];

const mockEstadisticas = {
  totalProyectos: 15,
  proyectosActivos: 12,
  proyectosPausados: 2, 
  proyectosCerrados: 1,
  porcentajeAvancePromedio: 47,
  riesgosActivos: 8,
  tareasVencidas: 5
};

function ProyectoCard({ proyecto, onVerDetalle, onEditarProyecto, onGestionarTareas }) {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-green-100 text-green-800';
      case 'PAUSADO': return 'bg-yellow-100 text-yellow-800';
      case 'CERRADO': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRiesgoColor = (riesgos) => {
    if (riesgos === 0) return 'text-green-600';
    if (riesgos <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600" 
              onClick={() => onVerDetalle(proyecto.idProyecto)}>
            {proyecto.nombre}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{proyecto.descripcion}</p>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(proyecto.estado)}`}>
            {proyecto.estado}
          </span>
        </div>
        
        {/* Dropdown menu para acciones */}
        <div className="relative group">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="py-1">
              <button
                onClick={() => onVerDetalle(proyecto.idProyecto)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver detalles
              </button>
              <button
                onClick={() => onEditarProyecto(proyecto)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar proyecto
              </button>
              <button
                onClick={() => onGestionarTareas(proyecto)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gestionar tareas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span className="font-medium">Líder:</span>
          <span className="ml-1">{proyecto.liderProyecto}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Cliente:</span>
          <span className="ml-1">{proyecto.cliente.nombre}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{new Date(proyecto.fechaFinEstimada).toLocaleDateString('es-ES')}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progreso</span>
            <span className="font-medium">{proyecto.porcentajeAvance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${proyecto.porcentajeAvance}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <span className="text-gray-600">Tareas:</span>
            <span className="ml-1 font-medium">{proyecto.tareasCompletadas}/{proyecto.totalTareas}</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className={`w-4 h-4 mr-1 ${getRiesgoColor(proyecto.riesgosActivos)}`} />
            <span className={`font-medium ${getRiesgoColor(proyecto.riesgosActivos)}`}>
              {proyecto.riesgosActivos} riesgos
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {proyecto.productos.slice(0, 2).map((producto, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                {producto}
              </span>
            ))}
            {proyecto.productos.length > 2 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded">
                +{proyecto.productos.length - 2}
              </span>
            )}
          </div>
          <button 
            onClick={() => onVerDetalle(proyecto.idProyecto)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Ver detalles →
          </button>
        </div>
      </div>
    </div>
  );
}

function EstadisticaCard({ titulo, valor, icono: Icon, color = "blue", descripcion }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
          {descripcion && (
            <p className="text-xs text-gray-500 mt-1">{descripcion}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function ProyectoDashboard() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    lider: ''
  });
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProyectos(mockProyectos);
      setEstadisticas(mockEstadisticas);
      setLoading(false);
    };
    
    cargarDatos();
  }, []);

  // Filtrar proyectos
  const proyectosFiltrados = proyectos.filter(proyecto => {
    const cumpleBusqueda = proyecto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                          proyecto.cliente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const cumpleEstado = !filtros.estado || proyecto.estado === filtros.estado;
    const cumpleLider = !filtros.lider || proyecto.liderProyecto.toLowerCase().includes(filtros.lider.toLowerCase());
    
    return cumpleBusqueda && cumpleEstado && cumpleLider;
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Handlers para navegación
  const handleVerDetalle = (proyectoId) => {
    router.push(`/Proyecto/${proyectoId}`);
  };

  const handleNuevoProyecto = () => {
    router.push('/Proyecto/crear');
  };

  const handleEditarProyecto = (proyecto) => {
    router.push(`/Proyecto/${proyecto.idProyecto}/editar`);
  };

  const handleGestionarTareas = (proyecto) => {
    router.push(`/Proyecto/${proyecto.idProyecto}/tareas`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
              <p className="text-gray-600 mt-1">Panel de control y seguimiento de proyectos PSA</p>
            </div>
            <button 
              onClick={handleNuevoProyecto}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Proyecto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <EstadisticaCard 
              titulo="Total Proyectos" 
              valor={estadisticas.totalProyectos}
              icono={TrendingUp}
              color="blue"
            />
            <EstadisticaCard 
              titulo="Proyectos Activos" 
              valor={estadisticas.proyectosActivos}
              icono={Users}
              color="green" 
            />
            <EstadisticaCard 
              titulo="Progreso Promedio" 
              valor={`${estadisticas.porcentajeAvancePromedio}%`}
              icono={TrendingUp}
              color="blue"
            />
            <EstadisticaCard 
              titulo="Riesgos Activos" 
              valor={estadisticas.riesgosActivos}
              icono={AlertCircle}
              color="yellow"
            />
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar proyectos o clientes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="PAUSADO">Pausado</option>
                <option value="CERRADO">Cerrado</option>
              </select>
              
              <input
                type="text"
                placeholder="Filtrar por líder..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={filtros.lider}
                onChange={(e) => handleFiltroChange('lider', e.target.value)}
              >
              </input>
            </div>
          </div>
        </div>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {proyectosFiltrados.length > 0 ? (
            proyectosFiltrados.map(proyecto => (
              <ProyectoCard 
                key={proyecto.idProyecto} 
                proyecto={proyecto} 
                onVerDetalle={handleVerDetalle}
                onEditarProyecto={handleEditarProyecto}
                onGestionarTareas={handleGestionarTareas}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
              <p className="text-gray-600">Intenta ajustar los filtros o crear un nuevo proyecto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
