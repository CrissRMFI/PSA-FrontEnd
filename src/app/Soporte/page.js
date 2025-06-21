"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SeleccionadorProducto from "@/components/Filtros/SeleccionadorProducto";
import SeleccionadorVersion from "@/components/Filtros/SeleccionadorVersion";
import TicketContainer from "@/components/Tickets/TicketContainer";
import BotonNuevoTicket from "@/components/Tickets/BotonNuevoTicket";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";

const STORAGE_KEY_PRODUCTO = "soporte_productoSeleccionado";
const STORAGE_KEY_VERSION = "soporte_versionSeleccionada";

export default function SoportePage() {
  const router = useRouter();

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [versionSeleccionada, setVersionSeleccionada] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actualizarTickets, setActualizarTickets] = useState(false);
  const [filtroNombreProducto, setFiltroNombreProducto] = useState("");

  useEffect(() => {
    const productoGuardado = localStorage.getItem(STORAGE_KEY_PRODUCTO);
    const versionGuardada = localStorage.getItem(STORAGE_KEY_VERSION);

    if (productoGuardado) setProductoSeleccionado(productoGuardado);
    if (versionGuardada) setVersionSeleccionada(versionGuardada);
  }, []);

  const manejarSeleccionProducto = (prod) => {
    setProductoSeleccionado(prod);
    setVersionSeleccionada("");
    localStorage.setItem(STORAGE_KEY_PRODUCTO, prod);
    localStorage.removeItem(STORAGE_KEY_VERSION);
  };

  const manejarSeleccionVersion = (version) => {
    setVersionSeleccionada(version);
    localStorage.setItem(STORAGE_KEY_VERSION, version);
  };

  const handleTicketCreado = () => {
    setActualizarTickets((prev) => !prev);
    setModalOpen(false);
  };

  return (
    <div className="p-10 mb-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl text-slate-500">Soporte / Productos</h2>
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Volver
        </button>
      </div>

      {/* Mostrar barra de búsqueda solo cuando no hay selección */}
      {!productoSeleccionado && !versionSeleccionada && (
        <div className="flex items-center justify-between mb-5 gap-4">
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            className="border border-gray-300 rounded px-4 py-2 h-10 w-96"
            value={filtroNombreProducto}
            onChange={(e) => setFiltroNombreProducto(e.target.value)}
          />

          <BotonNuevoTicket openModal={() => setModalOpen(true)} />
        </div>
      )}
     

      {modalOpen && (
        <ModalNuevoTicket
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onTicketCreado={handleTicketCreado}
        />
      )}

      <SeleccionadorProducto
        onSeleccionarProducto={manejarSeleccionProducto}
        productoSeleccionado={productoSeleccionado}
        filtroNombre={filtroNombreProducto} // Pasamos el filtro
      />

      {productoSeleccionado && (
        <SeleccionadorVersion
          producto={productoSeleccionado}
          versionSeleccionada={versionSeleccionada}
          onSeleccionarVersion={manejarSeleccionVersion}
        />
      )}

      {productoSeleccionado && versionSeleccionada && (
        <TicketContainer
          producto={productoSeleccionado}
          version={versionSeleccionada}
          key={`${productoSeleccionado}-${versionSeleccionada}-${actualizarTickets}`}
        />
      )}
    </div>
  );
}

