import { useState, useEffect } from 'react';

export default function RiesgoForm({ riesgo, proyecto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    descripcion: '',
    probabilidad: 'MEDIA',
    impacto: 'MEDIO',
    planMitigacion: '',
    estado: 'ACTIVO'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (riesgo) {
      setFormData({
        descripcion: riesgo.descripcion || '',
        probabilidad: riesgo.probabilidad || 'MEDIA',
        impacto: riesgo.impacto || 'MEDIO',
        planMitigacion: riesgo.planMitigacion || '',
        estado: riesgo.estado || 'ACTIVO'
      });
    }
  }, [riesgo]);

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

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción del riesgo es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.planMitigacion.trim()) {
      newErrors.planMitigacion = 'El plan de mitigación es obligatorio';
    } else if (formData.planMitigacion.length < 15) {
      newErrors.planMitigacion = 'El plan de mitigación debe ser más detallado (mínimo 15 caracteres)';
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

  const getRiesgosSugeridos = () => {
    return [
      'Nos quedamos sin staff clave',
      'El cliente cambia los requisitos',
      'Problemas de integración con sistemas externos',
      'Retrasos en aprobaciones del cliente',
      'Dependencias externas no disponibles',
      'Falta de claridad en los requisitos',
      'Problemas de rendimiento del sistema',
      'Cambios en la tecnología durante el proyecto',
      'Presupuesto insuficiente',
      'Plazos muy ajustados',
      'Falta de experiencia del equipo en la tecnología',
      'Problemas de comunicación con stakeholders'
    ];
  };

  const getPlanesSugeridos = () => {
    const planes = {
      'staff': [
        'Identificar y capacitar personal de respaldo',
        'Documentar procesos críticos',
        'Establecer contratos de retención'
      ],
      'requisitos': [
        'Establecer proceso formal de gestión de cambios',
        'Documentar requisitos detalladamente',
        'Realizar revisiones periódicas con el cliente'
      ],
      'integracion': [
        'Realizar pruebas de integración tempranas',
        'Tener planes de contingencia técnica',
        'Establecer comunicación directa con proveedores'
      ],
      'aprobaciones': [
        'Establecer cronograma de revisiones claro',
        'Tener contactos de escalación definidos',
        'Preparar documentación completa con anticipación'
      ]
    };

    // Sugerir planes basados en palabras clave en la descripción
    const descripcion = formData.descripcion.toLowerCase();
    if (descripcion.includes('staff') || descripcion.includes('personal')) return planes.staff;
    if (descripcion.includes('requisito') || descripcion.includes('cambio')) return planes.requisitos;
    if (descripcion.includes('integra') || descripcion.includes('sistema')) return planes.integracion;
    if (descripcion.includes('aprobac') || descripcion.includes('cliente')) return planes.aprobaciones;
    
    return [];
  };

  const planesSugeridos = getPlanesSugeridos();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Proyecto */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Proyecto: {proyecto?.nombre}</h3>
        <div className="text-sm text-gray-600">
          <p>Documenta los riesgos que podrían afectar el éxito del proyecto</p>
        </div>
      </div>

      {/* Descripción del Riesgo */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del Riesgo *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
            errors.descripcion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Nos quedamos sin staff clave durante la implementación"
          list="riesgos-sugeridos"
        />
        
        {/* Lista de sugerencias */}
        <datalist id="riesgos-sugeridos">
          {getRiesgosSugeridos().map(riesgo => (
            <option key={riesgo} value={riesgo} />
          ))}
        </datalist>
        
        {errors.descripcion && (
          <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
        )}
        
        <p className="text-gray-500 text-xs mt-1">
          💡 Describe qué podría salir mal y cómo afectaría al proyecto
        </p>
      </div>

      {/* Probabilidad e Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="probabilidad" className="block text-sm font-medium text-gray-700 mb-2">
            Probabilidad *
          </label>
          <select
            id="probabilidad"
            name="probabilidad"
            value={formData.probabilidad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="BAJA">Baja - Poco probable que ocurra</option>
            <option value="MEDIA">Media - Podría ocurrir</option>
            <option value="ALTA">Alta - Muy probable que ocurra</option>
          </select>
        </div>

        <div>
          <label htmlFor="impacto" className="block text-sm font-medium text-gray-700 mb-2">
            Impacto *
          </label>
          <select
            id="impacto"
            name="impacto"
            value={formData.impacto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="BAJO">Bajo - Impacto mínimo</option>
            <option value="MEDIO">Medio - Impacto moderado</option>
            <option value="ALTO">Alto - Impacto significativo</option>
          </select>
        </div>
      </div>

      {/* Plan de Mitigación */}
      <div>
        <label htmlFor="planMitigacion" className="block text-sm font-medium text-gray-700 mb-2">
          Plan de Mitigación *
        </label>
        <textarea
          id="planMitigacion"
          name="planMitigacion"
          value={formData.planMitigacion}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
            errors.planMitigacion ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Identificar personal de backup, documentar procesos críticos, establecer contratos de retención..."
        />
        {errors.planMitigacion && (
          <p className="text-red-600 text-sm mt-1">{errors.planMitigacion}</p>
        )}
        
        <p className="text-gray-500 text-xs mt-1">
          💡 Describe qué acciones tomar para prevenir o reducir el impacto del riesgo
        </p>

        {/* Sugerencias de planes */}
        {planesSugeridos.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Sugerencias de mitigación:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              {planesSugeridos.map((plan, index) => (
                <li key={index} className="cursor-pointer hover:text-blue-900 transition-colors"
                    onClick={() => setFormData(prev => ({ ...prev, planMitigacion: plan }))}>
                  • {plan}
                </li>
              ))}
            </ul>
            <p className="text-blue-600 text-xs mt-2">Haz clic en una sugerencia para usarla</p>
          </div>
        )}
      </div>

      {/* Estado (solo en edición) */}
      {riesgo && (
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
            Estado del Riesgo
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ACTIVO">Activo - Requiere monitoreo</option>
            <option value="MITIGADO">Mitigado - Riesgo controlado</option>
          </select>
        </div>
      )}

      {/* Resumen del riesgo */}
      <div className={`p-4 rounded-lg border ${
        formData.probabilidad === 'ALTA' && formData.impacto === 'ALTO' ? 'bg-red-50 border-red-200' :
        formData.probabilidad === 'ALTA' || formData.impacto === 'ALTO' ? 'bg-orange-50 border-orange-200' :
        'bg-yellow-50 border-yellow-200'
      }`}>
        <h4 className="font-medium text-gray-800 mb-2">
          Evaluación del Riesgo:
        </h4>
        <div className="text-sm space-y-1">
          <p>• Probabilidad: <span className="font-medium">{formData.probabilidad}</span></p>
          <p>• Impacto: <span className="font-medium">{formData.impacto}</span></p>
          <p>• Criticidad: <span className={`font-medium ${
            formData.probabilidad === 'ALTA' && formData.impacto === 'ALTO' ? 'text-red-600' :
            formData.probabilidad === 'ALTA' || formData.impacto === 'ALTO' ? 'text-orange-600' :
            'text-yellow-600'
          }`}>
            {formData.probabilidad === 'ALTA' && formData.impacto === 'ALTO' ? 'CRÍTICA' :
             formData.probabilidad === 'ALTA' || formData.impacto === 'ALTO' ? 'ALTA' : 'MEDIA'}
          </span></p>
        </div>
      </div>

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
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            riesgo ? 'Actualizar Riesgo' : 'Documentar Riesgo'
          )}
        </button>
      </div>
    </form>
  );
}
