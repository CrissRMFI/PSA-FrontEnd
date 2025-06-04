import tickets from "@/components/Tickets/datos";
import ColumnaKanban from "./ColumnaKanban";

const ESTADOS = ["Nuevo", "En Progreso", "Escalado", "Resuelto", "Cerrado"];

export default function KanbanVista() {
  const ticketsPorEstado = ESTADOS.map((estado) => ({
    estado,
    tickets: tickets.filter((t) => t.estado === estado),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto p-4 justify-evenly">
      {ticketsPorEstado.map(({ estado, tickets }) => (
        <ColumnaKanban key={estado} estado={estado} tickets={tickets} />
      ))}
    </div>
  );
}
