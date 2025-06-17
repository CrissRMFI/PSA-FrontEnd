"use client";

import { useState } from "react";
import SeleccionadorProducto from "@/components/Filtros/SeleccionadorProducto";
import SeleccionadorVersion from "@/components/Filtros/SeleccionadorVersion";
import TicketContainer from "@/components/Tickets/TicketContainer";
import BotonNuevoTicket from "@/components/Tickets/BotonNuevoTicket";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";

export default function SoportePage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  const [versionSeleccionada, setVersionSeleccionada] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

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
        />
      )}

      <SeleccionadorProducto
        onSeleccionarProducto={(prod) => {
          setProductoSeleccionado(prod);
          setVersionSeleccionada("");
        }}
        productoSeleccionado={productoSeleccionado}
      />

      {productoSeleccionado && (
        <SeleccionadorVersion
          producto={productoSeleccionado}
          versionSeleccionada={versionSeleccionada}
          onSeleccionarVersion={setVersionSeleccionada}
        />
      )}

      {productoSeleccionado && versionSeleccionada && (
        <TicketContainer
          producto={productoSeleccionado}
          version={versionSeleccionada}
        />
      )}
    </div>
  );
}
