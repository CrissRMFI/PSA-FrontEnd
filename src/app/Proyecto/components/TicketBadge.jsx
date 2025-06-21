// components/TicketBadge.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ticketsService } from '../services/ticketsService';

export default function TicketBadge() {
  const [metricas, setMetricas] = useState({
    total: 0,
    pendientes: 0,
    asignados: 0,
    enProceso: 0,
    resueltos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarMetricas();
  }, []);

  const cargarMetricas = async () => {
    try {
      setError(null);
      const metricasData = await ticketsService.obtenerMetricas();
      setMetricas(metricasData);
    } catch (error) {
      console.error('Error al cargar métricas de tickets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <div className="text-center">
          <div className="text-4xl mb-3 text-red-600">🎫</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error en Tickets
          </h3>
          <p className="text-sm text-red-600 mb-3">
            No se pudieron cargar los tickets
          </p>
          <button 
            onClick={cargarMetricas}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/Proyecto/tickets"
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-orange-100 rounded-lg">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Gestión de Tickets</h3>
      <p className="text-gray-600 text-sm mb-3">Asigna tickets de soporte a tareas</p>
      
      {/* Métricas resumidas */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-50 rounded px-2 py-1">
          <span className="text-gray-500">Total:</span>
          <span className="font-bold text-blue-600 ml-1">{metricas.total}</span>
        </div>
        <div className="bg-gray-50 rounded px-2 py-1">
          <span className="text-gray-500">Pendientes:</span>
          <span className="font-bold text-yellow-600 ml-1">{metricas.pendientes}</span>
        </div>
      </div>
      
      <div className="text-orange-600 font-medium text-sm">
        {metricas.pendientes > 0 
          ? `${metricas.pendientes} tickets pendientes →`
          : 'Todos los tickets gestionados →'
        }
      </div>
      
      {/* Contador destacado si hay tickets pendientes */}
      {metricas.pendientes > 0 && (
        <div className="mt-3 inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 text-sm font-bold rounded-full border-2 border-red-200">
          {metricas.pendientes}
        </div>
      )}
    </Link>
  );
}
