import { useState, useEffect, useRef } from 'react';
import { proyectosService } from '../services/proyectosService';

export default function RecursoSelector({ 
  value, 
  onChange, 
  placeholder = "Seleccionar recurso", 
  tipo = "general", // "lider", "responsable", "general"
  error,
  disabled = false,
  required = false,
  className = ""
}) {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadRecursos();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadRecursos = async () => {
    try {
      setLoading(true);
      const data = await proyectosService.getAllRecursos();
      setRecursos(data);
    } catch (err) {
      console.error('Error al cargar recursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSincronizar = async () => {
    try {
      setSyncLoading(true);
      await proyectosService.sincronizarRecursos();
      await loadRecursos();
    } catch (err) {
      console.error('Error al sincronizar recursos:', err);
    } finally {
      setSyncLoading(false);
    }
  };

  const filteredRecursos = recursos.filter(recurso => {
    const searchLower = searchTerm.toLowerCase();
    return (
      recurso.nombre.toLowerCase().includes(searchLower) ||
      recurso.apellido.toLowerCase().includes(searchLower) ||
      recurso.nombreCompleto.toLowerCase().includes(searchLower) ||
      recurso.dni.includes(searchTerm)
    );
  });

  const selectedRecurso = recursos.find(r => r.id === value);

  const handleSelectRecurso = (recurso) => {
    onChange(recurso.id);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onChange('');
    setShowDropdown(false);
    setSearchTerm('');
  };

  const getPlaceholderText = () => {
    switch (tipo) {
      case 'lider': return 'Seleccionar líder del proyecto';
      case 'responsable': return 'Seleccionar responsable de la tarea';
      default: return placeholder;
    }
  };

  const getIcon = () => {
    switch (tipo) {
      case 'lider': 
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'responsable':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-gray-500">Cargando recursos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Campo principal */}
      <div 
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
          error ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
        onClick={() => !disabled && setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center flex-1">
          {getIcon()}
          <span className={`ml-2 ${selectedRecurso ? 'text-gray-800' : 'text-gray-500'}`}>
            {selectedRecurso ? selectedRecurso.nombreCompleto : getPlaceholderText()}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Botón de sincronización */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSincronizar();
            }}
            disabled={syncLoading || disabled}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Sincronizar recursos desde API externa"
          >
            {syncLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>

          {/* Botón de limpiar */}
          {selectedRecurso && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Limpiar selección"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Flecha dropdown */}
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Lista de recursos */}
          <div className="max-h-40 overflow-y-auto">
            {!required && (
              <div
                onClick={() => handleClearSelection()}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-500 italic border-b border-gray-100"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span>Sin asignar</span>
                </div>
              </div>
            )}

            {filteredRecursos.length === 0 ? (
              <div className="px-3 py-8 text-gray-500 text-center">
                {searchTerm ? (
                  <div>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p>No se encontraron recursos</p>
                    <p className="text-xs mt-1">Prueba con otro término de búsqueda</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>No hay recursos disponibles</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSincronizar();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                    >
                      Sincronizar recursos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredRecursos.map((recurso) => (
                <div
                  key={recurso.id}
                  onClick={() => handleSelectRecurso(recurso)}
                  className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors ${
                    value === recurso.id ? 'bg-blue-100 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-blue-600">
                        {recurso.nombre.charAt(0)}{recurso.apellido.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{recurso.nombreCompleto}</div>
                      <div className="text-xs text-gray-500">DNI: {recurso.dni}</div>
                    </div>
                  </div>
                  
                  {value === recurso.id && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer con estadísticas */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
            <span>
              {filteredRecursos.length} recurso{filteredRecursos.length !== 1 ? 's' : ''} 
              {searchTerm && ` encontrado${filteredRecursos.length !== 1 ? 's' : ''}`}
            </span>
            {syncLoading && (
              <span className="text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
                Sincronizando...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
