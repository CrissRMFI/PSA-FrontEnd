import TarjetaKanban from "@/components/Tickets/Kanban/TarjetaKanban";

export default function ColumnaKanban({ estado, tickets }) {
  const colores = {
    Nuevo: "text-orange-600",
    "En Progreso": "text-blue-600",
    Escalado: "text-red-600",
    Resuelto: "text-green-600",
    Cerrado: "text-gray-400",
  };

  return (
    <div className="bg-slate-50 rounded-md shadow-sm border-none  min-w-[15%] px-5">
      <div className="p-3 border-b-slate-400 font-semibold text-sm uppercase flex justify-between items-center">
        <span className={colores[estado] || "text-gray-600" }>{estado}</span>
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
