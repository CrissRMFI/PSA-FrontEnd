'use client';
import ProyectoDetalle from '../components/ProyectoDetalle';
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
    <ProyectoDetalle 
      proyectoId={params.id}
      onVolver={handleVolver}
      onEditar={handleEditar}
      onGestionarTareas={handleGestionarTareas}
      onGestionarFases={handleGestionarFases} // ✨ AGREGAR ESTE PROP
    />
  );
}
