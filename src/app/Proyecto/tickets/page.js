'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ticketsService } from '../services/ticketsService';
import { proyectosService } from '../services/proyectosService';
import TicketCard from '../components/TicketCard';

export default function TicketsPage() {
  const intervalRef = useRef(null);

  const [tickets, setTickets] = useState([]);
  const [ticketsSinAsignar, setTicketsSinAsignar] = useState([]);
  const [todosLosProyectos, setTodosLosProyectos] = useState([]);
  const [todasLasTareas, setTodasLasTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    severidad: '',
    proyecto: '',
    busqueda: ''
  });

  // Estados para modales
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

  useEffect(() => {
    loadDatosCompletos();
    iniciarSincronizacionAutomatica();

    // Cleanup: limpiar interval al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadDatosCompletos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar todos los proyectos
      const proyectos = await proyectosService.getAllProyectos();
      setTodosLosProyectos(proyectos);
      
      // Cargar todas las tareas de todos los proyectos
      const tareasPromises = proyectos.map(proyecto => 
        proyectosService.getTareasByProyecto(proyecto.idProyecto)
          .then(tareas => tareas.map(tarea => ({
            ...tarea,
            proyectoId: proyecto.idProyecto,
            proyectoNombre: proyecto.nombre
          })))
          .catch(err => {
            console.warn(`Error al cargar tareas del proyecto ${proyecto.idProyecto}:`, err);
            return [];
          })
      );
      
      const todasLasTareasArrays = await Promise.all(tareasPromises);
      const tareasPlanas = todasLasTareasArrays.flat();
      setTodasLasTareas(tareasPlanas);
      
      // Cargar tickets
      await cargarTickets();
      
    } catch (err) {
      setError('Error al cargar la información: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarTickets = async () => {
    try {
      const [todosLosTickets, sinAsignar] = await Promise.all([
        ticketsService.obtenerTodos(),
        ticketsService.obtenerSinAsignar()
      ]);
      
      setTickets(todosLosTickets);
      setTicketsSinAsignar(sinAsignar);
    } catch (err) {
      console.error('Error al cargar tickets:', err);
      setError('Error al cargar tickets: ' + err.message);
    }
  };

  const sincronizar = async () => {
    setSyncLoading(true);
    try {
      setError(null);
      const resultado = await ticketsService.sincronizar();
      
      // Recargar datos después de sincronizar
      await cargarTickets();
      setLastSync(new Date());
      
      console.log('Sincronización exitosa:', resultado);
      
    } catch (error) {
      console.error('Error al sincronizar:', error);
      setError('Error al sincronizar tickets: ' + error.message);
    } finally {
      setSyncLoading(false);
    }
  };

  const iniciarSincronizacionAutomatica = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(async () => {
      try {
        console.log('Sincronización automática ejecutándose...');
        await sincronizar();
      } catch (error) {
        console.error('Error en sincronización automática:', error);
        // No mostramos error al usuario en sync automática
      }
    }, 5 * 60 * 1000); // 5 minutos
  };

  const handleAsignar = (ticket) => {
    setTicketSeleccionado(ticket);
    setTareasSeleccionadas([]);
    setShowAsignacionModal(true);
  };

  const handleConfirmarAsignacion = async () => {
    if (!ticketSeleccionado || tareasSeleccionadas.length === 0) return;

    try {
      setError(null);
      await ticketsService.asignarTareas(ticketSeleccionado.id, tareasSeleccionadas);
      
      // Recargar tickets
      await cargarTickets();
      
      // Cerrar modal
      setShowAsignacionModal(false);
      setTicketSeleccionado(null);
      setTareasSeleccionadas([]);
      
      console.log('Tareas asignadas exitosamente');
      
    } catch (error) {
      console.error('Error al asignar tareas:', error);
      setError('Error al asignar tareas: ' + error.message);
    }
  };

  const handleTareaToggle = (tareaId) => {
    setTareasSeleccionadas(prev => 
      prev.includes(tareaId)
        ? prev.filter(id => id !== tareaId)
        : [...prev, tareaId]
    );
  };

  const handleEdit = (ticket) => {
    // Por ahora solo log, después implementaremos la edición
    console.log('Gestionar ticket:', ticket);
  };

  const handleDelete = (ticket) => {
    // Por ahora solo log, después implementaremos la eliminación
    console.log('Eliminar ticket:', ticket);
  };

  // Filtrar tickets según criterios
  const ticketsFiltrados = tickets.filter(ticket => {
    if (filtros.estado && ticket.estado !== filtros.estado) return false;
    if (filtros.prioridad && ticket.prioridad !== filtros.prioridad) return false;
    if (filtros.severidad && ticket.severidad !== filtros.severidad) return false;
    
    // Filtrar por proyecto (basado en tareas asignadas)
    if (filtros.proyecto) {
      const tieneProyecto = ticket.tareasAsignadas?.some(tarea => 
        tarea.proyectoNombre?.toLowerCase().includes(filtros.proyecto.toLowerCase())
      );
      if (!tieneProyecto) return false;
    }
    
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      return (
        ticket.codigo.toLowerCase().includes(busqueda) ||
        ticket.nombre.toLowerCase().includes(busqueda) ||
        ticket.descripcion?.toLowerCase().includes(busqueda)
      );
    }
    return true;
  });

  // Métricas
  const metricas = {
    total: tickets.length,
    pendientes: tickets.filter(t => t.estado === 'RECIBIDO').length,
    asignados: tickets.filter(t => t.estado === 'ASIGNADO').length,
    enProceso: tickets.filter(t => t.estado === 'EN_PROCESO').length,
    resueltos: tickets.filter(t => t.estado === 'RESUELTO').length,
  };

  // Tareas disponibles para asignar (sin ticket asociado)
  const tareasDisponibles = todasLasTareas.filter(tarea => !tarea.ticketAsociado);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando gestión de tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/Proyecto" className="hover:text-blue-600">
            Proyectos
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Gestión de Tickets</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎫 Gestión Global de Tickets
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Administra tickets de soporte y asígnalos a tareas de cualquier proyecto
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Total Tickets: {tickets.length}</span>
              <span>•</span>
              <span>Proyectos: {todosLosProyectos.length}</span>
              <span>•</span>
              <span>Tareas Disponibles: {tareasDisponibles.length}</span>
              {lastSync && (
                <>
                  <span>•</span>
                  <span>Última sync: {lastSync.toLocaleTimeString('es-AR')}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={sincronizar}
              disabled={syncLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sincronizando...
                </div>
              ) : (
                '🔄 Sincronizar'
              )}
            </button>
            <Link
              href="/Proyecto"
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              ← Volver a Proyectos
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas de Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total</h3>
          <p className="text-3xl font-bold text-blue-600">{metricas.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">{metricas.pendientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Asignados</h3>
          <p className="text-3xl font-bold text-purple-600">{metricas.asignados}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">En Proceso</h3>
          <p className="text-3xl font-bold text-blue-600">{metricas.enProceso}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Resueltos</h3>
          <p className="text-3xl font-bold text-green-600">{metricas.resueltos}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="RECIBIDO">Pendientes</option>
              <option value="ASIGNADO">Asignados</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="RESUELTO">Resueltos</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
            <select
              value={filtros.prioridad}
              onChange={(e) => setFiltros(prev => ({ ...prev, prioridad: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las prioridades</option>
              <option value="HIGH_PRIORITY">Alta</option>
              <option value="MEDIUM_PRIORITY">Media</option>
              <option value="LOW_PRIORITY">Baja</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
            <select
              value={filtros.severidad}
              onChange={(e) => setFiltros(prev => ({ ...prev, severidad: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las severidades</option>
              <option value="LEVEL_1">Nivel 1</option>
              <option value="LEVEL_2">Nivel 2</option>
              <option value="LEVEL_3">Nivel 3</option>
              <option value="LEVEL_4">Nivel 4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proyecto</label>
            <input
              type="text"
              placeholder="Filtrar por proyecto..."
              value={filtros.proyecto}
              onChange={(e) => setFiltros(prev => ({ ...prev, proyecto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
            <input
              type="text"
              placeholder="Buscar tickets..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      {ticketsFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {tickets.length === 0 ? 'No hay tickets sincronizados' : 'No hay tickets que coincidan con los filtros'}
          </h3>
          <p className="text-gray-600 mb-4">
            {tickets.length === 0 ? 'Sincroniza con el módulo de soporte para obtener tickets' : 'Prueba ajustando los filtros de búsqueda'}
          </p>
          {tickets.length === 0 && (
            <button
              onClick={sincronizar}
              disabled={syncLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {syncLoading ? 'Sincronizando...' : 'Sincronizar Tickets'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {ticketsFiltrados.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onAsignar={handleAsignar}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Información sobre sincronización automática */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🔄 Sincronización Automática</h3>
        <p className="text-blue-700 text-sm">
          Los tickets se sincronizan automáticamente cada 5 minutos con el módulo de soporte.
          También puedes sincronizar manualmente usando el botón "Sincronizar" en cualquier momento.
        </p>
      </div>

      {/* Modal de Asignación de Tareas */}
      {showAsignacionModal && ticketSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Asignar Tareas al Ticket {ticketSeleccionado.codigo}
                </h2>
                <button
                  onClick={() => setShowAsignacionModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Información del ticket */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">{ticketSeleccionado.nombre}</h3>
                <p className="text-sm text-gray-600 mb-2">{ticketSeleccionado.descripcion}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Prioridad: {ticketsService.obtenerTextoprioridad(ticketSeleccionado.prioridad)}</span>
                  <span>Severidad: {ticketsService.obtenerTextoSeveridad(ticketSeleccionado.severidad)}</span>
                  <span>Cliente: {ticketSeleccionado.idCliente}</span>
                </div>
              </div>

              {/* Selección de tareas */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Seleccionar Tareas Disponibles ({tareasDisponibles.length})
                </h3>
                
                {tareasDisponibles.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ No hay tareas disponibles para asignar.
                      <br />Todas las tareas existentes ya tienen tickets asignados o no hay tareas creadas en los proyectos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {tareasDisponibles.map((tarea) => (
                      <div key={tarea.idTarea} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id={`tarea-${tarea.idTarea}`}
                          checked={tareasSeleccionadas.includes(tarea.idTarea)}
                          onChange={() => handleTareaToggle(tarea.idTarea)}
                          className="mt-1"
                        />
                        <label htmlFor={`tarea-${tarea.idTarea}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-gray-800">{tarea.titulo}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{tarea.descripcion}</div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span className="font-medium text-blue-600">📁 {tarea.proyectoNombre}</span>
                            <span>Estado: {tarea.estado}</span>
                            <span>Prioridad: {tarea.prioridad}</span>
                            <span>Responsable: {tarea.responsable}</span>
                            {tarea.fases && tarea.fases.length > 0 && (
                              <span>
                                Fase{tarea.fases.length > 1 ? 's' : ''}: {tarea.fases.map(f => f.nombre).join(', ')}
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen de selección */}
              {tareasSeleccionadas.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-green-800 mb-2">
                    ✅ Resumen de asignación:
                  </h4>
                  <p className="text-green-700 text-sm">
                    Se asignarán {tareasSeleccionadas.length} tarea{tareasSeleccionadas.length > 1 ? 's' : ''} al ticket {ticketSeleccionado.codigo}.
                    El estado del ticket cambiará automáticamente a "ASIGNADO".
                  </p>
                  
                  {/* Preview de tareas seleccionadas */}
                  <div className="mt-3 space-y-1">
                    {tareasSeleccionadas.map(tareaId => {
                      const tarea = tareasDisponibles.find(t => t.idTarea === tareaId);
                      return tarea ? (
                        <div key={tareaId} className="text-xs bg-white rounded px-2 py-1 border border-green-200">
                          <span className="font-medium">{tarea.titulo}</span>
                          <span className="text-green-600 ml-2">({tarea.proyectoNombre})</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAsignacionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarAsignacion}
                  disabled={tareasSeleccionadas.length === 0}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Asignar {tareasSeleccionadas.length} Tarea{tareasSeleccionadas.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
