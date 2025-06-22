import { useState, useEffect } from 'react';

export default function FaseForm({ fase, proyecto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFinEstimada: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (fase) {
      setFormData({
        nombre: fase.nombre || '',
        fechaInicio: fase.fechaInicio || '',
        fechaFinEstimada: fase.fechaFinEstimada || ''
      });
    } else {
      // Si es nueva fase, establecer fechas por defecto basadas en el proyecto
      setFormData({
        nombre: '',
        fechaInicio: proyecto?.fechaInicio || '',
        fechaFinEstimada: proyecto?.fechaFinEstimada || ''
      });
    }
  }, [fase, proyecto]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la fase es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    } else if (proyecto && formData.fechaInicio < proyecto.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio no puede ser anterior al inicio del proyecto';
    }

    if (!formData.fechaFinEstimada) {
      newErrors.fechaFinEstimada = 'La fecha de fin estimada es obligatoria';
    } else if (formData.fechaInicio && formData.fechaFinEstimada <= formData.fechaInicio) {
      newErrors.fechaFinEstimada = 'La fecha de fin debe ser posterior a la de inicio';
    } else if (proyecto && formData.fechaFinEstimada > proyecto.fechaFinEstimada) {
      newErrors.fechaFinEstimada = 'La fecha de fin no puede ser posterior al fin del proyecto';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFasesSugeridas = () => {
    return [
      'Análisis de Requisitos',
      'Diseño del Sistema', 
      'Implementación',
      'Pruebas',
      'Despliegue',
      'Mantenimiento',
      'Planificación',
      'Desarrollo',
      'Validación',
      'Documentación'
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
          <p>Esta fase debe estar dentro de este período</p>
        </div>
      </div>

      {/* Nombre de la Fase */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Fase *
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
          placeholder="Ej: Análisis de Requisitos"
          list="fases-sugeridas"
        />
        
        {/* Lista de sugerencias */}
        <datalist id="fases-sugeridas">
          {getFasesSugeridas().map(fase => (
            <option key={fase} value={fase} />
          ))}
        </datalist>
        
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
        )}
        
        <p className="text-gray-500 text-xs mt-1">
          💡 Escribe para ver sugerencias de nombres de fases comunes
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
            min={proyecto?.fechaInicio}
            max={proyecto?.fechaFinEstimada}
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
            min={formData.fechaInicio || proyecto?.fechaInicio}
            max={proyecto?.fechaFinEstimada}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fechaFinEstimada ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaFinEstimada && (
            <p className="text-red-600 text-sm mt-1">{errors.fechaFinEstimada}</p>
          )}
        </div>
      </div>

      {/* Información adicional */}
      {!fase && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Información sobre el orden:</p>
              <p>Las fases se crean automáticamente en orden secuencial. Esta será la fase número {(proyecto?.fases?.length || 0) + 1}.</p>
            </div>
          </div>
        </div>
      )}

      {/* Previsualización de duración */}
      {formData.fechaInicio && formData.fechaFinEstimada && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Duración estimada:</h4>
          <p className="text-green-700">
            {(() => {
              const inicio = new Date(formData.fechaInicio);
              const fin = new Date(formData.fechaFinEstimada);
              const diffTime = Math.abs(fin - inicio);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) return '1 día';
              if (diffDays < 30) return `${diffDays} días`;
              if (diffDays < 365) return `${Math.round(diffDays / 30)} meses`;
              return `${Math.round(diffDays / 365)} años`;
            })()}
          </p>
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
            fase ? 'Actualizar Fase' : 'Crear Fase'
          )}
        </button>
      </div>
    </form>
  );
}
