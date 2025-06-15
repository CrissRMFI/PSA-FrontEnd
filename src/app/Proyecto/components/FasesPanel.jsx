'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, Calendar, Target, 
  ArrowUp, ArrowDown, MoreVertical, CheckCircle, 
  Clock, AlertTriangle, BarChart3, Users, GripVertical  // ✅ USAR ESTE
} from 'lucide-react';

// Mock data - después esto viene del backend
const mockFases = [
  {
    id: 1,
    nombre: "Análisis y Diseño",
    descripcion: "Fase inicial de análisis de requerimientos y diseño de la solución",
    orden: 1,
    fechaInicio: "2024-01-15",
    fechaFinEstimada: "2024-02-15",
    fechaFinReal: "2024-02-14",
    estado: "COMPLETADA",
    color: "#3B82F6", // blue
    prerequisitos: [],
    entregables: [
      "Documento de requerimientos",
      "Diseño de arquitectura",
      "Wireframes y mockups"
    ],
    responsables: [
      { id: 1, nombre: "Leonardo Felici", rol: "Project Manager" },
      { id: 3, nombre: "Carlos Mendoza", rol: "Analista Funcional" }
    ],
    porcentajeAvance: 100,
    presupuestoAsignado: 50000,
    presupuestoUtilizado: 48000,
    horasEstimadas: 200,
    horasReales: 195,
    riesgos: [],
    notas: "Fase completada satisfactoriamente dentro del tiempo estimado"
  },
  {
    id: 2,
    nombre: "Desarrollo",
    descripcion: "Implementación del código y desarrollo de funcionalidades",
    orden: 2,
    fechaInicio: "2024-02-16",
    fechaFinEstimada: "2024-04-30",
    fechaFinReal: null,
    estado: "EN_PROGRESO",
    color: "#8B5CF6", // purple
    prerequisitos: [1],
    entregables: [
      "Módulo de usuarios",
      "Módulo de reportes",
      "APIs REST",
      "Base de datos actualizada"
    ],
    responsables: [
      { id: 2, nombre: "María González", rol: "Desarrollador Senior" },
      { id: 3, nombre: "Carlos Mendoza", rol: "Analista Funcional" }
    ],
    porcentajeAvance: 65,
    presupuestoAsignado: 200000,
    presupuestoUtilizado: 130000,
    horasEstimadas: 800,
    horasReales: 520,
    riesgos: [
      {
        id: 1,
        descripcion: "Complejidad mayor a la estimada en módulo de reportes",
        impacto: "MEDIO",
        probabilidad: "ALTA"
      }
    ],
    notas: "En progreso, algunas funcionalidades más complejas de lo previsto"
  },
  {
    id: 3,
    nombre: "Testing y QA",
    descripcion: "Pruebas exhaustivas y control de calidad del software",
    orden: 3,
    fechaInicio: "2024-04-15",
    fechaFinEstimada: "2024-06-15",
    fechaFinReal: null,
    estado: "PENDIENTE",
    color: "#10B981", // green
    prerequisitos: [2],
    entregables: [
      "Plan de pruebas",
      "Casos de prueba ejecutados",
      "Reporte de bugs",
      "Documentación de testing"
    ],
    responsables: [
      { id: 4, nombre: "Ana Rodríguez", rol: "Tester" }
    ],
    porcentajeAvance: 0,
    presupuestoAsignado: 80000,
    presupuestoUtilizado: 0,
    horasEstimadas: 400,
    horasReales: 0,
    riesgos: [
      {
        id: 2,
        descripcion: "Posibles retrasos si desarrollo se extiende",
        impacto: "ALTO",
        probabilidad: "MEDIA"
      }
    ],
    notas: "Pendiente de inicio, dependiente de finalización de desarrollo"
  },
  {
    id: 4,
    nombre: "Despliegue",
    descripcion: "Implementación en producción y puesta en marcha",
    orden: 4,
    fechaInicio: "2024-06-16",
    fechaFinEstimada: "2024-06-30",
    fechaFinReal: null,
    estado: "PENDIENTE",
    color: "#F59E0B", // orange
    prerequisitos: [3],
    entregables: [
      "Sistema en producción",
      "Documentación de despliegue",
      "Manual de usuario",
      "Capacitación realizada"
    ],
    responsables: [
      { id: 1, nombre: "Leonardo Felici", rol: "Project Manager" },
      { id: 2, nombre: "María González", rol: "Desarrollador Senior" }
    ],
    porcentajeAvance: 0,
    presupuestoAsignado: 70000,
    presupuestoUtilizado: 0,
    horasEstimadas: 300,
    horasReales: 0,
    riesgos: [],
    notas: "Fase final del proyecto"
  }
];

