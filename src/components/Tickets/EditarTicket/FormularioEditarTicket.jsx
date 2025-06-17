"use client";

import { useState, useEffect } from "react";
import { getMetadatos } from "@/api/tickets";

export default function FormularioEditarTicket({ ticket, onClose, onSave }) {
  const [form, setForm] = useState({ ...ticket });
  const [prioridades, setPrioridades] = useState([]);
  const [severidades, setSeveridades] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getMetadatos().then((meta) => {
      setPrioridades(meta.prioridades);
      setSeveridades(meta.severidades);
      setEstados(meta.estados);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    onClose();
  };

  return (
    <form className="space-y-4 text-sm">
      <div>
        <label className="block font-semibold">Título:</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Prioridad:</label>
          <select
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
            className="border px-2 py-1 w-full rounded"
          >
            {prioridades.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Severidad:</label>
          <select
            name="severidad"
            value={form.severidad}
            onChange={handleChange}
            className="border px-2 py-1 w-full rounded"
          >
            {severidades.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Estado:</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="border px-2 py-1 w-full rounded"
          >
            {estados.map((e) => (
              <option key={e.code} value={e.code}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-semibold">Descripción:</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows="4"
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
