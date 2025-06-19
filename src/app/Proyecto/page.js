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

  // Cargar proyectos al inicializar
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
      const newProyecto = await proyectosService.createProyecto(proyectoData);
      setProyectos(prev => [...prev, newProyecto]);
      setShowForm(false);
    } catch (err) {
      setError('Error al crear el proyecto');
      console.error(err);
    }
  };

  const handleUpdateProyecto = async (proyectoData) => {
    try {
      const updatedProyecto = await proyectosService.updateProyecto(
        editingProyecto.idProyecto, 
        proyectoData
      );
      setProyectos(prev => 
        prev.map(p => p.idProyecto === editingProyecto.idProyecto ? updatedProyecto : p)
      );
      setEditingProyecto(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar el proyecto');
      console.error(err);
    }
  };

  const handleDeleteProyecto = async () => {
    try {
      await proyectosService.deleteProyecto(deletingProyecto.idProyecto);
      setProyectos(prev => 
        prev.filter(p => p.idProyecto !== deletingProyecto.idProyecto)
      );
      setDeletingProyecto(null);
    } catch (err) {
      setError('Error al eliminar el proyecto');
      console.error(err);
    }
  };

  const openEditForm = (proyecto) => {
    setEditingProyecto(proyecto);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingProyecto(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProyecto(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'text-green-600 bg-green-100';
      case 'PAUSADO': return 'text-yellow-600 bg-yellow-100';
      case 'CERRADO': return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proyectos</h1>
          <p className="text-gray-600 mt-2">
            Administra tus proyectos, fases y tareas desde un solo lugar
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + Nuevo Proyecto
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Proyectos</h3>
          <p className="text-3xl font-bold text-blue-600">{proyectos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Activos</h3>
          <p className="text-3xl font-bold text-green-600">
            {proyectos.filter(p => p.estado === 'ACTIVO').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Pausados</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {proyectos.filter(p => p.estado === 'PAUSADO').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Cerrados</h3>
          <p className="text-3xl font-bold text-gray-600">
            {proyectos.filter(p => p.estado === 'CERRADO').length}
          </p>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {proyectos.length === 0 ? (
        <div className="text-center py-12">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map(proyecto => (
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

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>
              <ProyectoForm
                proyecto={editingProyecto}
                onSubmit={editingProyecto ? handleUpdateProyecto : handleCreateProyecto}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
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
