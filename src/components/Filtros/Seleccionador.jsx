import setUp from "@/app/setUp";

export const Seleccionador = ({
  texto,
  vista,
  onCambiarVista,
  onNuevoTicket,
}) => {
  const cambiarVista = () => {
    const nuevaVista = vista === "tabla" ? "kanban" : "tabla";
    onCambiarVista(nuevaVista);
  };
  return (
    <div className="flex w-full justify-start items-center gap-4 flex-wrap">
      <div>
        <label className="font-semibold mr-5">{texto}</label>
        <select className="border border-gray-300 rounded px-2 py-1 text-md">
          {setUp.productos.map((product, idx) => (
            <option key={idx}>{product}</option>
          ))}
        </select>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white text-md px-3 py-1 rounded"
        onClick={onNuevoTicket}
      >
        + Nuevo Ticket
      </button>

      <select className="border border-gray-300 rounded px-2 py-1 text-md">
        <option>Severidad</option>
        {setUp.severidad.map((sev, idx) => (
          <option key={idx}>{sev}</option>
        ))}
      </select>

      <select className="border border-gray-300 rounded px-2 py-1 text-md">
        <option>Prioridad</option>
        {setUp.prioridad.map((pr, idx) => (
          <option key={idx}>{pr}</option>
        ))}
      </select>

      <select className="border border-gray-300 rounded px-2 py-1 text-md">
        <option>Estado</option>
        {setUp.estado.map((st, idx) => (
          <option key={idx}>{st}</option>
        ))}
      </select>

      <select className="border border-gray-300 rounded px-2 py-1 text-md">
        <option>% SLA</option>
        {setUp.sla.map((sl, idx) => (
          <option key={idx}>{sl}</option>
        ))}
      </select>

      <button
        className="bg-green-600 hover:bg-green-700 text-white text-md px-3 py-1 rounded ml-auto"
        onClick={cambiarVista}
      >
        {vista === "tabla" ? "Vista Kanban" : "Vista Tabla"}
      </button>
    </div>
  );
};
