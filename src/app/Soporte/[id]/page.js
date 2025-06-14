"use client";
import { getTickets } from "@/api/tickets";
import TicketDescripcion from "@/components/Tickets/Detalle/TicketDescripcion";
import TicketHeader from "@/components/Tickets/Detalle/TicketHeader";
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

        <div className="flex-grow h-[2px] bg-gray-200"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketTareas tareas={[]} />
        </div>
      </div>
    </div>
  );
};

export default VistaTicket;
