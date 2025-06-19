'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { proyectosService } from '../../services/proyectosService';
import TareaCard from '../../components/TareaCard';
import TareaForm from '../../components/TareaForm';
import DeleteConfirm from '../../components/DeleteConfirm';
import FiltrosTareas from '../../components/FiltrosTareas';

export default function TareasPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const proyectoId = params.id;
  const faseIdParam = searchParams.get('fase'); // Para filtrar por fase desde URL

  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [deletingTarea, setDeletingTarea] = useState(null);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    responsable: '',
    fase: faseIdParam || ''
  });

  useEffect(() => {
    if (proyectoId) {
      loadProyectoCompleto();
    }
  }, [proyectoId]);

  const loadProyectoCompleto = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar proyecto completo con fases
      const proyectoData = await proyectosService.getProyectoById(proyectoId);
      setProyecto(proyectoData);
      setFases(proyectoData.fases || []);
      
      // Cargar tareas del proyecto
      const tareasData = await proyectosService.getTareasByProyecto(proyectoId);
      setTareas(tareasData);
      
    } catch (err) {
      setError('Error al cargar el proyecto y sus tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTarea = async (tareaData) => {
    try {
      let newTarea;
      
      // Decidir qué endpoint usar según si hay responsable recurso o no
      if (tareaData.responsableRecursoId) {
        // Usar endpoint con recurso
        newTarea = await proyectosService.createTareaConRecurso(proyectoId, tareaData);
      } else {
        // Usar endpoint tradicional (fallback por compatibilidad)
        newTarea = await proyectosService.createTarea(proyectoId, tareaData);
      }
      
      // Si se asignaron múltiples fases, usar el endpoint específico
      if (tareaData.faseIds && tareaData.faseIds.length > 1) {
        await proyectosService.asignarMultiplesFases(newTarea.idTarea, tareaData.faseIds);
      }
      
      // Recargar tareas para obtener la info actualizada
      await loadTareas();
      setShowForm(false);
      
      console.log('Tarea creada exitosamente:', newTarea);
      
    } catch (err) {
      setError('Error al crear la tarea. ' + (err.message || ''));
      console.error('Error detallado:', err);
    }
  };

  const loadTareas = async () => {
    try {
      const tareasData = await proyectosService.getTareasByProyecto(proyectoId);
      setTareas(tareasData);
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error(err);
    }
  };

  const handleUpdateTarea = async (tareaData) => {
    try {
      // Si estamos editando y hay cambio de responsable
      if (tareaData.responsableRecursoId && tareaData.responsableRecursoId !== editingTarea.responsableRecursoId) {
        // Asignar nuevo responsable recurso
        await proyectosService.asignarResponsableRecurso(editingTarea.idTarea, tareaData.responsableRecursoId);
      } else if (!tareaData.responsableRecursoId && editingTarea.responsableRecursoId) {
        // Remover responsable recurso si se deseleccionó
        await proyectosService.removerResponsableRecurso(editingTarea.idTarea);
      }
      
      // Recargar tareas para ver los cambios
      await loadTareas();
      setEditingTarea(null);
      setShowForm(false);
      
      console.log('Tarea actualizada exitosamente');
      
    } catch (err) {
      setError('Error al actualizar la tarea. ' + (err.message || ''));
      console.error('Error detallado:', err);
    }
  };

  const handleDeleteTarea = async () => {
    try {
      // Aquí implementarías la eliminación
      setTareas(prev => prev.filter(t => t.idTarea !== deletingTarea.idTarea));
      setDeletingTarea(null);
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error(err);
    }
  };

  const handleCambiarEstado = async (tareaId, nuevoEstado) => {
    try {
      if (nuevoEstado === 'EN_PROGRESO') {
        await proyectosService.iniciarTarea(tareaId);
      } else if (nuevoEstado === 'COMPLETADA') {
        await proyectosService.completarTarea(tareaId);
      }
      
      // Recargar tareas para ver el cambio
      await loadTareas();
    } catch (err) {
      setError('Error al cambiar el estado de la tarea');
      console.error(err);
    }
  };

  const openEditForm = (tarea) => {
    setEditingTarea(tarea);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingTarea(null);
    setShowForm(true);
    setError(null); // Limpiar errores al abrir formulario
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTarea(null);
    setError(null); // Limpiar errores al cerrar formulario
  };

  // Filtrar tareas según criterios
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtros.estado && tarea.estado !== filtros.estado) return false;
    if (filtros.prioridad && tarea.prioridad !== filtros.prioridad) return false;
    if (filtros.responsable && !tarea.responsable.toLowerCase().includes(filtros.responsable.toLowerCase())) return false;
    if (filtros.fase && !tarea.fases?.some(f => f.idFase.toString() === filtros.fase)) return false;
    return true;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'COMPLETADA': return 'text-green-600 bg-green-100';
      case 'EN_PROGRESO': return 'text-blue-600 bg-blue-100';
      case 'PENDIENTE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'ALTA': return 'text-red-600 bg-red-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAJA': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Proyecto no encontrado</h1>
          <Link href="/Proyecto" className="text-blue-600 hover:text-blue-800">
            ← Volver a Proyectos
          </Link>
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
          <Link href={`/Proyecto/${proyectoId}`} className="hover:text-blue-600">
            {proyecto.nombre}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Tareas</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Tareas
            </h1>
            <h2 className="text-xl text-gray-600 mb-4">{proyecto.nombre}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Líder: {proyecto.liderProyecto}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(proyecto.estado)}`}>
                {proyecto.estado}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/Proyecto/${proyectoId}/fases`}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              📋 Ver Fases
            </Link>
            <Link
              href={`/Proyecto/${proyectoId}`}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              ← Volver al Proyecto
            </Link>
            <button
              onClick={openCreateForm}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Nueva Tarea
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas de Tareas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Tareas</h3>
          <p className="text-3xl font-bold text-blue-600">{tareas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Completadas</h3>
          <p className="text-3xl font-bold text-green-600">
            {tareas.filter(t => t.estado === 'COMPLETADA').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">En Progreso</h3>
          <p className="text-3xl font-bold text-blue-600">
            {tareas.filter(t => t.estado === 'EN_PROGRESO').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {tareas.filter(t => t.estado === 'PENDIENTE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Multifase</h3>
          <p className="text-3xl font-bold text-purple-600">
            {tareas.filter(t => t.fases && t.fases.length > 1).length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosTareas
        filtros={filtros}
        setFiltros={setFiltros}
        fases={fases}
        tareas={tareas}
      />

      {/* Lista de Tareas */}
      {tareasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {tareas.length === 0 ? 'No hay tareas creadas' : 'No hay tareas que coincidan con los filtros'}
          </h3>
          <p className="text-gray-600 mb-4">
            {tareas.length === 0 ? 'Las tareas ayudan a organizar el trabajo específico' : 'Prueba ajustando los filtros de búsqueda'}
          </p>
          {tareas.length === 0 && (
            <button
              onClick={openCreateForm}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Crear Primera Tarea
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tareasFiltradas.map((tarea) => (
            <TareaCard
              key={tarea.idTarea}
              tarea={tarea}
              onEdit={openEditForm}
              onDelete={setDeletingTarea}
              onCambiarEstado={handleCambiarEstado}
              getEstadoColor={getEstadoColor}
              getPrioridadColor={getPrioridadColor}
              proyectoId={proyectoId}
            />
          ))}
        </div>
      )}

      {/* Información sobre tareas multifase */}
      {tareas.some(t => t.fases && t.fases.length > 1) && (
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">💡 Tareas Multifase</h3>
          <p className="text-purple-700 text-sm">
            Este proyecto tiene tareas que abarcan múltiples fases. Estas tareas aparecen en varias etapas del proyecto
            y ayudan a coordinar trabajo que se extiende a lo largo de diferentes fases.
          </p>
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingTarea ? 'Editar Tarea' : 'Nueva Tarea'}
              </h2>
              <TareaForm
                tarea={editingTarea}
                proyecto={proyecto}
                fases={fases}
                onSubmit={editingTarea ? handleUpdateTarea : handleCreateTarea}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deletingTarea && (
        <DeleteConfirm
          item={deletingTarea}
          itemName="tarea"
          onConfirm={handleDeleteTarea}
          onCancel={() => setDeletingTarea(null)}
        />
      )}
    </div>
  );
}
