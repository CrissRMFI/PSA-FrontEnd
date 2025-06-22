import TarjetaKanban from "@/components/Tickets/Kanban/TarjetaKanban";
import Link from "next/link";

export default function ColumnaKanban({ estado, tickets }) {
  const colores = {
    CREADO: "text-indigo-700",
    "En Progreso": "text-blue-700",
    ["EN PROGRESO"]: "text-blue-700",
    ["EN ESPERA DE INFORMACION"]: "text-yellow-600",
    BLOQUEADO: " text-red-700",
    FINALIZADO: " text-green-800",
    CANCELADO: " text-gray-700",
    RECHAZADO:  " text-red-600",
  };
  return (
    <div className="bg-slate-50 rounded-md shadow-sm border-none  min-w-[15%] px-5">
      <div className="p-3 border-b-slate-400 font-semibold text-sm uppercase flex justify-between items-center">
        <span className={colores[estado] || "text-gray-600"}>{estado}</span>
        <span className="text-gray-500">{tickets.length}</span>
      </div>

      <div className="p-2 space-y-3 w-full">
        {tickets.map((t) => (
          <Link href={`/Soporte/${t.internalId}`} key={t.internalId}>
            <TarjetaKanban key={t.id} ticket={t} />
          </Link>
        ))}
      </div>
    </div>
  );
}
