export default function RiesgoCard({ 
  riesgo, 
  onEdit, 
  onDelete, 
  onCambiarEstado, 
  getEstadoColor, 
  getProbabilidadColor, 
  getImpactoColor 
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const handleCambiarEstado = () => {
    const nuevoEstado = riesgo.estado === 'ACTIVO' ? 'MITIGADO' : 'ACTIVO';
    onCambiarEstado(riesgo.idRiesgo, nuevoEstado);
  };

  const getColorBorde = () => {
    if (riesgo.estado === 'MITIGADO') return 'border-green-500';
    if (riesgo.probabilidad === 'ALTA' && riesgo.impacto === 'ALTO') return 'border-red-500';
    if (riesgo.probabilidad === 'ALTA' || riesgo.impacto === 'ALTO') return 'border-orange-500';
    return 'border-yellow-500';
  };

  const getCriticidad = () => {
    if (riesgo.estado === 'MITIGADO') return null;
    if (riesgo.probabilidad === 'ALTA' && riesgo.impacto === 'ALTO') return 'CRÍTICO';
    if (riesgo.probabilidad === 'ALTA' || riesgo.impacto === 'ALTO') return 'ALTO';
    return 'MEDIO';
  };

  const criticidad = getCriticidad();

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${getColorBorde()}`}>
      <div className="p-6">
        {/* Header del riesgo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                {riesgo.descripcion}
              </h3>
              {criticidad && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  criticidad === 'CRÍTICO' ? 'bg-red-100 text-red-600' :
                  criticidad === 'ALTO' ? 'bg-orange-100 text-orange-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {criticidad}
                </span>
              )}
            </div>

            {/* Estados */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(riesgo.estado)}`}>
                {riesgo.estado}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilidadColor(riesgo.probabilidad)}`}>
                {riesgo.probabilidad} Probabilidad
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactoColor(riesgo.impacto)}`}>
                {riesgo.impacto} Impacto
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleCambiarEstado}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                riesgo.estado === 'ACTIVO' 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              }`}
              title={riesgo.estado === 'ACTIVO' ? 'Marcar como mitigado' : 'Reactivar riesgo'}
            >
              {riesgo.estado === 'ACTIVO' ? '✅ Mitigar' : '⚠️ Reactivar'}
            </button>

            <button
              onClick={() => onEdit(riesgo)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar riesgo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(riesgo)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar riesgo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Plan de mitigación */}
        {riesgo.planMitigacion && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Plan de Mitigación:</h4>
            <p className="text-blue-700 text-sm">{riesgo.planMitigacion}</p>
          </div>
        )}

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Fecha de Identificación:</span>
            <p className="font-medium">{formatDate(riesgo.fechaIdentificacion)}</p>
          </div>
          <div>
            <span className="text-gray-500">Última Actualización:</span>
            <p className="font-medium">{formatDate(riesgo.fechaActualizacion) || 'No actualizado'}</p>
          </div>
        </div>

        {/* Indicador visual de criticidad */}
        {riesgo.estado === 'ACTIVO' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Nivel de Riesgo</span>
              <span>{criticidad}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  criticidad === 'CRÍTICO' ? 'bg-red-500 w-full' :
                  criticidad === 'ALTO' ? 'bg-orange-500 w-3/4' :
                  'bg-yellow-500 w-1/2'
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span>ID: {riesgo.idRiesgo}</span>
            <span>
              Evaluación: {riesgo.probabilidad}/{riesgo.impacto}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicador de estado con icono */}
            {riesgo.estado === 'MITIGADO' && (
              <div className="flex items-center text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Mitigado</span>
              </div>
            )}
            {riesgo.estado === 'ACTIVO' && (
              <div className="flex items-center text-red-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Activo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
