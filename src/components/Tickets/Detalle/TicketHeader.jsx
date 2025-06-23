"use client";

import ModalEditarTicket from "@/components/Tickets/EditarTicket/ModalEditarTicket";
import { useState } from "react";
import { updateTicket, cancelarTicket } from "@/api/tickets";
import Link from "next/link";


export default function TicketHeader({ ticket }) {
  
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = async (data) => {
    await updateTicket(ticket.internalId, data);
    location.reload();
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que querés eliminar este ticket?");
    if (confirmacion) {
      await cancelarTicket(ticket.internalId);
      window.location.reload()
    }
  };
  


  return (
    <div className="mt-6 space-y-4">
   

      <h1 className="text-2xl font-bold text-gray-800">{ticket.nombre}</h1>

      <div className="flex justify-between items-center flex-wrap mt-4">
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            Editar
          </button>

        
          <Link href={"/Proyecto/tickets"}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors " disabled={ ticket.estadoLabel === "CANCELADO"}>
             + Crear Tarea
            </button>
          </Link>
        </div>

        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium "
          onClick={handleDelete}
        >
          Cancelar
        </button>
      </div>

      {modalOpen && (
        <ModalEditarTicket
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          ticket={ticket}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
