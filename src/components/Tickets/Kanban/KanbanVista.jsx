import ColumnaKanban from "./ColumnaKanban";
import { useState, useEffect, use } from "react";
import { getMetadatos } from "@/api/tickets";

export default function KanbanVista({ tickets }) {
  console.log(tickets);
  const [metadatos, setMetadatos] = useState({
    estados: [],
    prioridades: [],
    severidades: [],
  });

  useEffect(() => {
    async function fetchMetadatos() {
      const data = await getMetadatos();
      setMetadatos(data);
    }
    fetchMetadatos();
  }, []);

  const ticketsPorEstado = metadatos.estados.map((estado) => ({
    estado: estado.label,
    tickets: tickets.filter(
      (t) => t.estadoLabel.toLowerCase() === estado.label.toLowerCase()
    ),
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
