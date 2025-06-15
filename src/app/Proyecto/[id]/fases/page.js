'use client';
import FasesPanel from '../../components/FasesPanel';
import { useRouter } from 'next/navigation';

export default function FasesPage({ params }) {
  const router = useRouter();
  
  const handleVolver = () => {
    router.push(`/Proyecto/${params.id}`);
  };
  
  return (
    <FasesPanel 
      proyectoId={params.id}
      onVolver={handleVolver}
    />
  );
}
