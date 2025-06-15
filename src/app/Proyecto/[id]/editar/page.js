'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProyectoForm from '../../components/ProyectoForm';

// Mock data del proyecto - después esto viene del backend
const mockProyectoData = {
  idProyecto: 1,
  nombre: "Implementación SAP ERP",
  descripcion: "Migración completa del sistema legacy a SAP ERP 7.51 para optimizar procesos de negocio y mejorar la eficiencia operacional",
  estado: "ACTIVO",
  liderProyecto: 1,
  clienteId: 1,
  fechaInicio: "2024-01-15",
  fechaFinEstimada: "2024-06-30",
  fechaFinReal: null,
  presupuesto: 500000,
  moneda: "USD",
  productos: ["SAP ERP 7.51", "SAP Fiori"],
  recursosAsignados: [1, 2, 3, 4],
  riesgos: [
    {
      id: 1,
      descripcion: "Retraso en migración de datos",
      impacto: "ALTO",
      probabilidad: "MEDIA"
    }
  ],
  notas: "Proyecto crítico para la modernización tecnológica de la empresa. Requiere coordinación estrecha con el equipo de IT del cliente."
};

export default function EditarProyectoPage({ params }) {
  const router = useRouter();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProyecto();
  }, [params.id]);

  const cargarProyecto = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar que el proyecto existe
      if (params.id != "1") {
        throw new Error('Proyecto no encontrado');
      }
      
      setProyecto(mockProyectoData);
    } catch (err) {
      console.error('Error cargando proyecto:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (datosProyecto) => {
    try {
      // Simular guardado en backend
      console.log('Actualizando proyecto:', datosProyecto);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría la llamada real al backend
      // const response = await fetch(`/api/proyectos/${params.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(datosProyecto)
      // });
      
      // if (!response.ok) throw new Error('Error al actualizar proyecto');
      
      // Mostrar mensaje de éxito (puedes usar una librería de notificaciones)
      alert('Proyecto actualizado exitosamente');
      
      // Redirigir al detalle del proyecto
      router.push(`/Proyecto/${params.id}`);
      
    } catch (error) {
      console.error('Error guardando proyecto:', error);
      alert('Error al guardar el proyecto. Intenta nuevamente.');
    }
  };

  const handleCancelar = () => {
    if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
      router.push(`/Proyecto/${params.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del proyecto...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el proyecto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={cargarProyecto}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => router.push('/Proyecto')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Proyecto no encontrado
  if (!proyecto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
          <p className="text-gray-600 mb-4">El proyecto solicitado no existe o no tienes permisos para editarlo</p>
          <button
            onClick={() => router.push('/Proyecto')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push(`/Proyecto/${params.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Proyecto</h1>
              <p className="text-gray-600 mt-1">Modifica la información del proyecto "{proyecto.nombre}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ProyectoForm
          proyecto={proyecto}
          modo="editar"
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      </div>
    </div>
  );
}
