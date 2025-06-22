// components/TicketSelector.jsx
'use client';

import { useState, useEffect } from 'react';
import { ticketsService } from '../services/ticketsService';

export default function TicketSelector({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  required = false,
  placeholder = "Seleccionar ticket (opcional)"
}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    cargarTicketsDisponibles();
  }, []);

  const cargarTicketsDisponibles = async () => {
    try {
      setLoadError(null);
      // Cargar tickets sin asignar + el ticket actualmente seleccionado (si existe)
      const [sinAsignar, todosLosTickets] = await Promise.all([
        ticketsService.obtenerSinAsignar(),
        ticketsService.obtenerTodos()
      ]);

      // Si hay un ticket seleccionado, incluirlo en la lista aunque esté asignado
      let ticketsDisponibles = [...sinAsignar];
      
      if (value && value !== '') {
        const ticketSeleccionado = todosLosTickets.find(t => t.id.toString() === value.toString());
        if (ticketSeleccionado && !sinAsignar.find(t => t.id === ticketSeleccionado.id)) {
          // Agregar el ticket actualmente seleccionado al inicio
          ticketsDisponibles = [ticketSeleccionado, ...sinAsignar];
        }
      }

      setTickets(ticketsDisponibles);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      setLoadError('Error al cargar tickets disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (ticketId) => {
    onChange(ticketId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  const ticketsFiltrados = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.codigo.toLowerCase().includes(searchLower) ||
      ticket.nombre.toLowerCase().includes(searchLower)
    );
  });

  const ticketSeleccionado = tickets.find(t => t.id.toString() === value?.toString());

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-500 text-sm">Cargando tickets...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="relative">
        <div className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 flex items-center justify-between">
          <span className="text-red-600 text-sm">{loadError}</span>
          <button
            type="button"
            onClick={cargarTicketsDisponibles}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Campo selector */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {ticketSeleccionado ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full">
                  <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{ticketSeleccionado.codigo}</span>
                  <span className="text-gray-500 text-sm ml-2 line-clamp-1">{ticketSeleccionado.nombre}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticketSeleccionado.prioridad === 'HIGH_PRIORITY' ? 'bg-red-100 text-red-600' :
                  ticketSeleccionado.prioridad === 'MEDIUM_PRIORITY' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {ticketSeleccionado.prioridad === 'HIGH_PRIORITY' ? 'Alta' :
                   ticketSeleccionado.prioridad === 'MEDIUM_PRIORITY' ? 'Media' : 'Baja'}
                </span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {ticketSeleccionado && !disabled && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                title="Quitar ticket"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            {!disabled && (
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Buscador */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Lista de tickets */}
          <div className="max-h-60 overflow-y-auto">
            {/* Opción "Sin ticket" */}
            <div
              onClick={() => handleClear()}
              className="w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-600 font-medium">Sin ticket asignado</span>
              </div>
            </div>

            {/* Tickets disponibles */}
            {ticketsFiltrados.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'No se encontraron tickets' : 'No hay tickets disponibles'}
              </div>
            ) : (
              ticketsFiltrados.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleSelect(ticket.id)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer ${
                    ticket.id.toString() === value?.toString() ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full">
                        <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{ticket.codigo}</p>
                        <p className="text-sm text-gray-600 truncate">{ticket.nombre}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.prioridad === 'HIGH_PRIORITY' ? 'bg-red-100 text-red-600' :
                        ticket.prioridad === 'MEDIUM_PRIORITY' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {ticket.prioridad === 'HIGH_PRIORITY' ? 'Alta' :
                         ticket.prioridad === 'MEDIUM_PRIORITY' ? 'Media' : 'Baja'}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        {ticket.severidad.replace('LEVEL_', 'Nv')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con información */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Solo se muestran tickets sin asignar + el ticket actual (si existe)
            </p>
          </div>
        </div>
      )}

      {/* Información adicional */}
      {!required && (
        <p className="text-gray-500 text-xs mt-1">
          ⚠️ Opcional: Puedes asignar un ticket de soporte a esta tarea
        </p>
      )}
    </div>
  );
}
