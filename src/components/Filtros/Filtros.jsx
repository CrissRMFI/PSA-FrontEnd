"use client";
import { getMetadatos } from "@/api/tickets";
import { useEffect, useState } from "react";

export default function Filtros({ filtros, setFiltros }) {
  const [prioridades, setPrioridades] = useState([]);
  const [severidades, setSeveridades] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getMetadatos()
      .then((data) => {
        setPrioridades(data.prioridades);
        setSeveridades(data.severidades);
        setEstados(data.estados);
      })
      .catch((error) => {
        console.error("Error al obtener metadatos:", error);
        setPrioridades([]);
        setSeveridades([]);
        setEstados([]);
      });
  }, []);

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
        className="border border-gray-300 rounded px-2 py-1 text-md text-center"
      >
        <option value="">Severidad</option>
        {severidades.map((sev, idx) => (
          <option key={idx} value={sev.code}>
            {sev.label}
          </option>
        ))}
      </select>

      <select
        name="prioridad"
        value={filtros.prioridad}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md text-center"
      >
        <option value="">Prioridad</option>
        {prioridades.map((pr, idx) => (
          <option key={idx} value={pr.code}>
            {pr.label}
          </option>
        ))}
      </select>

      <select
        name="estado"
        value={filtros.estado}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-md text-center"
      >
        <option value="">Estado</option>
        {estados.map((st, idx) => (
          <option key={idx} value={st.code}>
            {st.label}
          </option>
        ))}
      </select>
    </>
  );
}
