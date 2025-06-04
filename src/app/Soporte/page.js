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

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-4xl text-slate-500">Soporte / Productos</h2>

      <div className="mt-10">
        <Seleccionador
          texto="Seleccionar Producto"
          vista={vista}
          onCambiarVista={setVista}
          onNuevoTicket={() => setModalOpen(true)}
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
          {vista === "tabla" && <TablaTickets tickets={tickets} />}
          {vista === "kanban" && <KanbanVista tickets={tickets} />}
        </div>
      </div>
    </div>
  );
};

export default SoportePage;
