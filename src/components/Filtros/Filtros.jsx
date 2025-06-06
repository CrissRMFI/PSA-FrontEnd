"use client";
import { opciones } from "@/api/mock/opcionesSelect";

export default function Filtros({ filtros, setFiltros }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <select
        name="severidad"
        value={filtros.severidad}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md"
      >
        <option value="">Severidad</option>
        {opciones.severidad.map((sev, idx) => (
          <option key={idx} value={sev}>
            {sev}
          </option>
        ))}
      </select>

      <select
        name="prioridad"
        value={filtros.prioridad}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md"
      >
        <option value="">Prioridad</option>
        {opciones.prioridad.map((pr, idx) => (
          <option key={idx} value={pr}>
            {pr}
          </option>
        ))}
      </select>

      <select
        name="estado"
        value={filtros.estado}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md"
      >
        <option value="">Estado</option>
        {opciones.estado.map((st, idx) => (
          <option key={idx} value={st}>
            {st}
          </option>
        ))}
      </select>

      <select
        name="sla"
        value={filtros.sla}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md"
      >
        <option value="">% SLA</option>
        {opciones.sla.map((sl, idx) => (
          <option key={idx} value={sl}>
            {sl}
          </option>
        ))}
      </select>
    </>
  );
}
