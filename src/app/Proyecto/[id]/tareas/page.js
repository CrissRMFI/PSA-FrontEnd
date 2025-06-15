'use client';
import TareasManager from '../../components/TareasManager';
import { useRouter } from 'next/navigation';

export default function TareasPage({ params, searchParams }) {
  const router = useRouter();
  
  const handleVolver = () => {
    router.push(`/Proyecto/${params.id}`);
  };
  
  return (
    <TareasManager 
      proyectoId={params.id}
      faseIdSeleccionada={searchParams?.fase ? parseInt(searchParams.fase) : null}
      onVolver={handleVolver}
    />
  );
}
