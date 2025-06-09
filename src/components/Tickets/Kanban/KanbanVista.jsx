import ColumnaKanban from "./ColumnaKanban";
import { opciones } from "@/api/mock/opcionesSelect";

export default function KanbanVista({ tickets }) {
  const ticketsPorEstado = opciones.estado.map((estado) => ({
    estado,
    tickets: tickets.filter((t) => t.estado === estado),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {ticketsPorEstado.map(({ estado, tickets }) => (
        <div
          key={estado}
          className="min-w-[370px] flex-shrink-0 bg-slate-50 rounded-lg shadow p-2"
        >
          <ColumnaKanban estado={estado} tickets={tickets} />
        </div>
      ))}
    </div>
  );
}
