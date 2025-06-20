'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { proyectosService } from '../services/proyectosService';

export default function ProyectoDetailPage() {
  const params = useParams();
  const proyectoId = params.id;

  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (proyectoId) {
      loadProyecto();
    }
  }, [proyectoId]);

  const loadProyecto = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proyectosService.getProyectoById(proyectoId);
      setProyecto(data);
    } catch (err) {
      setError('Error al cargar el proyecto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'text-green-600 bg-green-100';
      case 'PAUSADO': return 'text-yellow-600 bg-yellow-100';
      case 'CERRADO': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const calculateProgress = () => {
    if (!proyecto?.fases || proyecto.fases.length === 0) return 0;
    
    const completadas = proyecto.fases.filter(f => f.estadoDescriptivo === 'Completada').length;
    return Math.round((completadas / proyecto.fases.length) * 100);
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

  const progress = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/Proyecto" className="hover:text-blue-600">
            Proyectos
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{proyecto.nombre}</span>
        </div>
      </nav>

      {/* Header del Proyecto */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{proyecto.nombre}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(proyecto.estado)}`}>
                {proyecto.estado}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mb-4">{proyecto.descripcion}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>🧑‍💼 Líder: <span className="font-medium text-gray-700">{proyecto.liderProyecto}</span></span>
              <span>🆔 ID: {proyecto.idProyecto}</span>
            </div>
          </div>

          <Link
            href="/Proyecto"
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            ← Volver a Proyectos
          </Link>
        </div>

        {/* Progreso General */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso General</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Fechas del Proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-gray-500 text-sm">Fecha de Inicio</span>
            <p className="font-semibold text-gray-800">{formatDate(proyecto.fechaInicio)}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Fecha de Fin Estimada</span>
            <p className="font-semibold text-gray-800">{formatDate(proyecto.fechaFinEstimada)}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Fecha de Fin Real</span>
            <p className="font-semibold text-gray-800">{formatDate(proyecto.fechaFinReal) || 'En progreso'}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas del Proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{proyecto.fases?.length || 0}</div>
          <div className="text-gray-600">Fases Totales</div>
          <div className="text-xs text-gray-500 mt-1">
            {proyecto.fases?.filter(f => f.estadoDescriptivo === 'Completada').length || 0} completadas
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{proyecto.totalTareas || 0}</div>
          <div className="text-gray-600">Tareas Totales</div>
          <div className="text-xs text-gray-500 mt-1">En todas las fases</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{proyecto.riesgosActivos || 0}</div>
          <div className="text-gray-600">Riesgos Activos</div>
          <div className="text-xs text-gray-500 mt-1">Requieren atención</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{progress}%</div>
          <div className="text-gray-600">Completado</div>
          <div className="text-xs text-gray-500 mt-1">Progreso estimado</div>
        </div>
      </div>

      {/* Acciones Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Gestión de Fases */}
        <Link
          href={`/Proyecto/${proyectoId}/fases`}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gestionar Fases</h3>
          <p className="text-gray-600 text-sm mb-3">Organiza el trabajo en etapas secuenciales</p>
          <div className="text-blue-600 font-medium text-sm">
            {proyecto.fases?.length || 0} fases creadas →
          </div>
        </Link>

        {/* Gestión de Tareas */}
        <Link
          href={`/Proyecto/${proyectoId}/tareas`}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gestionar Tareas</h3>
          <p className="text-gray-600 text-sm mb-3">Administra las tareas y su progreso</p>
          <div className="text-green-600 font-medium text-sm">
            {proyecto.totalTareas || 0} tareas totales →
          </div>
        </Link>

        {/* Gestión de Riesgos */}
        <Link
          href={`/Proyecto/${proyectoId}/riesgos`}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Gestionar Riesgos</h3>
          <p className="text-gray-600 text-sm mb-3">Identifica y mitiga riesgos del proyecto</p>
          <div className="text-red-600 font-medium text-sm">
            {proyecto.riesgosActivos || 0} riesgos activos →
          </div>
        </Link>
      </div>

      {/* Resumen de Fases */}
      {proyecto.fases && proyecto.fases.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Fases</h2>
          <div className="space-y-3">
            {proyecto.fases
              .sort((a, b) => a.orden - b.orden)
              .map((fase, index) => (
                <div key={fase.idFase} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {/* ✅ CAMBIO: Usar index + 1 para mostrar numeración visual continua */}
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full font-bold text-xs">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{fase.nombre}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      fase.estadoDescriptivo === 'Completada' ? 'bg-green-100 text-green-600' :
                      fase.estadoDescriptivo === 'En Progreso' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {fase.estadoDescriptivo}
                    </span>
                  </div>
                  <Link
                    href={`/Proyecto/${proyectoId}/fases`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver detalles →
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
