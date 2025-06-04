"use client";

import { useState } from "react";
import { Seleccionador } from "@/components/Filtros/Seleccionador";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import ModalNuevoTicket from "@/components/Tickets/ModalNuevoTicket/ModalNuevoTicket";

const SoportePage = () => {
  const [vista, setVista] = useState("tabla");
  const [modalOpen, setModalOpen] = useState(false);

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
          />
        )}

        <div className="mt-8">
          {vista === "tabla" && <TablaTickets />}
          {vista === "kanban" && <KanbanVista />}
        </div>
      </div>
    </div>
  );
};

export default SoportePage;
