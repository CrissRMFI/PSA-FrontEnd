'use client';
import React, { useState, useEffect } from 'react';
import { 
  Save, X, Plus, Trash2, Calendar, User, Flag, Clock, 
  AlertTriangle, Target, Layers, Users
} from 'lucide-react';

export default function TareaAvanzadaForm({ tarea, fases, recursos, onGuardar, onCancelar, proyectoId }) {
  const [formData, setFormData] = useState({
    nombre: tarea?.nombre || '',
    descripcion: tarea?.descripcion || '',
    asignadoA: tarea?.asignadoA?.id || tarea?.asignado?.id || '',
    prioridad: tarea?.prioridad || 'MEDIA',
    estado: tarea?.estado || 'PENDIENTE',
    fechaInicio: tarea?.fechaInicio ? tarea.fechaInicio.split('T')[0] : '',
    fechaFin: tarea?.fechaFin ? tarea.fechaFin.split('T')[0] : '',
    estimacionHoras: tarea?.estimacionHoras || '',
    porcentajeAvance: tarea?.porcentajeAvance || 0,
    // ✅ Simplificado para la API actual - solo una fase por defecto
    faseAsignada: tarea?.faseId || (fases && fases.length > 0 ? fases[0].idFase || fases[0].id : ''),
    // TODO: Habilitar cuando la API soporte participación multi-fase
    participacionFases: tarea?.participacionFases || []
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Actualizar valores por defecto cuando cambien las props
  useEffect(() => {
    if (tarea) {
      setFormData({
        nombre: tarea.nombre || '',
        descripcion: tarea.descripcion || '',
        asignadoA: tarea.asignadoA?.id || tarea.asignado?.id || '',
        prioridad: tarea.prioridad || 'MEDIA',
        estado: tarea.estado || 'PENDIENTE',
        fechaInicio: tarea.fechaInicio ? tarea.fechaInicio.split('T')[0] : '',
        fechaFin: tarea.fechaFin ? tarea.fechaFin.split('T')[0] : '',
        estimacionHoras: tarea.estimacionHoras || '',
        porcentajeAvance: tarea.porcentajeAvance || 0,
        faseAsignada: tarea.faseId || '',
        participacionFases: tarea.participacionFases || []
      });
    }
  }, [tarea]);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    // Limpiar errores
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: null }));
    }
  };

  // TODO: Funciones para participación multi-fase - implementar cuando esté disponible en la API
  const handleParticipacionChange = (index, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      participacionFases: prev.participacionFases.map((participacion, i) => 
        i === index 
          ? { 
              ...participacion, 
              [campo]: valor,
              ...(campo === 'faseId' && { faseName: fases.find(f => (f.idFase || f.id) == valor)?.nombre || '' })
            }
          : participacion
      )
    }));
  };

  const agregarParticipacionFase = () => {
    const fasesSinUsar = fases.filter(fase => 
      !formData.participacionFases.some(p => p.faseId == (fase.idFase || fase.id))
    );
    
    if (fasesSinUsar.length === 0) {
      alert('Ya has asignado la tarea a todas las fases disponibles');
      return;
    }

    const nuevaParticipacion = {
      faseId: fasesSinUsar[0].idFase || fasesSinUsar[0].id,
      faseName: fasesSinUsar[0].nombre,
      porcentajeParticipacion: 0,
      fechaInicioFase: formData.fechaInicio,
      fechaFinFase: formData.fechaFin,
      estadoEnFase: 'PENDIENTE',
      horasEnFase: 0,
      entregablesEnFase: []
    };

    setFormData(prev => ({
      ...prev,
      participacionFases: [...prev.participacionFases, nuevaParticipacion]
    }));
  };

  const eliminarParticipacionFase = (index) => {
    if (formData.participacionFases.length <= 1) {
      alert('Una tarea debe pertenecer al menos a una fase');
      return;
    }
    setFormData(prev => ({
      ...prev,
      participacionFases: prev.participacionFases.filter((_, i) => i !== index)
    }));
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

    if (!formData.fechaFin) {
      nuevosErrores.fechaFin = 'La fecha de fin es requerida';
    }

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
        nuevosErrores.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    if (!formData.faseAsignada) {
      nuevosErrores.faseAsignada = 'Debe asignar la tarea a una fase';
    }

    // TODO: Validar participación multi-fase cuando esté implementado
    if (formData.participacionFases.length > 0) {
      const totalParticipacion = formData.participacionFases.reduce((sum, p) => sum + (p.porcentajeParticipacion || 0), 0);
      if (totalParticipacion !== 100) {
        nuevosErrores.participacionFases = `La suma de participación debe ser 100% (actual: ${totalParticipacion}%)`;
      }
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
      const tareaData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        // TODO: Campos adicionales para cuando estén disponibles en la API:
        // prioridad: formData.prioridad,
        // estimacionHoras: formData.estimacionHoras,
        // asignadoA: formData.asignadoA,
        // porcentajeAvance: formData.porcentajeAvance,
        // faseId: formData.faseAsignada,
        // participacionFases: formData.participacionFases
      };

      // ✅ Agregar campos existentes de la tarea si estamos editando
      if (tarea) {
        tareaData.id = tarea.id || tarea.idTarea;
        tareaData.estado = formData.estado;
        tareaData.porcentajeAvance = formData.porcentajeAvance;
      }

      await onGuardar(tareaData);
      
    } catch (error) {
      console.error('Error guardando tarea:', error);
      setErrores({ general: 'Error al guardar la tarea. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button 
            onClick={onCancelar} 
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error general */}
        {errores.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-800 text-sm">{errores.general}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la tarea *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Implementar módulo de usuarios"
                disabled={loading}
              />
              {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fase asignada *
              </label>
              <select
                value={formData.faseAsignada}
                onChange={(e) => handleChange('faseAsignada', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.faseAsignada ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Seleccionar fase</option>
                {fases.map(fase => (
                  <option key={fase.idFase || fase.id} value={fase.idFase || fase.id}>
                    {fase.nombre}
                  </option>
                ))}
              </select>
              {errores.faseAsignada && <p className="text-red-600 text-sm mt-1">{errores.faseAsignada}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errores.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe los detalles de la tarea..."
              disabled={loading}
            />
            {errores.descripcion && <p className="text-red-600 text-sm mt-1">{errores.descripcion}</p>}
          </div>

          {/* Fechas y detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha inicio *
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.fechaInicio ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errores.fechaInicio && <p className="text-red-600 text-sm mt-1">{errores.fechaInicio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha fin *
              </label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errores.fechaFin ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errores.fechaFin && <p className="text-red-600 text-sm mt-1">{errores.fechaFin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Prioridad (Próximamente)
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) => handleChange('prioridad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
              >
                <option value="BAJA">🟢 Baja</option>
                <option value="MEDIA">🟡 Media</option>
                <option value="ALTA">🔴 Alta</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Funcionalidad en desarrollo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Horas estimadas (Próximamente)
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimacionHoras}
                onChange={(e) => handleChange('estimacionHoras', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="40"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Funcionalidad en desarrollo</p>
            </div>
          </div>

          {/* Asignación - Deshabilitado temporalmente */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Asignado a (Próximamente)
            </label>
            <select
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            >
              <option value="">Funcionalidad en desarrollo</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">La asignación de recursos estará disponible cuando esté lista la API</p>
          </div>

          {/* Estado - Solo para edición */}
          {tarea && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Estado actual
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={loading}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROGRESO">En Progreso</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="PAUSADA">Pausada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progreso (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.porcentajeAvance}
                  onChange={(e) => handleChange('porcentajeAvance', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Participación multi-fase - Deshabilitado temporalmente */}
          <div className="border-t pt-6 opacity-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Participación Multi-fase (Próximamente)
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Esta funcionalidad permitirá que una tarea participe en múltiples fases del proyecto con porcentajes de participación específicos.
              </p>
              
              <div className="space-y-3">
                <div className="bg-white rounded border p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Fase</label>
                      <select disabled className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-500 text-sm">
                        <option>Seleccionar fase</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Participación (%)</label>
                      <input disabled type="number" className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-500 text-sm" placeholder="100" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Horas en fase</label>
                      <input disabled type="number" className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-500 text-sm" placeholder="40" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  Agregar otra fase
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Esta funcionalidad se habilitará cuando esté lista la API para tareas multi-fase
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button 
              type="button" 
              onClick={onCancelar}
              disabled={loading}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {tarea ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
