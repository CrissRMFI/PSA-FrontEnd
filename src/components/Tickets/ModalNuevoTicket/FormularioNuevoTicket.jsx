import setUp from "@/app/setUp";
import { useState } from "react";

export default function FormularioTicket({ onClose }) {
  const [form, setForm] = useState({
    titulo: "",
    prioridad: "",
    severidad: "",
    cliente: "",
    producto: "",
    modulo: "",
    version: "1",
    customizado: false,
    descripcion: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form className="space-y-4 text-sm">
      <div>
        <label className="font-semibold block mb-1">Título:</label>
        <input
          type="text"
          name="titulo"
          placeholder="Título del incidente"
          className="border border-gray-300 rounded w-full px-2 py-1"
          value={form.titulo}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="font-semibold block mb-1">Prioridad:</label>
          <select
            name="prioridad"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.prioridad}
            onChange={handleChange}
          >
            <option>Prioridad</option>
            {setUp.prioridad.map((p, i) => (
              <option key={i}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Severidad:</label>
          <select
            name="severidad"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.severidad}
            onChange={handleChange}
          >
            <option>Severidad</option>
            {setUp.severidad.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Cliente:</label>
          <select
            name="cliente"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.cliente}
            onChange={handleChange}
          >
            <option>Cliente</option>
            <option>AgroTech</option>
            <option>TextilSur</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Módulo Func:</label>
          <select
            name="modulo"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.modulo}
            onChange={handleChange}
          >
            <option>Módulo Funcional</option>
            <option>Ventas</option>
            <option>Stock</option>
            <option>Contabilidad</option>
          </select>
        </div>

        <div className="flex items-center mt-6 gap-3">
          <label className="font-semibold">Customizado</label>
          <input
            type="checkbox"
            name="customizado"
            checked={form.customizado}
            onChange={handleChange}
          />
          <label className="font-semibold ml-4">Versión</label>
          <input
            type="text"
            name="version"
            className="border border-gray-300 rounded px-2 py-1 w-20"
            value={form.version}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-1">Descripción:</label>
        <textarea
          name="descripcion"
          placeholder="Descripción del incidente"
          rows="4"
          className="border border-gray-300 rounded w-full px-2 py-1"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="submit"
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-5 py-1.5 rounded"
        >
          GUARDAR
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-5 py-1.5 rounded"
        >
          CERRAR
        </button>
      </div>
    </form>
  );
}
