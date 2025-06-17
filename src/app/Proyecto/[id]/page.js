'use client';
import { useState, useEffect } from 'react';
import ProyectoDetalle from '../components/ProyectoDetalle';
import TestConnection from '../components/TestConnection';
import { useRouter } from 'next/navigation';

export default function ProyectoDetallePage({ params }) {
  const router = useRouter();
  const [proyectoId, setProyectoId] = useState(null);

  // ✅ Resolver params de forma asíncrona en useEffect
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setProyectoId(resolvedParams.id);
    };
    
    resolveParams();
  }, [params]);

  const handleVolver = () => {
    router.push('/Proyecto');
  };

  const handleEditar = (proyecto) => {
    router.push(`/Proyecto/${proyecto.idProyecto}/editar`);
  };

  const handleGestionarTareas = (proyecto, fase = null) => {
    const url = fase
      ? `/Proyecto/${proyecto.idProyecto}/tareas?fase=${fase.id}`
      : `/Proyecto/${proyecto.idProyecto}/tareas`;
    router.push(url);
  };

  const handleGestionarFases = (proyecto) => {
    console.log('Navegando a fases para proyecto:', proyecto.idProyecto);
    router.push(`/Proyecto/${proyecto.idProyecto}/fases`);
  };

  // ✅ Mostrar loading mientras se resuelve el parámetro
  if (!proyectoId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ✨ COMPONENTE DE PRUEBA TEMPORAL - Remover después */}
      <div style={{
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#f0f8ff',
        border: '2px dashed #007bff',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#007bff' }}>
          🧪 Componente de Prueba (Temporal)
        </h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
          Este componente se puede remover una vez que confirmes que la conexión funciona
        </p>
        <TestConnection />
      </div>

      {/* Tu componente original */}
      <ProyectoDetalle
        proyectoId={proyectoId}
        onVolver={handleVolver}
        onEditar={handleEditar}
        onGestionarTareas={handleGestionarTareas}
        onGestionarFases={handleGestionarFases}
      />
    </div>
  );
}
