import setUp from "@/app/setUp";
import { useState } from "react";
import { addTicket } from "@/api/tickets";

export default function FormularioTicket({ onClose, onCrearTicket }) {
  const [form, setForm] = useState({
    nombre: "",
    prioridad: "",
    severidad: "",
    cliente: "",
    modulo: "",
    version: "1",
    custom: false,
    descripcion: "",
  });

  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const estanTodosCompletos = Object.entries(form).every(([key, value]) => {
      if (typeof value === "boolean") return true;
      return value.trim?.() !== "";
    });

    if (!estanTodosCompletos) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const nuevo = addTicket(form);
    onCrearTicket(nuevo);
    onClose();
  };

  return (
    <form className="space-y-4 text-sm">
      {showError && (
        <div className="mb-4 bg-red-500 p-2 rounded-md flex justify-center items-center font-extrabold text-white ">
          Por favor, completá todos los campos.
        </div>
      )}
      <div>
        <label className="font-semibold block mb-1">Título:</label>
        <input
          type="text"
          name="nombre"
          placeholder="Título del incidente"
          className="border border-gray-300 rounded w-full px-2 py-1"
          value={form.nombre}
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
            name="custom"
            checked={form.custom}
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
          onClick={handleSubmit}
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
