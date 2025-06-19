import { useState, useEffect } from 'react';

export default function TareaForm({ tarea, proyecto, fases, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA',
    responsable: '',
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
        responsable: tarea.responsable || '',
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
        responsable: '',
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

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es obligatorio';
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
      // Convertir faseIds a números
      const dataToSubmit = {
        ...formData,
        faseIds: formData.faseIds.map(id => parseInt(id))
      };
      
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponsablesSugeridos = () => {
    // Lista de responsables comunes (podrías obtenerla del backend)
    return [
      'Ana García',
      'Juan Pérez',
      'María Rodríguez',
      'Carlos López',
      'Laura Martínez',
      'Pedro Sánchez',
      'Carmen Jiménez',
      'Miguel Torres'
    ];
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
        <div>
          <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-2">
            Responsable *
          </label>
          <input
            type="text"
            id="responsable"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.responsable ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre del responsable"
            list="responsables-sugeridos"
          />
          
          {/* Lista de sugerencias */}
          <datalist id="responsables-sugeridos">
            {getResponsablesSugeridos().map(responsable => (
              <option key={responsable} value={responsable} />
            ))}
          </datalist>
          
          {errors.responsable && (
            <p className="text-red-600 text-sm mt-1">{errors.responsable}</p>
          )}
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
              .map((fase) => (
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
                        {fase.orden}
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

      {/* Resumen de selección */}
      {formData.faseIds.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            Resumen de la tarea:
          </h4>
          <div className="text-green-700 text-sm space-y-1">
            <p>• Será asignada a {formData.faseIds.length} fase{formData.faseIds.length > 1 ? 's' : ''}</p>
            <p>• Responsable: {formData.responsable || 'Sin asignar'}</p>
            <p>• Prioridad: {formData.prioridad}</p>
            {formData.faseIds.length > 1 && (
              <p>• ⭐ Tarea multifase - aparecerá en múltiples etapas</p>
            )}
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
              Guardando...
            </div>
          ) : (
            tarea ? 'Actualizar Tarea' : 'Crear Tarea'
          )}
        </button>
      </div>
    </form>
  );
}
