"use client";
import Estado from "../Estado";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TicketTareas({ tareas }) {
  
  const [paginaActual, setPaginaActual] = useState(1);
  const tareasPorPagina = 2;

  const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);

  const indiceInicio = (paginaActual - 1) * tareasPorPagina;
  const indiceFin = indiceInicio + tareasPorPagina;

  const tareasActuales = tareas.slice(indiceInicio, indiceFin);

  const irAPaginaAnterior = () => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  };

  const irAPaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  };

  const irAPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="rounded-md p-4 shadow-2xl bg-white text-md hover:shadow-cyan-950">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700 text-lg">Tareas asociadas</h3>
        {tareas.length > 0 && (
          <span className="text-sm text-gray-500">
            {tareas.length} tarea{tareas.length !== 1 ? 's' : ''} total{tareas.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {tareas.length === 0 ? (
        <p className="text-gray-500 italic">Aún no se definieron tareas.</p>
      ) : (
        <>
          
          <div className="mb-6 h-[280px] flex flex-col justify-start">
            <div className="space-y-4">
              {tareasActuales.map((tarea, idx) => (
                <div
                  key={tarea.id || idx}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-blue-800">{tarea.tareaTitulo}</h4>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${tarea.tareaPrioridad === 'Alta'
                          ? 'bg-red-100 text-red-700'
                          : tarea.tareaPrioridad === 'Media'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                    >
                      Prioridad: {tarea.tareaPrioridad} 
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm">{tarea.tareaDescripcion}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <div>
                      <strong>Estado:</strong> <Estado estado={tarea.tareaEstado.toUpperCase()} />
                    </div>
                    <div>
                      <strong>Responsable:</strong> {tarea.tareaResponsable}
                    </div>
                    {tarea.nombreProyecto && ( 
                      <div>
                        <strong>Proyecto:</strong> {tarea.proyectoNombre}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPaginas > 0 && (
            <div className="flex flex-col items-center justify-en mt-4 space-y-2">
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={irAPaginaAnterior}
                  disabled={paginaActual === 1}
                  className={`flex items-center px-3 py-1 rounded-md text-sm transition ${paginaActual === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
                    <button
                      key={numeroPagina}
                      onClick={() => irAPagina(numeroPagina)}
                      className={`px-3 py-1 rounded-md text-sm transition ${paginaActual === numeroPagina
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {numeroPagina}
                    </button>
                  ))}
                </div>

                <button
                  onClick={irAPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className={`flex items-center px-3 py-1 rounded-md text-sm transition ${paginaActual === totalPaginas
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
