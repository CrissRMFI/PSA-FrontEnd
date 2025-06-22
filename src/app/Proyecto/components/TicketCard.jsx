// components/TicketCard.jsx
'use client';

import { useState } from 'react';
import { ticketsService } from '../services/ticketsService';

export default function TicketCard({ 
  ticket, 
  onAsignar, 
  onEdit, 
  onDelete, 
  showActions = true 
}) {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorBorde = () => {
    const estadoReal = getEstadoReal();
    switch (estadoReal) {
      case 'RESUELTO': return 'border-green-500';
      case 'COMPLETO': return 'border-emerald-500';
      case 'EN_PROCESO': return 'border-blue-500';
      case 'ASIGNADO': return 'border-purple-500';
      default: return 'border-yellow-500'; // RECIBIDO
    }
  };

  const handleAsignar = async () => {
    if (onAsignar) {
      setLoading(true);
      try {
        await onAsignar(ticket);
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ NUEVO: Función para determinar si puede asignar tareas
  const puedeAsignarTareas = () => {
    // Si no está resuelto ni en proceso, puede asignar tareas
    return ticket.estado !== 'RESUELTO' && ticket.estado !== 'EN_PROCESO';
  };

  // ✅ NUEVO: Texto dinámico del botón basado en si tiene tareas asignadas
  const getTextoBotonAsignar = () => {
    if (ticket.asignado && ticket.cantidadTareasAsignadas > 0) {
      return 'Asignar Más';
    } else {
      return 'Asignar Tareas';
    }
  };

  // ✅ NUEVO: Estado real basado en datos actualizados Y completitud de tareas
  const getEstadoReal = () => {
    // Si está resuelto explícitamente, mantener como resuelto
    if (ticket.estado === 'RESUELTO') return 'RESUELTO';
    
    // Si está en proceso explícitamente, mantener como en proceso
    if (ticket.estado === 'EN_PROCESO') return 'EN_PROCESO';
    
    // ✅ NUEVO: Si tiene tareas asignadas, verificar si todas están completas
    if (ticket.asignado && ticket.cantidadTareasAsignadas > 0) {
      // Si todas las tareas están completas, marcar como COMPLETO
      if (ticket.tareasAsignadas && ticket.tareasAsignadas.length > 0) {
        const todasCompletas = ticket.tareasAsignadas.every(tarea => 
          tarea.estado === 'COMPLETADA' || tarea.estado === 'TERMINADA' || tarea.estado === 'FINALIZADA'
        );
        
        if (todasCompletas) {
          return 'COMPLETO';
        }
      }
      
      return 'ASIGNADO';
    } else {
      return 'RECIBIDO';
    }
  };

  // ✅ NUEVO: Texto de estado real con soporte para COMPLETO
  const getTextoEstadoReal = () => {
    const estadoReal = getEstadoReal();
    if (estadoReal === 'COMPLETO') return 'Completo';
    return ticketsService.obtenerTextoEstado(estadoReal);
  };

  // ✅ NUEVO: Color de estado real con soporte para COMPLETO
  const getColorEstadoReal = () => {
    const estadoReal = getEstadoReal();
    if (estadoReal === 'COMPLETO') return 'bg-emerald-100 text-emerald-800';
    return ticketsService.obtenerColorPorEstado(estadoReal);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${getColorBorde()}`}>
      <div className="p-6">
        {/* Header del ticket */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3 mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {ticket.codigo}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {ticket.nombre}
                </p>
              </div>
            </div>

            {/* Estados y prioridad */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorEstadoReal()}`}>
                {getTextoEstadoReal()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${ticketsService.obtenerColorPorPrioridad(ticket.prioridad)}`}>
                {ticketsService.obtenerTextoprioridad(ticket.prioridad)} PRIORIDAD
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {ticketsService.obtenerTextoSeveridad(ticket.severidad)}
              </span>
            </div>

            {/* Información del cliente y producto */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0a2 2 0 002-2v-4m-2 4a2 2 0 01-2 2M9 7h6m-6 4h6m-6 4h6" />
              </svg>
              <span>Cliente: <span className="font-medium">{ticket.idCliente}</span></span>
              <span className="mx-2">•</span>
              <span>Producto: <span className="font-medium">{ticket.idProducto}</span></span>
              {ticket.version && (
                <>
                  <span className="mx-2">•</span>
                  <span>Versión: <span className="font-medium">{ticket.version}</span></span>
                </>
              )}
            </div>
          </div>

          {/* Acciones */}
          {showActions && (
            <div className="flex space-x-2 ml-4">
              {/* ✅ CAMBIO: Permitir asignar a RECIBIDO y ASIGNADO */}
              {puedeAsignarTareas() && (
                <button
                  onClick={handleAsignar}
                  disabled={loading}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    ticket.asignado && ticket.cantidadTareasAsignadas > 0
                      ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title={`${getTextoBotonAsignar()} al ticket ${ticket.codigo}`}
                >
                  {loading ? 'Procesando...' : getTextoBotonAsignar()}
                </button>
              )}

              {/* ✅ ELIMINAR: Botones de edición y borrado comentados */}
              {/* 
              {onEdit && (
                <button
                  onClick={() => onEdit(ticket)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Gestionar ticket"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(ticket)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar ticket"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              */}
            </div>
          )}
        </div>

        {/* Descripción del ticket */}
        {ticket.descripcion && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 mb-2 block">Descripción:</span>
            <p className="text-sm text-gray-700 line-clamp-3">{ticket.descripcion}</p>
          </div>
        )}

        {/* Tareas asignadas */}
        {ticket.asignado && ticket.tareasAsignadas && ticket.tareasAsignadas.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 mb-2 block">
              {ticket.tareasAsignadas.length === 1 ? 'Tarea asignada:' : 'Tareas asignadas:'}
            </span>
            <div className="space-y-1">
              {ticket.tareasAsignadas.map((tarea, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-xs"
                >
                  <span className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{tarea.titulo}</span>
                  {tarea.proyectoNombre && (
                    <span className="text-purple-500">- {tarea.proyectoNombre}</span>
                  )}
                </div>
              ))}
            </div>
            {ticket.tareasAsignadas.length > 1 && (
              <div className="mt-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block">
                ⭐ Ticket Multi-tarea
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVO: Indicador especial cuando todas las tareas están completas */}
        {getEstadoReal() === 'COMPLETO' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-sm text-emerald-700 font-medium block">
                  🎉 ¡Todas las tareas completadas!
                </span>
                <span className="text-xs text-emerald-600">
                  Este ticket está listo para ser resuelto
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ✅ NUEVO: Indicador de capacidad de asignación */}
        {ticket.asignado && ticket.cantidadTareasAsignadas > 0 && getEstadoReal() !== 'COMPLETO' && (
          <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm text-purple-700 font-medium">
                Puedes asignar más tareas a este ticket
              </span>
            </div>
          </div>
        )}



        {/* Fecha de creación */}
        <div className="mb-4">
          <span className="text-gray-500 text-xs">Fecha de Creación:</span>
          <p className="font-medium text-sm">{formatDate(ticket.fechaCreacion)}</p>
        </div>



        {/* Footer con información adicional */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {ticket.asignado && (
              <span>Tareas asignadas: {ticket.cantidadTareasAsignadas}</span>
            )}
            <span>Prioridad: {ticketsService.obtenerTextoprioridad(ticket.prioridad)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicador de estado con icono */}
            {getEstadoReal() === 'COMPLETO' && (
              <div className="flex items-center text-emerald-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Completo</span>
              </div>
            )}
            {ticket.estado === 'RESUELTO' && (
              <div className="flex items-center text-green-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Resuelto</span>
              </div>
            )}
            {ticket.estado === 'EN_PROCESO' && (
              <div className="flex items-center text-blue-600">
                <div className="w-3 h-3 mr-1 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>En Proceso</span>
              </div>
            )}
            {ticket.estado === 'ASIGNADO' && getEstadoReal() !== 'COMPLETO' && (
              <div className="flex items-center text-purple-600">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>Asignado</span>
              </div>
            )}
            {ticket.estado === 'RECIBIDO' && (
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
