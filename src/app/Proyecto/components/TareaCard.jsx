export default function TareaCard({ 
  tarea, 
  onEdit, 
  onDelete, 
  onCambiarEstado, 
  getEstadoColor, 
  getPrioridadColor, 
  proyectoId 
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = () => {
    if (!tarea.fechaFinEstimada || tarea.estado === 'COMPLETADA') return false;
    return new Date(tarea.fechaFinEstimada) < new Date();
  };

  const getProximoEstado = () => {
    switch (tarea.estado) {
      case 'PENDIENTE': return 'EN_PROGRESO';
      case 'EN_PROGRESO': return 'COMPLETADA';
      default: return null;
    }
  };

  const getTextoProximoEstado = () => {
    switch (tarea.estado) {
      case 'PENDIENTE': return 'Iniciar';
      case 'EN_PROGRESO': return 'Completar';
      default: return null;
    }
  };

  const getColorBorde = () => {
    if (tarea.estado === 'COMPLETADA') return 'border-green-500';
    if (tarea.estado === 'EN_PROGRESO') return 'border-blue-500';
    if (isOverdue()) return 'border-red-500';
    return 'border-yellow-500';
  };

  const handleCambiarEstado = () => {
    const proximoEstado = getProximoEstado();
    if (proximoEstado) {
      onCambiarEstado(tarea.idTarea, proximoEstado);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${getColorBorde()}`}>
      <div className="p-6">
        {/* Header de la tarea */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3 mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {tarea.titulo}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {tarea.descripcion || 'Sin descripción'}
                </p>
              </div>
            </div>

            {/* Estados y prioridad */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(tarea.estado)}`}>
                {tarea.estado.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(tarea.prioridad)}`}>
                {tarea.prioridad} PRIORIDAD
              </span>
              {isOverdue() && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  VENCIDA
                </span>
              )}
            </div>

            {/* Información del responsable */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Responsable: <span className="font-medium">{tarea.responsable}</span></span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex space-x-2 ml-4">
            {getProximoEstado() && (
              <button
                onClick={handleCambiarEstado}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  tarea.estado === 'PENDIENTE' 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
                title={`Cambiar estado a ${getProximoEstado()}`}
              >
                {getTextoProximoEstado()}
              </button>
            )}

            <button
              onClick={() => onEdit(tarea)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar tarea"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(tarea)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar tarea"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            </button>
          </div>
        </div>

        {/* Fases asignadas */}
        {tarea.fases && tarea.fases.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 mb-2 block">
              {tarea.fases.length === 1 ? 'Fase asignada:' : 'Fases asignadas:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {tarea.fases
                .sort((a, b) => a.orden - b.orden)
                .map((fase) => (
                  <div
                    key={fase.idFase}
                    className="flex items-center space-x-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-xs"
                  >
                    <span className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {fase.orden}
                    </span>
                    <span>{fase.nombre}</span>
                  </div>
                ))}
            </div>
            {tarea.fases.length > 1 && (
              <div className="mt-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
                ⭐ Tarea Multifase
              </div>
            )}
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-gray-500 text-xs">Fecha Inicio:</span>
            <p className="font-medium text-sm">{formatDate(tarea.fechaInicio)}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Fecha Fin Estimada:</span>
            <p className={`font-medium text-sm ${isOverdue() ? 'text-red-600' : ''}`}>
              {formatDate(tarea.fechaFinEstimada)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Fecha Fin Real:</span>
            <p className="font-medium text-sm">{formatDate(tarea.fechaFinReal) || 'En progreso'}</p>
          </div>
        </div>

        {/* Progreso visual */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>
              {tarea.estado === 'COMPLETADA' ? '100%' :
               tarea.estado === 'EN_PROGRESO' ? '50%' : '0%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                tarea.estado === 'COMPLETADA' ? 'bg-green-500 w-full' :
                tarea.estado === 'EN_PROGRESO' ? 'bg-blue-500 w-1/2' :
                'bg-yellow-500 w-0'
              }`}
            ></div>
          </div>
        </div>

        {/* Footer con información adicional */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span>ID: {tarea.idTarea}</span>
            {tarea.fases && tarea.fases.length > 0 && (
              <span>
                Fases: {tarea.fases.map(f => f.orden).sort((a, b) => a - b).join(', ')}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicador de estado con icono */}
            {tarea.estado === 'COMPLETADA' && (
              <div className="flex items-center text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Completada</span>
              </div>
            )}
            {tarea.estado === 'EN_PROGRESO' && (
              <div className="flex items-center text-blue-600">
                <div className="w-3 h-3 mr-1 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>En Progreso</span>
              </div>
            )}
            {tarea.estado === 'PENDIENTE' && (
              <div className="flex items-center text-yellow-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Pendiente</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
