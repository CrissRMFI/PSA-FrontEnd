'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, Calendar, Target, 
  ArrowUp, ArrowDown, MoreVertical, CheckCircle, 
  Clock, AlertTriangle, BarChart3, Users, GripVertical 
} from 'lucide-react';
import { useFases } from '../../../api/hooks'; // ✅ Usar hook real

// Recursos temporales - TODO: Mover a API cuando esté disponible
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
      case 'Completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_PROGRESO':
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDIENTE':
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PAUSADA':
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADA':
      case 'Cancelada':
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

function RiesgoIndicator({ riesgos = [] }) {
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
    if (!fase.fechaFinEstimada || fase.estadoDescriptivo === 'Completada') return null;
    const hoy = new Date();
    const fechaFin = new Date(fase.fechaFinEstimada);
    const diferencia = fechaFin - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return dias;
  };

  const diasRestantes = calcularDiasRestantes();
  const isAtrasada = diasRestantes !== null && diasRestantes < 0;

  // ✅ Adaptar a la estructura real de la API
  const porcentajePresupuesto = fase.presupuestoAsignado > 0 
    ? Math.round(((fase.presupuestoUtilizado || 0) / fase.presupuestoAsignado) * 100)
    : 0;

  const getEstadoIcon = (estado) => {
    const estadoNormalizado = estado?.toLowerCase();
    switch (estadoNormalizado) {
      case 'completada':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en progreso':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pendiente':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      case 'pausada':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'cancelada':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // ✅ Usar datos reales de la API con fallbacks
  const colorFase = fase.color || '#3B82F6';
  const responsables = fase.responsables || [];
  const entregables = fase.entregables || [];
  const riesgos = fase.riesgos || [];

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
      isAtrasada ? 'border-red-500 bg-red-50' : ''
    }`} style={{ borderLeftColor: colorFase }}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            {getEstadoIcon(fase.estadoDescriptivo)}
            <h3 className="text-lg font-semibold text-gray-900">{fase.nombre}</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
              #{fase.orden || 'N/A'}
            </span>
            <EstadoBadge estado={fase.estadoDescriptivo} />
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{fase.descripcion || 'Sin descripción'}</p>

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
              {fase.fechaInicio ? new Date(fase.fechaInicio).toLocaleDateString('es-ES') : 'Sin fecha'} - {' '}
              {fase.fechaFinEstimada ? new Date(fase.fechaFinEstimada).toLocaleDateString('es-ES') : 'Sin fecha'}
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
            <span>{responsables.length} responsable(s)</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Presupuesto - mostrar solo si existe */}
          {fase.presupuestoAsignado && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>Presupuesto: ${(fase.presupuestoUtilizado || 0).toLocaleString()} / ${fase.presupuestoAsignado.toLocaleString()}</span>
            </div>
          )}
          
          {/* Horas - mostrar solo si existe */}
          {fase.horasEstimadas && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>Horas: {fase.horasReales || 0}h / {fase.horasEstimadas}h</span>
            </div>
          )}

          <RiesgoIndicator riesgos={riesgos} />
        </div>
      </div>

      {/* Progreso - mostrar solo si existe */}
      {fase.porcentajeAvance !== undefined && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progreso de la fase</span>
            <span className="font-medium">{fase.porcentajeAvance || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${fase.porcentajeAvance || 0}%`,
                backgroundColor: colorFase
              }}
            />
          </div>
        </div>
      )}

      {/* Entregables - mostrar solo si existen */}
      {entregables.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Entregables principales:</h4>
          <div className="flex flex-wrap gap-2">
            {entregables.slice(0, 3).map((entregable, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                {entregable}
              </span>
            ))}
            {entregables.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded">
                +{entregables.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Responsables - mostrar solo si existen */}
      {responsables.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Equipo responsable:</h4>
          <div className="flex flex-wrap gap-2">
            {responsables.map((responsable, index) => (
              <div key={responsable.id || index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                <Users className="w-3 h-3" />
                <span>{responsable.nombre || responsable}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notas - mostrar solo si existen */}
      {fase.notas && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Notas:</h4>
          <p className="text-sm text-gray-600">{fase.notas}</p>
        </div>
      )}
    </div>
  );
}

function FaseForm({ fase, onGuardar, onCancelar, recursos, proyectoId }) {
  const [formData, setFormData] = useState({
    nombre: fase?.nombre || '',
    descripcion: fase?.descripcion || '',
    fechaInicio: fase?.fechaInicio ? fase.fechaInicio.split('T')[0] : '',
    fechaFinEstimada: fase?.fechaFinEstimada ? fase.fechaFinEstimada.split('T')[0] : '',
    estadoDescriptivo: fase?.estadoDescriptivo || 'Pendiente',
    color: fase?.color || '#3B82F6',
    presupuestoAsignado: fase?.presupuestoAsignado || '',
    horasEstimadas: fase?.horasEstimadas || '',
    responsables: fase?.responsables?.map(r => r.id || r) || [],
    entregables: Array.isArray(fase?.entregables) ? fase.entregables.join('\n') : (fase?.entregables || ''),
    prerequisitos: fase?.prerequisitos || [],
    notas: fase?.notas || ''
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

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

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    
    try {
      // ✅ Preparar datos según el formato esperado por la API
      const faseData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: formData.fechaInicio,
        fechaFinEstimada: formData.fechaFinEstimada,
        estadoDescriptivo: formData.estadoDescriptivo,
        // TODO: Cuando la API soporte estos campos, descomentarlos:
        // color: formData.color,
        // presupuestoAsignado: formData.presupuestoAsignado,
        // horasEstimadas: formData.horasEstimadas,
        // responsables: formData.responsables,
        // entregables: formData.entregables.split('\n').filter(e => e.trim()),
        // notas: formData.notas
      };

      await onGuardar(faseData);
      
    } catch (error) {
      console.error('Error guardando fase:', error);
      // TODO: Mostrar error al usuario
    } finally {
      setLoading(false);
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
                Color identificativo (Próximamente)
              </label>
              <div className="flex gap-2 opacity-50">
                {coloresDisponibles.slice(0, 4).map((color) => (
                  <button
                    key={color.valor}
                    type="button"
                    disabled
                    className={`w-8 h-8 rounded-full border-2 cursor-not-allowed ${
                      formData.color === color.valor ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.valor }}
                    title={`${color.nombre} (Próximamente)`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Funcionalidad en desarrollo</p>
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
                value={formData.estadoDescriptivo}
                onChange={(e) => handleChange('estadoDescriptivo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
                <option value="Pausada">Pausada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Campos adicionales - Deshabilitados temporalmente */}
          <div className="space-y-4 opacity-50">
            <h3 className="text-lg font-medium text-gray-700">Campos Adicionales (Próximamente)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto asignado (USD)
                </label>
                <input
                  type="number"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas estimadas
                </label>
                <input
                  type="number"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  placeholder="200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsables de la fase
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recursos.slice(0, 2).map((recurso) => (
                  <label key={recurso.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-50"
                    />
                    <span className="text-sm text-gray-500">
                      {recurso.nombre} - {recurso.rol}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Estos campos se habilitarán cuando estén listos en la API del backend
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancelar}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {fase ? 'Actualizar' : 'Crear'} Fase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FasesPanel({ proyectoId, onVolver }) {
  // ✅ Usar hook real en lugar de mock data
  const { fases, loading, error, cargarFases, crearFase, planificarFase } = useFases(proyectoId);
  
  const [recursos, setRecursos] = useState([]);
  const [loadingRecursos, setLoadingRecursos] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [faseEditando, setFaseEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  // ✅ Cargar recursos independientemente
  useEffect(() => {
    cargarRecursos();
  }, []);

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

  // ✅ Filtrar fases según estado seleccionado
  const fasesFiltradas = fases.filter(fase => 
    !filtroEstado || fase.estadoDescriptivo === filtroEstado
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
    // TODO: Implementar verificación de dependencias cuando esté disponible en la API
    
    if (confirm(`¿Estás seguro de eliminar la fase "${fase.nombre}"? Esta acción no se puede deshacer.`)) {
      // TODO: Implementar eliminación real cuando esté disponible en el hook
      console.log('Eliminar fase:', fase.idFase);
      // await eliminarFase(fase.idFase);
    }
  };

  const handleGuardarFase = async (faseData) => {
    try {
      if (faseEditando) {
        // TODO: Implementar actualización cuando esté disponible en el hook
        // await actualizarFase(faseEditando.idFase, faseData);
        console.log('Actualizar fase:', faseEditando.idFase, faseData);
        
        // Por ahora, simular actualización local
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // ✅ Crear nueva fase usando el hook real
        await crearFase(faseData);
      }
      
      setMostrarFormulario(false);
      setFaseEditando(null);
      
      // ✅ Recargar fases
      await cargarFases();
      
    } catch (error) {
      console.error('Error guardando fase:', error);
      // TODO: Mostrar error al usuario
    }
  };

  const handleMoverFase = (fase, direccion) => {
    // TODO: Implementar reordenamiento cuando esté disponible en la API
    console.log(`Mover fase ${fase.nombre} hacia ${direccion}`);
    
    // Por ahora, mostrar mensaje al usuario
    alert('Funcionalidad de reordenamiento en desarrollo. Próximamente disponible.');
  };

  const handlePlanificarFase = async (fase, fechaInicio, fechaFin) => {
    try {
      // ✅ Usar función de planificación del hook
      await planificarFase(fase.idFase, fechaInicio, fechaFin);
      await cargarFases(); // Recargar para mostrar cambios
    } catch (error) {
      console.error('Error planificando fase:', error);
    }
  };

  // ✅ Calcular estadísticas reales desde los datos de la API
  const calcularEstadisticasGenerales = () => {
    if (!fases.length) {
      return {
        total: 0,
        completadas: 0,
        enProgreso: 0,
        pendientes: 0,
        progresoGeneral: 0,
        presupuestoTotal: 0,
        presupuestoUtilizado: 0,
        porcentajePresupuesto: 0,
        horasTotal: 0,
        horasReales: 0,
        porcentajeHoras: 0,
        riesgosTotal: 0
      };
    }

    const total = fases.length;
    const completadas = fases.filter(f => f.estadoDescriptivo === 'Completada').length;
    const enProgreso = fases.filter(f => f.estadoDescriptivo === 'En Progreso').length;
    const pendientes = fases.filter(f => f.estadoDescriptivo === 'Pendiente').length;
    
    // Calcular presupuesto solo si las fases tienen esa información
    const presupuestoTotal = fases.reduce((sum, f) => sum + (f.presupuestoAsignado || 0), 0);
    const presupuestoUtilizado = fases.reduce((sum, f) => sum + (f.presupuestoUtilizado || 0), 0);
    
    // Calcular horas solo si las fases tienen esa información
    const horasTotal = fases.reduce((sum, f) => sum + (f.horasEstimadas || 0), 0);
    const horasReales = fases.reduce((sum, f) => sum + (f.horasReales || 0), 0);
    
    // Calcular riesgos
    const riesgosTotal = fases.reduce((sum, f) => sum + ((f.riesgos && f.riesgos.length) || 0), 0);

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

  // ✅ Manejo de errores
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error cargando fases</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={cargarFases}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading || loadingRecursos) {
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
                <p className="text-3xl font-bold text-gray-900">
                  {stats.presupuestoTotal > 0 ? `${stats.porcentajePresupuesto}%` : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.presupuestoTotal > 0 
                    ? `${stats.presupuestoUtilizado.toLocaleString()} / ${stats.presupuestoTotal.toLocaleString()}`
                    : 'Sin información de presupuesto'
                  }
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
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
              <option value="Pausada">Pausada</option>
              <option value="Cancelada">Cancelada</option>
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
              .sort((a, b) => (a.orden || 0) - (b.orden || 0))
              .map((fase, index) => (
                <FaseCard 
                  key={fase.idFase}
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
          proyectoId={proyectoId}
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
