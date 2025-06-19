'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { proyectosService } from '../../services/proyectosService';
import FaseCard from '../../components/FaseCard';
import FaseForm from '../../components/FaseForm';
import DeleteConfirm from '../../components/DeleteConfirm';

export default function FasesPage() {
  const params = useParams();
  const router = useRouter();
  const proyectoId = params.id;

  const [proyecto, setProyecto] = useState(null);
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFase, setEditingFase] = useState(null);
  const [deletingFase, setDeletingFase] = useState(null);

  // Cargar datos del proyecto y sus fases
  useEffect(() => {
    if (proyectoId) {
      loadProyectoYFases();
    }
  }, [proyectoId]);

  const loadProyectoYFases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar proyecto completo (incluye fases)
      const proyectoData = await proyectosService.getProyectoById(proyectoId);
      setProyecto(proyectoData);
      setFases(proyectoData.fases || []);
      
    } catch (err) {
      setError('Error al cargar el proyecto y sus fases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFase = async (faseData) => {
    try {
      const newFase = await proyectosService.createFase(proyectoId, faseData);
      setFases(prev => [...prev, newFase]);
      setShowForm(false);
    } catch (err) {
      setError('Error al crear la fase');
      console.error(err);
    }
  };

  const handleUpdateFase = async (faseData) => {
    try {
      // Aquí podrías agregar un endpoint de update en el backend
      // Por ahora recargamos todas las fases
      await loadProyectoYFases();
      setEditingFase(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar la fase');
      console.error(err);
    }
  };

  const handleDeleteFase = async () => {
    try {
      // Aquí podrías agregar un endpoint de delete en el backend
      // Por ahora simulamos la eliminación
      setFases(prev => prev.filter(f => f.idFase !== deletingFase.idFase));
      setDeletingFase(null);
    } catch (err) {
      setError('Error al eliminar la fase');
      console.error(err);
    }
  };

  const openEditForm = (fase) => {
    setEditingFase(fase);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingFase(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingFase(null);
  };

  const getEstadoColor = (estadoDescriptivo) => {
    switch (estadoDescriptivo) {
      case 'Completada': return 'text-green-600 bg-green-100';
      case 'En Progreso': return 'text-blue-600 bg-blue-100';
      case 'Pendiente': return 'text-yellow-600 bg-yellow-100';
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
          <span className="text-gray-800">Fases</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Fases del Proyecto
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
              href={`/Proyecto/${proyectoId}`}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              ← Volver al Proyecto
            </Link>
            <button
              onClick={openCreateForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Nueva Fase
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

      {/* Estadísticas de Fases */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Fases</h3>
          <p className="text-3xl font-bold text-blue-600">{fases.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Completadas</h3>
          <p className="text-3xl font-bold text-green-600">
            {fases.filter(f => f.estadoDescriptivo === 'Completada').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">En Progreso</h3>
          <p className="text-3xl font-bold text-blue-600">
            {fases.filter(f => f.estadoDescriptivo === 'En Progreso').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {fases.filter(f => f.estadoDescriptivo === 'Pendiente').length}
          </p>
        </div>
      </div>

      {/* Lista de Fases */}
      {fases.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No hay fases definidas</h3>
          <p className="text-gray-600 mb-4">Las fases ayudan a organizar el trabajo en etapas</p>
          <button
            onClick={openCreateForm}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Crear Primera Fase
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {fases
            .sort((a, b) => a.orden - b.orden)
            .map((fase, index) => (
              <FaseCard
                key={fase.idFase}
                fase={fase}
                index={index}
                onEdit={openEditForm}
                onDelete={setDeletingFase}
                getEstadoColor={getEstadoColor}
                proyectoId={proyectoId}
              />
            ))}
        </div>
      )}

      {/* Navegación a Tareas */}
      {fases.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href={`/Proyecto/${proyectoId}/tareas`}
            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Gestionar Tareas del Proyecto
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingFase ? 'Editar Fase' : 'Nueva Fase'}
              </h2>
              <FaseForm
                fase={editingFase}
                proyecto={proyecto}
                onSubmit={editingFase ? handleUpdateFase : handleCreateFase}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deletingFase && (
        <DeleteConfirm
          item={deletingFase}
          itemName="fase"
          onConfirm={handleDeleteFase}
          onCancel={() => setDeletingFase(null)}
        />
      )}
    </div>
  );
}
