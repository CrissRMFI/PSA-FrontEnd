"use client";

import ModalEditarTicket from "@/components/Tickets/EditarTicket/ModalEditarTicket";
import { useState } from "react";
import { updateTicket, deleteTicket } from "@/api/tickets";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TicketHeader({ ticket }) {
  
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = async (data) => {
    await updateTicket(ticket.internalId, data);
    location.reload();
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que querés eliminar este ticket?");
    if (confirmacion) {
      await deleteTicket(ticket.internalId);
      window.history.back();  
    }
  };
  


  return (
    <div className="mt-6 space-y-4">
   

      <h1 className="text-2xl font-bold text-gray-800">{ticket.nombre}</h1>

      <div className="flex justify-between items-center flex-wrap mt-4">
        <div className="flex gap-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
            onClick={() => setModalOpen(true)}
          >
            Editar
          </button>

          <button className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
            Crear Tarea
          </button>
        </div>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          onClick={handleDelete}
        >
          Eliminar
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
