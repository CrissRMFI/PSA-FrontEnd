import setUp from "@/app/setUp";

export const Seleccionador = ({
  texto,
  vista,
  onCambiarVista,
  onNuevoTicket,
  filtros,
  setFiltros,
}) => {
  const cambiarVista = () => {
    const nuevaVista = vista === "tabla" ? "kanban" : "tabla";
    onCambiarVista(nuevaVista);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="flex w-full justify-start items-center gap-4 flex-wrap">
      <div>
        <label className="font-semibold mr-5">{texto}</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-md"
          onChange={handleFiltroChange}
          name="producto"
          value={filtros.producto}
        >
          <option value="">Producto</option>
          {setUp.productos.map((product, idx) => (
            <option key={idx} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white text-md px-3 py-1 rounded"
        onClick={onNuevoTicket}
      >
        + Nuevo Ticket
      </button>

      <select
        className="border border-gray-300 rounded px-2 py-1 text-md"
        onChange={handleFiltroChange}
        name="severidad"
        value={filtros.severidad}
      >
        <option value="">Severidad</option>
        {setUp.severidad.map((sev, idx) => (
          <option key={idx} value={sev}>
            {sev}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-300 rounded px-2 py-1 text-md"
        onChange={handleFiltroChange}
        name="prioridad"
        value={filtros.prioridad}
      >
        <option value="">Prioridad</option>
        {setUp.prioridad.map((pr, idx) => (
          <option key={idx} value={pr}>
            {pr}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-300 rounded px-2 py-1 text-md"
        onChange={handleFiltroChange}
        name="estado"
        value={filtros.estado}
      >
        <option value="">Estado</option>
        {setUp.estado.map((st, idx) => (
          <option key={idx} value={st}>
            {st}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-300 rounded px-2 py-1 text-md"
        onChange={handleFiltroChange}
        name="sla"
        value={filtros.sla}
      >
        <option value="">% SLA</option>
        {setUp.sla.map((sl, idx) => (
          <option key={idx} value={sl}>
            {sl}
          </option>
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
