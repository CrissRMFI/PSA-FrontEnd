'use client';
import ProyectoDetalle from '../components/ProyectoDetalle';
import TestConnection from '../components/TestConnection'; // ✨ AGREGAR ESTA LÍNEA
import { useRouter } from 'next/navigation';

export default function ProyectoDetallePage({ params }) {
  const router = useRouter();
  
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
  
  // ✨ AGREGAR ESTE HANDLER
  const handleGestionarFases = (proyecto) => {
    console.log('Navegando a fases para proyecto:', proyecto.idProyecto);
    router.push(`/Proyecto/${proyecto.idProyecto}/fases`);
  };
  
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
        proyectoId={params.id}
        onVolver={handleVolver}
        onEditar={handleEditar}
        onGestionarTareas={handleGestionarTareas}
        onGestionarFases={handleGestionarFases} // ✨ AGREGAR ESTE PROP
      />
    </div>
  );
}
