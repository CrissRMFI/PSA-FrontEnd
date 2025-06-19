'use client';

import { useState, useEffect } from 'react';
import { proyectosService } from './services/proyectosService';
import ProyectoForm from './components/ProyectoForm';
import ProyectoCard from './components/ProyectoCard';
import DeleteConfirm from './components/DeleteConfirm';

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [deletingProyecto, setDeletingProyecto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proyectosService.getAllProyectos();
      setProyectos(data);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProyecto = async (proyectoData) => {
    try {
      let newProyecto;
      if (proyectoData.liderRecursoId) {
        newProyecto = await proyectosService.createProyectoConRecurso(proyectoData);
      } else {
        newProyecto = await proyectosService.createProyecto(proyectoData);
      }
      setProyectos(prev => [...prev, newProyecto]);
      setShowForm(false);
      console.log('Proyecto creado exitosamente:', newProyecto);
    } catch (err) {
      setError('Error al crear el proyecto. ' + (err.message || ''));
      console.error('Error detallado:', err);
    }
  };

  const handleUpdateProyecto = async (proyectoData) => {
    try {
      let updatedProyecto;
      if (proyectoData.liderRecursoId && proyectoData.liderRecursoId !== editingProyecto.liderRecursoId) {
        updatedProyecto = await proyectosService.asignarLiderRecurso(
          editingProyecto.idProyecto,
          proyectoData.liderRecursoId
        );
      } else if (!proyectoData.liderRecursoId && editingProyecto.liderRecursoId) {
        updatedProyecto = await proyectosService.removerLiderRecurso(editingProyecto.idProyecto);
      } else {
        updatedProyecto = await proyectosService.updateProyecto(
          editingProyecto.idProyecto,
          proyectoData
        );
      }
      setProyectos(prev =>
        prev.map(p => p.idProyecto === editingProyecto.idProyecto ? updatedProyecto : p)
      );
      setEditingProyecto(null);
      setShowForm(false);
      console.log('Proyecto actualizado exitosamente:', updatedProyecto);
    } catch (err) {
      setError('Error al actualizar el proyecto. ' + (err.message || ''));
      console.error('Error detallado:', err);
    }
  };

  const handleDeleteProyecto = async () => {
    try {
      await proyectosService.deleteProyecto(deletingProyecto.idProyecto);
      setProyectos(prev =>
        prev.filter(p => p.idProyecto !== deletingProyecto.idProyecto)
      );
      setDeletingProyecto(null);
      console.log('Proyecto eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar el proyecto. ' + (err.message || ''));
      console.error('Error detallado:', err);
    }
  };

  const openEditForm = (proyecto) => {
    setEditingProyecto(proyecto);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingProyecto(null);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProyecto(null);
    setError(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'text-green-600 bg-green-100';
      case 'PAUSADO': return 'text-yellow-600 bg-yellow-100';
      case 'CERRADO': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const proyectosFiltrados = proyectos.filter(proyecto => {
    const searchLower = searchTerm.toLowerCase();
    return (
      proyecto.nombre.toLowerCase().includes(searchLower) ||
      proyecto.descripcion?.toLowerCase().includes(searchLower) ||
      proyecto.liderProyecto?.toLowerCase().includes(searchLower)
    );
  });

  const getEstadisticas = () => {
    const total = proyectos.length;
    const activos = proyectos.filter(p => p.estado === 'ACTIVO').length;
    const pausados = proyectos.filter(p => p.estado === 'PAUSADO').length;
    const cerrados = proyectos.filter(p => p.estado === 'CERRADO').length;
    return { total, activos, pausados, cerrados };
  };

  const estadisticas = getEstadisticas();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proyectos</h1>
          <p className="text-gray-600 mt-2">Administra tus proyectos, fases y tareas desde un solo lugar</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proyecto
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar proyectos por nombre, descripción o líder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {proyectosFiltrados.length} de {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Proyectos</h3>
          <p className="text-3xl font-bold text-blue-600">{estadisticas.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Activos</h3>
          <p className="text-3xl font-bold text-green-600">{estadisticas.activos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Pausados</h3>
          <p className="text-3xl font-bold text-yellow-600">{estadisticas.pausados}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Cerrados</h3>
          <p className="text-3xl font-bold text-gray-600">{estadisticas.cerrados}</p>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {proyectosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron proyectos</h3>
              <p className="text-gray-600 mb-4">No hay proyectos que coincidan con "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay proyectos</h3>
              <p className="text-gray-600 mb-4">Comienza creando tu primer proyecto</p>
              <button
                onClick={openCreateForm}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear Primer Proyecto
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosFiltrados.map(proyecto => (
            <ProyectoCard
              key={proyecto.idProyecto}
              proyecto={proyecto}
              onEdit={openEditForm}
              onDelete={setDeletingProyecto}
              getEstadoColor={getEstadoColor}
            />
          ))}
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ProyectoForm
                proyecto={editingProyecto}
                onSubmit={editingProyecto ? handleUpdateProyecto : handleCreateProyecto}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {deletingProyecto && (
        <DeleteConfirm
          item={deletingProyecto}
          itemName="proyecto"
          onConfirm={handleDeleteProyecto}
          onCancel={() => setDeletingProyecto(null)}
        />
      )}
    </div>
  );
}
