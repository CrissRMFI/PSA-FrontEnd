"use client";

import { useState, useEffect } from "react";
import SeleccionadorProducto from "@/components/Filtros/SeleccionadorProducto";
import SeleccionadorVersion from "@/components/Filtros/SeleccionadorVersion";
import TicketContainer from "@/components/Tickets/TicketContainer";
import BotonNuevoTicket from "@/components/Tickets/BotonNuevoTicket";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";

const STORAGE_KEY_PRODUCTO = "soporte_productoSeleccionado";
const STORAGE_KEY_VERSION = "soporte_versionSeleccionada";

export default function SoportePage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [versionSeleccionada, setVersionSeleccionada] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actualizarTickets, setActualizarTickets] = useState(false);

  // Al cargar la página, restaurar estado desde localStorage
  useEffect(() => {
    const productoGuardado = localStorage.getItem(STORAGE_KEY_PRODUCTO);
    const versionGuardada = localStorage.getItem(STORAGE_KEY_VERSION);

    if (productoGuardado) setProductoSeleccionado(productoGuardado);
    if (versionGuardada) setVersionSeleccionada(versionGuardada);
  }, []);

  // Guardar producto seleccionado en localStorage al cambiar
  const manejarSeleccionProducto = (prod) => {
    setProductoSeleccionado(prod);
    setVersionSeleccionada("");
    localStorage.setItem(STORAGE_KEY_PRODUCTO, prod);
    localStorage.removeItem(STORAGE_KEY_VERSION);
  };

  // Guardar versión seleccionada en localStorage al cambiar
  const manejarSeleccionVersion = (version) => {
    setVersionSeleccionada(version);
    localStorage.setItem(STORAGE_KEY_VERSION, version);
  };

  
  const handleTicketCreado = (ticketNuevo) => {
    setActualizarTickets((prev) => !prev);
    setModalOpen(false);
  };

  return (
    <div className="p-10 mb-20">
      <h2 className="text-4xl text-slate-500 mb-10">Soporte / Productos</h2>

      <div className="my-5">
        <BotonNuevoTicket openModal={() => setModalOpen(true)} />
      </div>

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