const mockRecursos = [
  { id: 1, nombre: "Leonardo Felici", rol: "Project Manager" },
  { id: 2, nombre: "María González", rol: "Desarrollador Senior" },
  { id: 3, nombre: "Carlos Mendoza", rol: "Analista Funcional" },
  { id: 4, nombre: "Ana Rodríguez", rol: "Tester" }
];

const coloresDisponibles = [
  { valor: "#3B82F6", nombre: "Azul" },
  { valor: "#8B5CF6", nombre: "Púrpura" },
  { valor: "#10B981", nombre: "Verde" },
  { valor: "#F59E0B", nombre: "Naranja" },
  { valor: "#EF4444", nombre: "Rojo" },
  { valor: "#6B7280", nombre: "Gris" },
  { valor: "#EC4899", nombre: "Rosa" },
  { valor: "#14B8A6", nombre: "Teal" }
];

function EstadoBadge({ estado }) {
  const getEstadoStyles = (estado) => {
    switch (estado) {
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDIENTE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PAUSADA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getEstadoStyles(estado)}`}>
      {estado.replace('_', ' ')}
    </span>
  );
}

function RiesgoIndicator({ riesgos }) {
  if (!riesgos || riesgos.length === 0) {
    return <span className="text-green-600 text-sm">✓ Sin riesgos</span>;
  }

  const riesgosAltos = riesgos.filter(r => r.impacto === 'ALTO').length;
  const riesgosMedios = riesgos.filter(r => r.impacto === 'MEDIO').length;

  if (riesgosAltos > 0) {
    return <span className="text-red-600 text-sm">⚠️ {riesgosAltos} riesgo(s) alto(s)</span>;
  }
  if (riesgosMedios > 0) {
    return <span className="text-yellow-600 text-sm">⚠️ {riesgosMedios} riesgo(s) medio(s)</span>;
  }
  return <span className="text-blue-600 text-sm">ℹ️ {riesgos.length} riesgo(s) bajo(s)</span>;
}

function FaseCard({ fase, onEditar, onEliminar, onMoverArriba, onMoverAbajo, puedeSubir, puedeBajar, recursos }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const calcularDiasRestantes = () => {
    if (!fase.fechaFinEstimada || fase.estado === 'COMPLETADA') return null;
    const hoy = new Date();
    const fechaFin = new Date(fase.fechaFinEstimada);
    const diferencia = fechaFin - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias;
  };

  const diasRestantes = calcularDiasRestantes();
  const isAtrasada = diasRestantes !== null && diasRestantes < 0;
  const porcentajePresupuesto = Math.round((fase.presupuestoUtilizado / fase.presupuestoAsignado) * 100);

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'COMPLETADA':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'EN_PROGRESO':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'PENDIENTE':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      case 'PAUSADA':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'CANCELADA':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
      isAtrasada ? 'border-red-500 bg-red-50' : ''
    }`} style={{ borderLeftColor: fase.color }}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            {getEstadoIcon(fase.estado)}
            <h3 className="text-lg font-semibold text-gray-900">{fase.nombre}</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
              #{fase.orden}
            </span>
            <EstadoBadge estado={fase.estado} />
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{fase.descripcion}</p>

          {isAtrasada && (
            <div className="flex items-center gap-1 text-red-600 text-sm mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>{Math.abs(diasRestantes)} días atrasada</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="relative">
          <button 
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {mostrarMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEditar(fase);
                    setMostrarMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar fase
                </button>
                
                {puedeSubir && (
                  <button
                    onClick={() => {
                      onMoverArriba(fase);
                      setMostrarMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Mover arriba
                  </button>
                )}
                
                {puedeBajar && (
                  <button
                    onClick={() => {
                      onMoverAbajo(fase);
                      setMostrarMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Mover abajo
                  </button>
                )}
                
                <button
                  onClick={() => {
                    onEliminar(fase);
                    setMostrarMenu(false);
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

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(fase.fechaInicio).toLocaleDateString('es-ES')} - {' '}
              {new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES')}
            </span>
          </div>
          
          {diasRestantes !== null && (
            <div className={`flex items-center gap-2 text-sm ${
              isAtrasada ? 'text-red-600' : 
              diasRestantes <= 7 ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                {isAtrasada 
                  ? `${Math.abs(diasRestantes)} días atrasada`
                  : `${diasRestantes} días restantes`
                }
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{fase.responsables.length} responsable(s)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="w-4 h-4" />
            <span>Presupuesto: ${fase.presupuestoUtilizado.toLocaleString()} / ${fase.presupuestoAsignado.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>Horas: {fase.horasReales}h / {fase.horasEstimadas}h</span>
          </div>

          <RiesgoIndicator riesgos={fase.riesgos} />
        </div>
      </div>

      {/* Progreso */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progreso de la fase</span>
          <span className="font-medium">{fase.porcentajeAvance}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${fase.porcentajeAvance}%`,
              backgroundColor: fase.color
            }}
          />
        </div>
      </div>

      {/* Entregables */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Entregables principales:</h4>
        <div className="flex flex-wrap gap-2">
          {fase.entregables.slice(0, 3).map((entregable, index) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {entregable}
            </span>
          ))}
          {fase.entregables.length > 3 && (
            <span className="inline-flex px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded">
              +{fase.entregables.length - 3} más
            </span>
          )}
        </div>
      </div>

      {/* Responsables */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Equipo responsable:</h4>
        <div className="flex flex-wrap gap-2">
          {fase.responsables.map((responsable) => (
            <div key={responsable.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              <Users className="w-3 h-3" />
              <span>{responsable.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaseForm({ fase, onGuardar, onCancelar, recursos }) {
  const [formData, setFormData] = useState({
    nombre: fase?.nombre || '',
    descripcion: fase?.descripcion || '',
    fechaInicio: fase?.fechaInicio || '',
    fechaFinEstimada: fase?.fechaFinEstimada || '',
    estado: fase?.estado || 'PENDIENTE',
    color: fase?.color || '#3B82F6',
    presupuestoAsignado: fase?.presupuestoAsignado || '',
    horasEstimadas: fase?.horasEstimadas || '',
    responsables: fase?.responsables?.map(r => r.id) || [],
    entregables: fase?.entregables?.join('\n') || '',
    prerequisitos: fase?.prerequisitos || [],
    notas: fase?.notas || ''
  });

  const [errores, setErrores] = useState({});

  const handleChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    if (errores[campo]) {
      setErrores(prev => ({
        ...prev,
        [campo]: null
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fechaFinEstimada) {
      nuevosErrores.fechaFinEstimada = 'La fecha de fin es requerida';
    }

    if (formData.fechaInicio && formData.fechaFinEstimada && 
        new Date(formData.fechaInicio) > new Date(formData.fechaFinEstimada)) {
      nuevosErrores.fechaFinEstimada = 'La fecha de fin debe ser posterior a la de inicio';
    }

    if (!formData.presupuestoAsignado || formData.presupuestoAsignado <= 0) {
      nuevosErrores.presupuestoAsignado = 'El presupuesto debe ser mayor a 0';
    }

    if (!formData.horasEstimadas || formData.horasEstimadas <= 0) {
      nuevosErrores.horasEstimadas = 'Las horas estimadas deben ser mayor a 0';
    }

    if (formData.responsables.length === 0) {
      nuevosErrores.responsables = 'Debe asignar al menos un responsable';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      const faseData = {
        ...formData,
        id: fase?.id || Date.now(),
        orden: fase?.orden || 999,
        porcentajeAvance: fase?.porcentajeAvance || 0,
        presupuestoUtilizado: fase?.presupuestoUtilizado || 0,
        horasReales: fase?.horasReales || 0,
        fechaFinReal: fase?.fechaFinReal || null,
        responsables: formData.responsables.map(id => 
          recursos.find(r => r.id === parseInt(id))
        ).filter(Boolean),
        entregables: formData.entregables.split('\n').filter(e => e.trim()),
        riesgos: fase?.riesgos || []
      };
      
      onGuardar(faseData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {fase ? 'Editar Fase' : 'Nueva Fase'}
          </h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la fase *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Análisis y Diseño"
              />
              {errores.nombre && (
                <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color identificativo
              </label>
              <div className="flex gap-2">
                {coloresDisponibles.map((color) => (
                  <button
                    key={color.valor}
                    type="button"
                    onClick={() => handleChange('color', color.valor)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color.valor ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.valor }}
                    title={color.nombre}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errores.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe el objetivo y alcance de esta fase..."
            />
            {errores.descripcion && (
              <p className="text-red-600 text-sm mt-1">{errores.descripcion}</p>
            )}
          </div>

          {/* Fechas y estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio *
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.fechaInicio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.fechaInicio && (
                <p className="text-red-600 text-sm mt-1">{errores.fechaInicio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin estimada *
              </label>
              <input
                type="date"
                value={formData.fechaFinEstimada}
                onChange={(e) => handleChange('fechaFinEstimada', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.fechaFinEstimada ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.fechaFinEstimada && (
                <p className="text-red-600 text-sm mt-1">{errores.fechaFinEstimada}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADA">Completada</option>
                <option value="PAUSADA">Pausada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Presupuesto y horas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto asignado (USD) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.presupuestoAsignado}
                onChange={(e) => handleChange('presupuestoAsignado', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.presupuestoAsignado ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="50000"
              />
              {errores.presupuestoAsignado && (
                <p className="text-red-600 text-sm mt-1">{errores.presupuestoAsignado}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas estimadas *
              </label>
              <input
                type="number"
                min="1"
                value={formData.horasEstimadas}
                onChange={(e) => handleChange('horasEstimadas', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.horasEstimadas ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="200"
              />
              {errores.horasEstimadas && (
                <p className="text-red-600 text-sm mt-1">{errores.horasEstimadas}</p>
              )}
            </div>
          </div>

          {/* Responsables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsables de la fase *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recursos.map((recurso) => (
                <label key={recurso.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.responsables.includes(recurso.id)}
                    onChange={(e) => {
                      const nuevosResponsables = e.target.checked
                        ? [...formData.responsables, recurso.id]
                        : formData.responsables.filter(id => id !== recurso.id);
                      handleChange('responsables', nuevosResponsables);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {recurso.nombre} - {recurso.rol}
                  </span>
                </label>
              ))}
            </div>
            {errores.responsables && (
              <p className="text-red-600 text-sm mt-1">{errores.responsables}</p>
            )}
          </div>

          {/* Entregables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entregables principales
            </label>
            <textarea
              value={formData.entregables}
              onChange={(e) => handleChange('entregables', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Documento de requerimientos&#10;Diseño de arquitectura&#10;Wireframes y mockups&#10;(Un entregable por línea)"
            />
            <p className="text-xs text-gray-500 mt-1">Escribe cada entregable en una línea separada</p>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Comentarios, consideraciones especiales, etc..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {fase ? 'Actualizar' : 'Crear'} Fase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FasesPanel({ proyectoId, onVolver }) {
  const [fases, setFases] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [faseEditando, setFaseEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFases(mockFases.sort((a, b) => a.orden - b.orden));
      setRecursos(mockRecursos);
    } catch (error) {
      console.error('Error cargando fases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fasesFiltradas = fases.filter(fase => 
    !filtroEstado || fase.estado === filtroEstado
  );

  const handleNuevaFase = () => {
    setFaseEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarFase = (fase) => {
    setFaseEditando(fase);
    setMostrarFormulario(true);
  };

  const handleEliminarFase = (fase) => {
    const dependientes = fases.filter(f => f.prerequisitos.includes(fase.id));
    
    if (dependientes.length > 0) {
      alert(`No se puede eliminar esta fase porque las siguientes fases dependen de ella: ${dependientes.map(f => f.nombre).join(', ')}`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la fase "${fase.nombre}"? Esta acción no se puede deshacer.`)) {
      setFases(prev => prev.filter(f => f.id !== fase.id));
    }
  };

  const handleGuardarFase = (faseData) => {
    if (faseEditando) {
      // Actualizar fase existente
      setFases(prev => prev.map(f => 
        f.id === faseEditando.id ? { ...faseData, id: faseEditando.id } : f
      ));
    } else {
      // Crear nueva fase - asignar el siguiente orden
      const maxOrden = Math.max(...fases.map(f => f.orden), 0);
      const nuevaFase = { ...faseData, orden: maxOrden + 1 };
      setFases(prev => [...prev, nuevaFase].sort((a, b) => a.orden - b.orden));
    }
    
    setMostrarFormulario(false);
    setFaseEditando(null);
  };

  const handleMoverFase = (fase, direccion) => {
    const fasesOrdenadas = [...fases].sort((a, b) => a.orden - b.orden);
    const indiceActual = fasesOrdenadas.findIndex(f => f.id === fase.id);
    
    if (direccion === 'arriba' && indiceActual > 0) {
      const faseAnterior = fasesOrdenadas[indiceActual - 1];
      const nuevoOrden = fase.orden;
      
      setFases(prev => prev.map(f => {
        if (f.id === fase.id) return { ...f, orden: faseAnterior.orden };
        if (f.id === faseAnterior.id) return { ...f, orden: nuevoOrden };
        return f;
      }));
    } else if (direccion === 'abajo' && indiceActual < fasesOrdenadas.length - 1) {
      const faseSiguiente = fasesOrdenadas[indiceActual + 1];
      const nuevoOrden = fase.orden;
      
      setFases(prev => prev.map(f => {
        if (f.id === fase.id) return { ...f, orden: faseSiguiente.orden };
        if (f.id === faseSiguiente.id) return { ...f, orden: nuevoOrden };
        return f;
      }));
    }
  };

  const calcularEstadisticasGenerales = () => {
    const total = fases.length;
    const completadas = fases.filter(f => f.estado === 'COMPLETADA').length;
    const enProgreso = fases.filter(f => f.estado === 'EN_PROGRESO').length;
    const pendientes = fases.filter(f => f.estado === 'PENDIENTE').length;
    
    const presupuestoTotal = fases.reduce((sum, f) => sum + f.presupuestoAsignado, 0);
    const presupuestoUtilizado = fases.reduce((sum, f) => sum + f.presupuestoUtilizado, 0);
    
    const horasTotal = fases.reduce((sum, f) => sum + f.horasEstimadas, 0);
    const horasReales = fases.reduce((sum, f) => sum + f.horasReales, 0);
    
    const riesgosTotal = fases.reduce((sum, f) => sum + (f.riesgos?.length || 0), 0);

    return {
      total,
      completadas,
      enProgreso,
      pendientes,
      progresoGeneral: total > 0 ? Math.round((completadas / total) * 100) : 0,
      presupuestoTotal,
      presupuestoUtilizado,
      porcentajePresupuesto: presupuestoTotal > 0 ? Math.round((presupuestoUtilizado / presupuestoTotal) * 100) : 0,
      horasTotal,
      horasReales,
      porcentajeHoras: horasTotal > 0 ? Math.round((horasReales / horasTotal) * 100) : 0,
      riesgosTotal
    };
  };

  const stats = calcularEstadisticasGenerales();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando fases del proyecto...</p>
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
                <button 
                  onClick={onVolver}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Fases</h1>
                <p className="text-gray-600 mt-1">Organiza y supervisa las fases del proyecto</p>
              </div>
            </div>
            
            <button
              onClick={handleNuevaFase}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Fase
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completadas} completadas, {stats.enProgreso} en progreso
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-3xl font-bold text-gray-900">{stats.progresoGeneral}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.progresoGeneral}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Presupuesto</p>
                <p className="text-3xl font-bold text-gray-900">{stats.porcentajePresupuesto}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  ${stats.presupuestoUtilizado.toLocaleString()} / ${stats.presupuestoTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Riesgos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.riesgosTotal}</p>
                <p className="text-xs text-gray-500 mt-1">
                  En todas las fases
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                stats.riesgosTotal > 5 ? 'bg-red-50 text-red-600' : 
                stats.riesgosTotal > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="PAUSADA">Pausada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            
            <span className="text-sm text-gray-500 ml-auto">
              Mostrando {fasesFiltradas.length} de {fases.length} fases
            </span>
          </div>
        </div>

        {/* Lista de fases */}
        <div className="space-y-6">
          {fasesFiltradas.length > 0 ? (
            fasesFiltradas
              .sort((a, b) => a.orden - b.orden)
              .map((fase, index) => (
                <FaseCard 
                  key={fase.id}
                  fase={fase}
                  recursos={recursos}
                  onEditar={handleEditarFase}
                  onEliminar={handleEliminarFase}
                  onMoverArriba={() => handleMoverFase(fase, 'arriba')}
                  onMoverAbajo={() => handleMoverFase(fase, 'abajo')}
                  puedeSubir={index > 0}
                  puedeBajar={index < fasesFiltradas.length - 1}
                />
              ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Target className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filtroEstado ? 'No hay fases con ese estado' : 'No hay fases creadas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {filtroEstado 
                  ? 'Intenta cambiar el filtro para ver otras fases'
                  : 'Crea la primera fase para organizar el proyecto'
                }
              </p>
              {!filtroEstado && (
                <button
                  onClick={handleNuevaFase}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Crear Primera Fase
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Formulario */}
      {mostrarFormulario && (
        <FaseForm 
          fase={faseEditando}
          recursos={recursos}
          onGuardar={handleGuardarFase}
          onCancelar={() => {
            setMostrarFormulario(false);
            setFaseEditando(null);
          }}
        />
      )}
    </div>
  );
}
