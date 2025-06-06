"use client";
import { getTickets } from "@/api/tickets";
import TicketDescripcion from "@/components/Tickets/Detalle/TicketDescripcion";
import TicketHeader from "@/components/Tickets/Detalle/TicketHeader";
import TicketHistorial from "@/components/Tickets/Detalle/TicketHistorial";
import TicketInfo from "@/components/Tickets/Detalle/TicketInfo";
import TicketTareas from "@/components/Tickets/Detalle/TicketTareas";
import { useParams } from "next/navigation";

const VistaTicket = () => {
  const { id } = useParams();

  const tickets = getTickets();
  const ticket = tickets.find((t) => t.id === id);
  return (
    <div className="p-10">
      <h2 className="text-4xl text-slate-500">{`Soporte / Producto / ${ticket.producto}`}</h2>
      <div className="w-[90%] mx-auto space-y-8">
        <TicketHeader id={id} nombre={ticket.nombre} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketInfo ticket={ticket} />
          <TicketDescripcion descripcion={ticket.descripcion} />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700">
            Editar
          </button>
          <button className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
            Escalar
          </button>
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketTareas tareas={[]} />
          <TicketHistorial acciones={ticket.historial || []} />
        </div>
      </div>
    </div>
  );
};

export default VistaTicket;
