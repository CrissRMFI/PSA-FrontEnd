import { useState } from 'react';

export default function FiltrosTareas({ filtros, setFiltros, fases, tareas }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      prioridad: '',
      responsable: '',
      fase: ''
    });
  };

  const getResponsablesUnicos = () => {
    const responsables = tareas.map(t => t.responsable).filter(Boolean);
    return [...new Set(responsables)].sort();
  };

  const hayFiltrosActivos = () => {
    return Object.values(filtros).some(valor => valor !== '');
  };

  const contarTareasFiltradas = () => {
    return tareas.filter(tarea => {
      if (filtros.estado && tarea.estado !== filtros.estado) return false;
      if (filtros.prioridad && tarea.prioridad !== filtros.prioridad) return false;
      if (filtros.responsable && !tarea.responsable.toLowerCase().includes(filtros.responsable.toLowerCase())) return false;
      if (filtros.fase && !tarea.fases?.some(f => f.idFase.toString() === filtros.fase)) return false;
      return true;
    }).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6">
      {/* Header del panel de filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg 
                className={`w-5 h-5 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="font-medium">Filtros de Tareas</span>
            </button>

            {hayFiltrosActivos() && (
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                  {contarTareasFiltradas()} de {tareas.length} tareas
                </span>
                <button
                  onClick={limpiarFiltros}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Búsqueda rápida por responsable */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Buscar:</span>
            <input
              type="text"
              placeholder="Responsable..."
              value={filtros.responsable}
              onChange={(e) => handleFiltroChange('responsable', e.target.value)}
              className="w-40 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      {mostrarFiltros && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADA">Completada</option>
              </select>
            </div>

            {/* Filtro por Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={filtros.prioridad}
                onChange={(e) => handleFiltroChange('prioridad', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>

            {/* Filtro por Fase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fase
              </label>
              <select
                value={filtros.fase}
                onChange={(e) => handleFiltroChange('fase', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las fases</option>
                {fases
                  .sort((a, b) => a.orden - b.orden)
                  .map(fase => (
                    <option key={fase.idFase} value={fase.idFase.toString()}>
                      {fase.orden}. {fase.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Filtro por Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable
              </label>
              <select
                value={filtros.responsable}
                onChange={(e) => handleFiltroChange('responsable', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los responsables</option>
                {getResponsablesUnicos().map(responsable => (
                  <option key={responsable} value={responsable}>
                    {responsable}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700 mb-3 block">Filtros Rápidos:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltros({ estado: 'PENDIENTE', prioridad: '', responsable: '', fase: '' })}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors"
              >
                📋 Tareas Pendientes
              </button>
              <button
                onClick={() => setFiltros({ estado: 'EN_PROGRESO', prioridad: '', responsable: '', fase: '' })}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                🔄 En Progreso
              </button>
              <button
                onClick={() => setFiltros({ estado: '', prioridad: 'ALTA', responsable: '', fase: '' })}
                className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              >
                🚨 Alta Prioridad
              </button>
              <button
                onClick={() => {
                  // Mostrar solo tareas multifase (esto requiere lógica especial)
                  const tareasMultifase = tareas.filter(t => t.fases && t.fases.length > 1);
                  if (tareasMultifase.length > 0) {
                    // Por simplicidad, no implementamos este filtro complejo aquí
                    alert('Funcionalidad de filtro multifase pendiente de implementar');
                  }
                }}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
              >
                ⭐ Multifase
              </button>
              <button
                onClick={limpiarFiltros}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                🗑️ Limpiar Todo
              </button>
            </div>
          </div>

          {/* Información de resultados */}
          {hayFiltrosActivos() && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Mostrando {contarTareasFiltradas()} de {tareas.length} tareas
                </span>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {filtros.estado && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      Estado: {filtros.estado.replace('_', ' ')}
                    </span>
                  )}
                  {filtros.prioridad && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Prioridad: {filtros.prioridad}
                    </span>
                  )}
                  {filtros.fase && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                      Fase: {fases.find(f => f.idFase.toString() === filtros.fase)?.nombre}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
