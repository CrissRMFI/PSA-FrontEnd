"use client";

import { useState, useEffect } from "react";
import { Seleccionador } from "@/components/Filtros/Seleccionador";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";
import { getTickets, addTicket } from "@/api/tickets";

const SoportePage = () => {
  const [vista, setVista] = useState("tabla");
  const [modalOpen, setModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  const [filtros, setFiltros] = useState({
    producto: "",
    severidad: "",
    prioridad: "",
    estado: "",
    sla: "",
  });

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const ticketsFiltrados = tickets.filter((ticket) => {
    return (
      (filtros.producto === "" || ticket.producto === filtros.producto) &&
      (filtros.severidad === "" || ticket.severidad == filtros.severidad) &&
      (filtros.prioridad === "" || ticket.prioridad === filtros.prioridad) &&
      (filtros.estado === "" || ticket.estado === filtros.estado) &&
      (filtros.sla === "" || ticket.sla === filtros.sla)
    );
  });

  return (
    <div className="p-10">
      <h2 className="text-4xl text-slate-500">Soporte / Productos</h2>

      <div className="mt-10">
        <Seleccionador
          texto="Producto"
          vista={vista}
          onCambiarVista={setVista}
          onNuevoTicket={() => setModalOpen(true)}
          filtros={filtros}
          setFiltros={setFiltros}
        />

        {modalOpen && (
          <ModalNuevoTicket
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onCrearTicket={(nuevo) => {
              setTickets((prev) => [...prev, nuevo]);
              setModalOpen(false);
            }}
          />
        )}

        <div className="mt-8">
          {vista === "tabla" && <TablaTickets tickets={ticketsFiltrados} />}
          {vista === "kanban" && <KanbanVista tickets={ticketsFiltrados} />}
        </div>
      </div>
    </div>
  );
};

export default SoportePage;
