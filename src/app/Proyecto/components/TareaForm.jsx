import { useState, useEffect } from 'react';
import RecursoSelector from './RecursoSelector';
import TicketSelector from './TicketSelector';

export default function TareaForm({ tarea, proyecto, fases, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA',
    responsableRecursoId: '', // Campo para recurso
    ticketAsociadoId: '', // 🆕 Campo para ticket
    fechaInicio: '',
    fechaFinEstimada: '',
    faseIds: [] // Para tareas multifase
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMultifase, setIsMultifase] = useState(false);

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (tarea) {
      const faseIds = tarea.fases ? tarea.fases.map(f => f.idFase.toString()) : [];
      setFormData({
        titulo: tarea.titulo || '',
        descripcion: tarea.descripcion || '',
        prioridad: tarea.prioridad || 'MEDIA',
        responsableRecursoId: tarea.responsableRecursoId || '', // ID del recurso si existe
        ticketAsociadoId: tarea.ticketAsociado?.id?.toString() || '', // 🆕 ID del ticket si existe
        fechaInicio: tarea.fechaInicio || '',
        fechaFinEstimada: tarea.fechaFinEstimada || '',
        faseIds: faseIds
      });
      setIsMultifase(faseIds.length > 1);
    } else {
      // Valores por defecto para nueva tarea
      setFormData({
        titulo: '',
        descripcion: '',
        prioridad: 'MEDIA',
        responsableRecursoId: '',
        ticketAsociadoId: '', // 🆕 Sin ticket por defecto
        fechaInicio: proyecto?.fechaInicio || '',
        fechaFinEstimada: proyecto?.fechaFinEstimada || '',
        faseIds: []
      });
    }
  }, [tarea, proyecto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleResponsableChange = (responsableRecursoId) => {
    setFormData(prev => ({
      ...prev,
      responsableRecursoId
    }));
    
    // Limpiar error del responsable
    if (errors.responsableRecursoId) {
      setErrors(prev => ({
        ...prev,
        responsableRecursoId: ''
      }));
    }
  };

  // 🆕 Handler para cambio de ticket
  const handleTicketChange = (ticketAsociadoId) => {
    setFormData(prev => ({
      ...prev,
      ticketAsociadoId
    }));
    
    // Limpiar error del ticket si existe
    if (errors.ticketAsociadoId) {
      setErrors(prev => ({
        ...prev,
        ticketAsociadoId: ''
      }));
    }
  };

  const handleFaseChange = (faseId) => {
    setFormData(prev => {
      const faseIds = prev.faseIds.includes(faseId)
        ? prev.faseIds.filter(id => id !== faseId)
        : [...prev.faseIds, faseId];
      
      return {
        ...prev,
        faseIds: faseIds
      };
    });
  };

  const handleMultifaseToggle = (checked) => {
    setIsMultifase(checked);
    if (!checked) {
      // Si desactivamos multifase, mantener solo la primera fase seleccionada
      setFormData(prev => ({
        ...prev,
        faseIds: prev.faseIds.slice(0, 1)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título de la tarea es obligatorio';
    } else if (formData.titulo.length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.responsableRecursoId.trim()) {
      newErrors.responsableRecursoId = 'Debe seleccionar un responsable para la tarea';
    }

    if (formData.fechaInicio && proyecto && formData.fechaInicio < proyecto.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio no puede ser anterior al inicio del proyecto';
    }

    if (formData.fechaFinEstimada) {
      if (formData.fechaInicio && formData.fechaFinEstimada <= formData.fechaInicio) {
        newErrors.fechaFinEstimada = 'La fecha de fin debe ser posterior a la de inicio';
      } else if (proyecto && formData.fechaFinEstimada > proyecto.fechaFinEstimada) {
        newErrors.fechaFinEstimada = 'La fecha de fin no puede ser posterior al fin del proyecto';
      }
    }

    if (formData.faseIds.length === 0) {
      newErrors.faseIds = 'Debe asignar al menos una fase a la tarea';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ PASO 1: Preparar datos para crear/editar la tarea (SIN TICKET)
      const dataToSubmit = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
        fechaInicio: formData.fechaInicio,
        fechaFinEstimada: formData.fechaFinEstimada,
        faseIds: formData.faseIds.map(id => parseInt(id))
      };

      // Si hay responsable seleccionado, agregar el ID del recurso
      if (formData.responsableRecursoId) {
        dataToSubmit.responsableRecursoId = formData.responsableRecursoId;
      }

      console.log('📤 PASO 1: Creando/editando tarea sin ticket:', dataToSubmit);
      
      // ✅ PASO 1: Crear/editar la tarea
      const tareaResult = await onSubmit(dataToSubmit);
      
      // ✅ PASO 2: Si hay ticket seleccionado, asignarlo después
      const ticketOriginal = tarea?.ticketAsociado?.id?.toString() || '';
      const ticketNuevo = formData.ticketAsociadoId || '';
      
      if (ticketOriginal !== ticketNuevo) {
        console.log('🎫 PASO 2: Procesando cambio de ticket...');
        
        // Importar ticketsService dinámicamente para evitar problemas de dependencias
        const { ticketsService } = await import('../services/ticketsService');
        
        // Obtener ID de la tarea (puede venir del resultado o ser la tarea existente)
        const tareaId = tareaResult?.idTarea || tarea?.idTarea;
        
        if (!tareaId) {
          console.error('❌ No se pudo obtener el ID de la tarea para asignar ticket');
          return;
        }
        
        // Si había ticket anterior, desasignarlo primero
        if (ticketOriginal && ticketOriginal !== '') {
          console.log('🔄 Desasignando ticket anterior:', ticketOriginal);
          try {
            await ticketsService.desasignarTareas(parseInt(ticketOriginal), [tareaId]);
          } catch (error) {
            console.warn('⚠️ Error al desasignar ticket anterior:', error);
            // Continuar aunque falle la desasignación anterior
          }
        }
        
        // Si hay nuevo ticket, asignarlo
        if (ticketNuevo && ticketNuevo !== '') {
          console.log('✅ Asignando nuevo ticket:', ticketNuevo, 'a tarea:', tareaId);
          try {
            await ticketsService.asignarTareas(parseInt(ticketNuevo), [tareaId]);
            console.log('🎉 Ticket asignado exitosamente!');
          } catch (error) {
            console.error('❌ Error al asignar ticket:', error);
            // Mostrar error pero no fallar completamente
            alert(`La tarea se ${tarea ? 'actualizó' : 'creó'} correctamente, pero hubo un error al asignar el ticket. Puedes asignarlo manualmente desde la lista de tareas.`);
          }
        }
      }
      
      console.log('✅ Proceso completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error en el proceso:', error);
      throw error; // Re-lanzar para que el componente padre maneje el error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Proyecto */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Proyecto: {proyecto?.nombre}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Período: {proyecto?.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString('es-ES') : 'No definido'} 
             - {proyecto?.fechaFinEstimada ? new Date(proyecto.fechaFinEstimada).toLocaleDateString('es-ES') : 'No definido'}</p>
          <p>Fases disponibles: {fases.length}</p>
        </div>
      </div>

      {/* Título de la Tarea */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
          Título de la Tarea *
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Diseño de Base de Datos"
        />
        {errors.titulo && (
          <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.descripcion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe detalladamente qué debe realizarse en esta tarea..."
        />
        {errors.descripcion && (
          <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
        )}
      </div>

      {/* Responsable y Prioridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Responsable - CON RECURSO SELECTOR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable *
          </label>
          <RecursoSelector
            value={formData.responsableRecursoId}
            onChange={handleResponsableChange}
            tipo="responsable"
            error={errors.responsableRecursoId}
            required={true}
            disabled={isSubmitting}
          />
          {errors.responsableRecursoId && (
            <p className="text-red-600 text-sm mt-1">{errors.responsableRecursoId}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            💡 El responsable será quien ejecute esta tarea
          </p>
        </div>

        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad *
          </label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
      </div>

      {/* 🆕 Selector de Ticket */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ticket de Soporte
        </label>
        <TicketSelector
          value={formData.ticketAsociadoId}
          onChange={handleTicketChange}
          error={errors.ticketAsociadoId}
          disabled={isSubmitting}
          placeholder="Seleccionar ticket de soporte (opcional)"
        />
        {errors.ticketAsociadoId && (
          <p className="text-red-600 text-sm mt-1">{errors.ticketAsociadoId}</p>
        )}
        
        {/* 🆕 Explicación del proceso */}
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Asignación de Ticket:</p>
              <p>Si seleccionas un ticket, se asignará automáticamente después de {tarea ? 'actualizar' : 'crear'} la tarea.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            min={proyecto?.fechaInicio}
            max={proyecto?.fechaFinEstimada}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaInicio && (
            <p className="text-red-600 text-sm mt-1">{errors.fechaInicio}</p>
          )}
        </div>

        <div>
          <label htmlFor="fechaFinEstimada" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Fin Estimada
          </label>
          <input
            type="date"
            id="fechaFinEstimada"
            name="fechaFinEstimada"
            value={formData.fechaFinEstimada}
            onChange={handleChange}
            min={formData.fechaInicio || proyecto?.fechaInicio}
            max={proyecto?.fechaFinEstimada}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.fechaFinEstimada ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaFinEstimada && (
            <p className="text-red-600 text-sm mt-1">{errors.fechaFinEstimada}</p>
          )}
        </div>
      </div>

      {/* Asignación de Fases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Asignación de Fases *
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="multifase"
              checked={isMultifase}
              onChange={(e) => handleMultifaseToggle(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="multifase" className="text-sm text-gray-600">
              Tarea multifase
            </label>
          </div>
        </div>

        {fases.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ No hay fases creadas en este proyecto. 
              <br />Debes crear al menos una fase antes de crear tareas.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {fases
              .sort((a, b) => a.orden - b.orden)
              .map((fase, index) => (
                <div key={fase.idFase} className="flex items-center">
                  <input
                    type={isMultifase ? "checkbox" : "radio"}
                    id={`fase-${fase.idFase}`}
                    name={isMultifase ? undefined : "faseId"}
                    value={fase.idFase.toString()}
                    checked={formData.faseIds.includes(fase.idFase.toString())}
                    onChange={() => handleFaseChange(fase.idFase.toString())}
                    className="mr-3"
                  />
                  <label htmlFor={`fase-${fase.idFase}`} className="flex-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{fase.nombre}</span>
                      <span className="text-gray-500 text-xs">
                        ({fase.estadoDescriptivo})
                      </span>
                    </div>
                  </label>
                </div>
              ))}
          </div>
        )}

        {errors.faseIds && (
          <p className="text-red-600 text-sm mt-1">{errors.faseIds}</p>
        )}

        {/* Información sobre multifase */}
        {isMultifase && (
          <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">Tarea Multifase:</p>
                <p>Esta tarea aparecerá en todas las fases seleccionadas y se puede trabajar en paralelo a lo largo de múltiples etapas del proyecto.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🆕 Resumen de selección actualizado */}
      {formData.faseIds.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            Resumen de la tarea:
          </h4>
          <div className="text-green-700 text-sm space-y-1">
            <p>• Será asignada a {formData.faseIds.length} fase{formData.faseIds.length > 1 ? 's' : ''}</p>
            <p>• Responsable: {formData.responsableRecursoId ? 'Recurso seleccionado' : 'Sin asignar'}</p>
            <p>• Prioridad: {formData.prioridad}</p>
            <p>• Ticket: {formData.ticketAsociadoId ? 'Se asignará automáticamente' : 'Sin ticket'}</p>
            {formData.faseIds.length > 1 && (
              <p>• ⭐ Tarea multifase - aparecerá en múltiples etapas</p>
            )}
          </div>
        </div>
      )}

      {/* Previsualización del responsable seleccionado */}
      {formData.responsableRecursoId && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Responsable seleccionado:</h4>
          <div className="text-green-700 text-sm">
            <p>La tarea será asignada al recurso seleccionado como responsable.</p>
            <p>Podrás cambiar la asignación posteriormente desde la gestión de tareas.</p>
          </div>
        </div>
      )}

      {/* 🆕 Previsualización del ticket seleccionado */}
      {formData.ticketAsociadoId && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">🎫 Ticket seleccionado:</h4>
          <div className="text-orange-700 text-sm">
            <p>Esta tarea se vinculará automáticamente al ticket de soporte seleccionado.</p>
            <p>El proceso se realiza en dos pasos: primero se {tarea ? 'actualiza' : 'crea'} la tarea, luego se asigna el ticket.</p>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || fases.length === 0}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {formData.ticketAsociadoId ? 'Guardando y asignando ticket...' : 'Guardando...'}
            </div>
          ) : (
            tarea ? 'Actualizar Tarea' : 'Crear Tarea'
          )}
        </button>
      </div>
    </form>
  );
}
