"use client";

import { useState, useEffect } from "react";
import SeleccionadorProducto from "@/components/Filtros/SeleccionadorProducto";
import SeleccionadorVersion from "@/components/Filtros/SeleccionadorVersion";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";
import { getTickets } from "@/api/tickets";
import Filtros from "@/components/Filtros/Filtros";
import useTickets from "@/hooks/useTickets";

export default function SoportePage() {
  const { tickets, setTickets, loading } = useTickets();
  const [vista, setVista] = useState("tabla");
  const [modalOpen, setModalOpen] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [versionSeleccionada, setVersionSeleccionada] = useState("");

  const [filtros, setFiltros] = useState({
    severidad: "",
    prioridad: "",
    estado: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getTickets();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  const ticketsFiltrados = tickets.filter((ticket) => {
    console.log(ticket);
    return (
      ticket.producto === productoSeleccionado &&
      ticket.version === versionSeleccionada &&
      (filtros.severidad === "" || ticket.severidad == filtros.severidad) &&
      (filtros.prioridad === "" || ticket.prioridad === filtros.prioridad) &&
      (filtros.estado === "" || ticket.estado === filtros.estado) &&
      (filtros.sla === "" || ticket.sla === filtros.sla)
    );
  });

  return (
    <div className="p-10">
      <h2 className="text-4xl text-slate-500 mb-10">Soporte / Productos</h2>

      {loading && <p className="text-slate-400">Cargando tickets...</p>}

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
        <>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-6 mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-md px-5 py-1 rounded"
              onClick={() => setModalOpen(true)}
            >
              + Nuevo Ticket
            </button>

            <Filtros filtros={filtros} setFiltros={setFiltros} />

            <button
              className="bg-emerald-700 border-none px-5 py-1 rounded text-md font-bold text-white"
              onClick={() =>
                setVista((prev) => (prev === "tabla" ? "kanban" : "tabla"))
              }
            >
              {vista === "tabla" ? "Vista Kanban" : "Vista Tabla"}
            </button>
          </div>

          {modalOpen && (
            <ModalNuevoTicket
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onCrearTicket={(nuevo) => {
                setTickets((prev) => [...prev, nuevo]);
                setModalOpen(false);
              }}
              productoSeleccionado={productoSeleccionado}
            />
          )}

          {vista === "tabla" && <TablaTickets tickets={ticketsFiltrados} />}
          {vista === "kanban" && <KanbanVista tickets={ticketsFiltrados} />}
        </>
      )}
    </div>
  );
}
