import TarjetaKanban from "@/components/Tickets/Kanban/TarjetaKanban";

export default function ColumnaKanban({ estado, tickets }) {
  console.log(estado);
  const colores = {
    CREADO: "text-orange-600",
    "En Progreso": "text-blue-600",
    ["EN PROGRESO"]: "text-red-600",
    ["EN ESPERA DE INFORMACION"]: "text-green-600",
    BLOQUEADO: "text-gray-400",
    FINALIZADO: "text-purple-600",
    CANCELADO: "text-gray-500",
    RECHAZADO: "text-yellow-600",
  };

  return (
    <div className="bg-slate-50 rounded-md shadow-sm border-none  min-w-[15%] px-5">
      <div className="p-3 border-b-slate-400 font-semibold text-sm uppercase flex justify-between items-center">
        <span className={colores[estado] || "text-gray-600"}>{estado}</span>
        <span className="text-gray-500">{tickets.length}</span>
      </div>

      <div className="p-2 space-y-3 w-full">
        {tickets.map((t) => (
          <TarjetaKanban key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
