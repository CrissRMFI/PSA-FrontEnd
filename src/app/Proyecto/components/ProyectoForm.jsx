import { useState, useEffect } from 'react';
import RecursoSelector from './RecursoSelector';

export default function ProyectoForm({ proyecto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    liderRecursoId: '', // Nuevo campo para recurso
    estado: 'ACTIVO'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        fechaInicio: proyecto.fechaInicio || '',
        fechaFinEstimada: proyecto.fechaFinEstimada || '',
        liderRecursoId: proyecto.liderRecursoId || '', // ID del recurso si existe
        estado: proyecto.estado || 'ACTIVO'
      });
    }
  }, [proyecto]);

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

  const handleLiderChange = (liderRecursoId) => {
    setFormData(prev => ({
      ...prev,
      liderRecursoId
    }));
    
    // Limpiar error del líder
    if (errors.liderRecursoId) {
      setErrors(prev => ({
        ...prev,
        liderRecursoId: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.liderRecursoId.trim()) {
      newErrors.liderRecursoId = 'Debe seleccionar un líder para el proyecto';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFinEstimada) {
      newErrors.fechaFinEstimada = 'La fecha de fin estimada es obligatoria';
    } else if (formData.fechaInicio && formData.fechaFinEstimada <= formData.fechaInicio) {
      newErrors.fechaFinEstimada = 'La fecha de fin debe ser posterior a la de inicio';
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
      // Determinar si usar endpoint con recurso o sin recurso
      const dataToSubmit = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaInicio: formData.fechaInicio,
        fechaFinEstimada: formData.fechaFinEstimada,
        estado: formData.estado
      };

      // Si hay líder seleccionado, agregar el ID del recurso
      if (formData.liderRecursoId) {
        dataToSubmit.liderRecursoId = formData.liderRecursoId;
      }

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información sobre recursos */}
      {!proyecto && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Asignación de líder:</p>
              <p>Los líderes se seleccionan desde el sistema de recursos. Si no ves el recurso que necesitas, puedes sincronizar para obtener los más recientes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Nombre del Proyecto */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Proyecto *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Sistema de Gestión Académica"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
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
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descripcion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe el alcance y objetivos del proyecto..."
        />
        {errors.descripcion && (
          <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
        )}
      </div>

      {/* Líder del Proyecto - AHORA CON RECURSO SELECTOR */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Líder del Proyecto *
        </label>
        <RecursoSelector
          value={formData.liderRecursoId}
          onChange={handleLiderChange}
          tipo="lider"
          error={errors.liderRecursoId}
          required={true}
          disabled={isSubmitting}
        />
        {errors.liderRecursoId && (
          <p className="text-red-600 text-sm mt-1">{errors.liderRecursoId}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          💡 El líder será responsable de coordinar y supervisar el proyecto
        </p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            min={getTodayDate()}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaInicio && (
            <p className="text-red-600 text-sm mt-1">{errors.fechaInicio}</p>
          )}
        </div>

        <div>
          <label htmlFor="fechaFinEstimada" className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Fin Estimada *
          </label>
          <input
            type="date"
            id="fechaFinEstimada"
            name="fechaFinEstimada"
            value={formData.fechaFinEstimada}
            onChange={handleChange}
            min={formData.fechaInicio || getTodayDate()}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fechaFinEstimada ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaFinEstimada && (
            <p className="text-red-600 text-sm mt-1">{errors.fechaFinEstimada}</p>
          )}
        </div>
      </div>

      {/* Estado (solo en edición) */}
      {proyecto && (
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
            Estado del Proyecto
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ACTIVO">Activo</option>
            <option value="PAUSADO">Pausado</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </div>
      )}

      {/* Previsualización del líder seleccionado */}
      {formData.liderRecursoId && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Líder seleccionado:</h4>
          <div className="text-green-700 text-sm">
            <p>El proyecto será asignado al recurso seleccionado como líder.</p>
            <p>Podrás cambiar la asignación posteriormente desde la gestión del proyecto.</p>
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
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            proyecto ? 'Actualizar Proyecto' : 'Crear Proyecto'
          )}
        </button>
      </div>
    </form>
  );
}
