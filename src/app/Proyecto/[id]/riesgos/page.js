'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { proyectosService } from '../../services/proyectosService';
import RiesgoCard from '../../components/RiesgoCard';
import RiesgoForm from '../../components/RiesgoForm';
import DeleteConfirm from '../../components/DeleteConfirm';

export default function RiesgosPage() {
  const params = useParams();
  const proyectoId = params.id;

  const [proyecto, setProyecto] = useState(null);
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRiesgo, setEditingRiesgo] = useState(null);
  const [deletingRiesgo, setDeletingRiesgo] = useState(null);
  const [vistaActual, setVistaActual] = useState('lista'); // Solo 'lista'

  useEffect(() => {
    if (proyectoId) {
      loadProyectoYRiesgos();
    }
  }, [proyectoId]);

  const loadProyectoYRiesgos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar proyecto
      const proyectoData = await proyectosService.getProyectoById(proyectoId);
      setProyecto(proyectoData);
      
      // Cargar riesgos del proyecto
      const riesgosData = await proyectosService.getRiesgosByProyecto(proyectoId);
      setRiesgos(riesgosData);
      
    } catch (err) {
      setError('Error al cargar el proyecto y sus riesgos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRiesgo = async (riesgoData) => {
    try {
      const newRiesgo = await proyectosService.createRiesgo(proyectoId, riesgoData);
      setRiesgos(prev => [...prev, newRiesgo]);
      setShowForm(false);
    } catch (err) {
      setError('Error al crear el riesgo');
      console.error(err);
    }
  };

  const handleUpdateRiesgo = async (riesgoData) => {
    try {
      // Usar la API real para actualizar el riesgo
      const updatedRiesgo = await proyectosService.updateRiesgo(editingRiesgo.idRiesgo, riesgoData);
      
      // Actualizar el estado local con el riesgo actualizado
      setRiesgos(prev => 
        prev.map(r => 
          r.idRiesgo === editingRiesgo.idRiesgo 
            ? updatedRiesgo 
            : r
        )
      );
      
      setEditingRiesgo(null);
      setShowForm(false);
    } catch (err) {
      setError('Error al actualizar el riesgo');
      console.error(err);
    }
  };

  const handleDeleteRiesgo = async () => {
    try {
      // Usar la API real para eliminar el riesgo
      await proyectosService.deleteRiesgo(deletingRiesgo.idRiesgo);
      
      // Actualizar el estado local removiendo el riesgo eliminado
      setRiesgos(prev => prev.filter(r => r.idRiesgo !== deletingRiesgo.idRiesgo));
      setDeletingRiesgo(null);
    } catch (err) {
      setError('Error al eliminar el riesgo');
      console.error(err);
    }
  };

  const handleCambiarEstado = async (riesgoId, nuevoEstado) => {
    try {
      // Usar la API real para cambiar el estado del riesgo
      const updatedRiesgo = await proyectosService.cambiarEstadoRiesgo(riesgoId, nuevoEstado);
      
      // Actualizar el estado local con el nuevo estado
      setRiesgos(prev => 
        prev.map(r => 
          r.idRiesgo === riesgoId 
            ? updatedRiesgo 
            : r
        )
      );
    } catch (err) {
      setError('Error al cambiar el estado del riesgo');
      console.error(err);
    }
  };

  const openEditForm = (riesgo) => {
    setEditingRiesgo(riesgo);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingRiesgo(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRiesgo(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'text-red-600 bg-red-100';
      case 'MITIGADO': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProbabilidadColor = (probabilidad) => {
    switch (probabilidad) {
      case 'ALTA': return 'text-red-600 bg-red-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAJA': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactoColor = (impacto) => {
    switch (impacto) {
      case 'ALTO': return 'text-red-600 bg-red-100';
      case 'MEDIO': return 'text-yellow-600 bg-yellow-100';
      case 'BAJO': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calcularPuntuacionRiesgo = (probabilidad, impacto) => {
    const scoreProbabilidad = { 'BAJA': 1, 'MEDIA': 2, 'ALTA': 3 }[probabilidad] || 0;
    const scoreImpacto = { 'BAJO': 1, 'MEDIO': 2, 'ALTO': 3 }[impacto] || 0;
    return scoreProbabilidad * scoreImpacto;
  };

  const getRiesgosCriticos = () => {
    return riesgos.filter(r => 
      r.estado === 'ACTIVO' && 
      calcularPuntuacionRiesgo(r.probabilidad, r.impacto) >= 6
    );
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

  const riesgosActivos = riesgos.filter(r => r.estado === 'ACTIVO');
  const riesgosMitigados = riesgos.filter(r => r.estado === 'MITIGADO');
  const riesgosCriticos = getRiesgosCriticos();

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
          <span className="text-gray-800">Riesgos</span>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Riesgos
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
              href={`/Proyecto/${proyectoId}/tareas`}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              ✅ Ver Tareas
            </Link>
            <Link
              href={`/Proyecto/${proyectoId}`}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              ← Volver al Proyecto
            </Link>
            <button
              onClick={openCreateForm}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              ⚠️ Nuevo Riesgo
            </button>
          </div>
        </div>
      </div>

      {/* Alertas de Riesgos Críticos */}
      {riesgosCriticos.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                ⚠️ Riesgos Críticos Detectados
              </h3>
              <p className="text-red-700">
                Hay {riesgosCriticos.length} riesgo{riesgosCriticos.length > 1 ? 's' : ''} de alta prioridad que requiere{riesgosCriticos.length === 1 ? '' : 'n'} atención inmediata.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas de Riesgos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Total Riesgos</h3>
          <p className="text-3xl font-bold text-gray-600">{riesgos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Activos</h3>
          <p className="text-3xl font-bold text-red-600">{riesgosActivos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Críticos</h3>
          <p className="text-3xl font-bold text-orange-600">{riesgosCriticos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800">Mitigados</h3>
          <p className="text-3xl font-bold text-green-600">{riesgosMitigados.length}</p>
        </div>
      </div>

      {/* Lista de Riesgos */}
      {riesgos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No hay riesgos documentados</h3>
          <p className="text-gray-600 mb-4">Documenta los riesgos que podrían afectar tu proyecto</p>
          <button
            onClick={openCreateForm}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Documentar Primer Riesgo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {riesgos
            .sort((a, b) => {
              // Ordenar por estado (activos primero) y luego por fecha
              if (a.estado !== b.estado) {
                return a.estado === 'ACTIVO' ? -1 : 1;
              }
              return new Date(b.fechaIdentificacion || 0) - new Date(a.fechaIdentificacion || 0);
            })
            .map((riesgo) => (
              <RiesgoCard
                key={riesgo.idRiesgo}
                riesgo={riesgo}
                onEdit={openEditForm}
                onDelete={setDeletingRiesgo}
                onCambiarEstado={handleCambiarEstado}
                getEstadoColor={getEstadoColor}
                getProbabilidadColor={getProbabilidadColor}
                getImpactoColor={getImpactoColor}
              />
            ))}
        </div>
      )}

      {/* Información sobre gestión de riesgos */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Gestión de Riesgos</h3>
        <div className="text-blue-700 text-sm space-y-2">
          <p>• <strong>Identifica</strong> riesgos potenciales que puedan afectar el proyecto</p>
          <p>• <strong>Evalúa</strong> la probabilidad e impacto de cada riesgo</p>
          <p>• <strong>Mitiga</strong> los riesgos críticos con planes de acción</p>
          <p>• <strong>Monitorea</strong> constantemente el estado de los riesgos</p>
        </div>
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingRiesgo ? 'Editar Riesgo' : 'Nuevo Riesgo'}
              </h2>
              <RiesgoForm
                riesgo={editingRiesgo}
                proyecto={proyecto}
                onSubmit={editingRiesgo ? handleUpdateRiesgo : handleCreateRiesgo}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deletingRiesgo && (
        <DeleteConfirm
          item={deletingRiesgo}
          itemName="riesgo"
          onConfirm={handleDeleteRiesgo}
          onCancel={() => setDeletingRiesgo(null)}
        />
      )}
    </div>
  );
}
