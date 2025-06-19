import Link from 'next/link';

export default function ProyectoCard({ proyecto, onEdit, onDelete, getEstadoColor }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateProgress = () => {
    if (!proyecto.totalTareas || proyecto.totalTareas === 0) return 0;
    return Math.round(proyecto.totalTareas * 0.6); // Ejemplo: 60% completado
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Header del Card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
            {proyecto.nombre}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(proyecto.estado)}`}>
            {proyecto.estado}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {proyecto.descripcion || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Líder: {proyecto.liderProyecto}</span>
          <span>ID: {proyecto.idProyecto}</span>
        </div>
      </div>

      {/* Información del Proyecto */}
      <div className="p-6 space-y-4">
        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Inicio:</span>
            <p className="font-medium">{formatDate(proyecto.fechaInicio)}</p>
          </div>
          <div>
            <span className="text-gray-500">Fin Estimado:</span>
            <p className="font-medium">{formatDate(proyecto.fechaFinEstimada)}</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{proyecto.totalTareas || 0}</p>
            <p className="text-xs text-blue-600">Tareas</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{proyecto.riesgosActivos || 0}</p>
            <p className="text-xs text-red-600">Riesgos</p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enlaces de navegación */}
      <div className="p-6 pt-0 space-y-3">
        {/* Botones de acción principales */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/Proyecto/${proyecto.idProyecto}/fases`}
            className="text-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-lg font-medium text-sm transition-colors"
          >
            📋 Fases
          </Link>
          <Link
            href={`/Proyecto/${proyecto.idProyecto}/tareas`}
            className="text-center bg-green-50 hover:bg-green-100 text-green-600 py-2 px-3 rounded-lg font-medium text-sm transition-colors"
          >
            ✅ Tareas
          </Link>
        </div>

        {/* Acciones secundarias */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <Link
            href={`/Proyecto/${proyecto.idProyecto}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Ver Detalles →
          </Link>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(proyecto)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar proyecto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(proyecto)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar proyecto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
