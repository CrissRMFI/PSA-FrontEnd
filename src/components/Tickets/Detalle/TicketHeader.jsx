import ModalEditarTicket from "@/components/Tickets/EditarTicket/ModalEditarTicket";
import { useState } from "react";
import { updateTicket } from "@/api/tickets";

export default function TicketHeader({ ticket }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = async (data) => {
    const respuesta = await updateTicket(ticket.internalId, data);
    location.reload();
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {ticket.codigo} – {ticket.nombre}
      </h1>

      <div className="flex items-center gap-4 mt-6">
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
