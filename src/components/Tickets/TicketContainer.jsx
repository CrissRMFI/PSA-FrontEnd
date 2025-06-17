"use client";

import { useEffect, useState } from "react";
import useTickets from "@/hooks/useTickets";
import { getTickets } from "@/api/tickets";
import Filtros from "@/components/Filtros/Filtros";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import BotonNuevoTicket from "./BotonNuevoTicket";
import VistaSelector from "./VistaSelector";

export default function TicketContainer({ producto, version }) {
  const { tickets, setTickets, loading } = useTickets();
  const [vista, setVista] = useState("tabla");
  const [modalOpen, setModalOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    severidad: "",
    prioridad: "",
    estado: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getTickets();
      console.log("Tickets obtenidos:", data);
      setTickets(data);
    };
    fetchTickets();
  }, []);

  const ticketsFiltrados = tickets.filter((ticket) => {
    return (
      ticket.idProducto === producto &&
      ticket.version === version &&
      (filtros.severidad === "" || ticket.severidad === filtros.severidad) &&
      (filtros.prioridad === "" || ticket.prioridad === filtros.prioridad) &&
      (filtros.estado === "" || ticket.estado === filtros.estado)
    );
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-6 mb-4">
        <BotonNuevoTicket openModal={() => setModalOpen(true)} />
        <Filtros filtros={filtros} setFiltros={setFiltros} />
        <VistaSelector vista={vista} setVista={setVista} />
      </div>

      {modalOpen && (
        <ModalNuevoTicket
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productoSeleccionado={producto}
        />
      )}

      {vista === "tabla" ? (
        <TablaTickets tickets={ticketsFiltrados} />
      ) : (
        <KanbanVista tickets={ticketsFiltrados} />
      )}
    </>
  );
}
