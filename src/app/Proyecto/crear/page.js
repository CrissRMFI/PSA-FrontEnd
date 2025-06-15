"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProyectoForm from '../components/ProyectoForm';

export default function CrearProyectoPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/Proyecto');
  };

  const handleSave = (proyectoData) => {
    console.log('Nuevo proyecto:', proyectoData);
    // Aquí irá la llamada al backend
    router.push('/Proyecto');
  };

  return (
    <ProyectoForm 
      onCancel={handleCancel}
      onSave={handleSave}
    />
  );
}
