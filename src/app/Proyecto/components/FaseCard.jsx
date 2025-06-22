import Link from 'next/link';

export default function FaseCard({ fase, index, onEdit, onDelete, getEstadoColor, proyectoId }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Usar index + 1 para el orden visual
  const getOrderIcon = (numeroVisual) => {
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
        {numeroVisual}
      </div>
    );
  };

  const calculateDuration = () => {
    if (!fase.fechaInicio || !fase.fechaFinEstimada) return null;
    
    const inicio = new Date(fase.fechaInicio);
    const fin = new Date(fase.fechaFinEstimada);
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 día';
    if (diffDays < 30) return `${diffDays} días`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} meses`;
    return `${Math.round(diffDays / 365)} años`;
  };

  const isOverdue = () => {
    if (!fase.fechaFinEstimada || fase.estadoDescriptivo === 'Completada') return false;
    return new Date(fase.fechaFinEstimada) < new Date();
  };

  // Calcular número visual basado en el índice
  const numeroVisual = index + 1;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${
      fase.estadoDescriptivo === 'Completada' ? 'border-green-500' :
      fase.estadoDescriptivo === 'En Progreso' ? 'border-blue-500' :
      isOverdue() ? 'border-red-500' : 'border-yellow-500'
    }`}>
      
      <div className="p-6">
        {/* Header de la fase */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Usar numeroVisual en lugar de fase.orden */}
            {getOrderIcon(numeroVisual)}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {fase.nombre}
              </h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(fase.estadoDescriptivo)}`}>
                {fase.estadoDescriptivo}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(fase)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar fase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(fase)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar fase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Información de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-gray-500 text-sm">Fecha Inicio:</span>
            <p className="font-medium">{formatDate(fase.fechaInicio)}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Fecha Fin Estimada:</span>
            <p className={`font-medium ${isOverdue() ? 'text-red-600' : ''}`}>
              {formatDate(fase.fechaFinEstimada)}
              {isOverdue() && (
                <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">
                  VENCIDA
                </span>
              )}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Duración:</span>
            <p className="font-medium">{calculateDuration() || 'No calculable'}</p>
          </div>
        </div>

        {/* Indicador de progreso visual */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso de la fase</span>
            <span>
              {fase.estadoDescriptivo === 'Completada' ? '100%' :
               fase.estadoDescriptivo === 'En Progreso' ? '50%' : '0%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                fase.estadoDescriptivo === 'Completada' ? 'bg-green-500 w-full' :
                fase.estadoDescriptivo === 'En Progreso' ? 'bg-blue-500 w-1/2' :
                'bg-yellow-500 w-0'
              }`}
            ></div>
          </div>
        </div>

        {/* Timeline visual */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              index === 0 ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            {/* Mostrar número visual pero mantener referencia al ID real */}
            <span>Fase {numeroVisual}</span>
          </div>
          
          <div className="flex-1 mx-4 h-px bg-gray-200 relative">
            <div className={`absolute top-0 left-0 h-px transition-all duration-500 ${
              fase.estadoDescriptivo === 'Completada' ? 'bg-green-500 w-full' :
              fase.estadoDescriptivo === 'En Progreso' ? 'bg-blue-500 w-1/2' :
              'bg-yellow-500 w-1/4'
            }`}></div>
          </div>

          <div className="text-right">
            <span className="text-gray-600 font-medium">ID: {fase.idFase}</span>
          </div>
        </div>

        {/* Enlaces de navegación */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Link
            href={`/Proyecto/${proyectoId}/tareas?fase=${fase.idFase}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Ver Tareas de esta Fase →
          </Link>
          
          <div className="text-xs text-gray-500">
            {/* Mostrar tanto el orden visual como el orden real del backend */}
            Posición: {numeroVisual} | Orden BD: {fase.orden}
          </div>
        </div>
      </div>
    </div>
  );
}
