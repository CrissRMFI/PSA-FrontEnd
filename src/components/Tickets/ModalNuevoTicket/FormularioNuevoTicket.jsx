import { productos } from "@/api/mock/productosDatos";
import { opciones } from "@/api/mock/opcionesSelect";
import { useState } from "react";
import { addTicket } from "@/api/tickets";

export default function FormularioTicket({ onClose, onCrearTicket }) {
  const [form, setForm] = useState({
    nombre: "",
    prioridad: "",
    severidad: "",
    cliente: "",
    producto: "",
    version: "",
    descripcion: "",
  });

  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "producto") {
      setForm((prev) => ({
        ...prev,
        producto: value,
        version: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const estanTodosCompletos = Object.entries(form).every(
      ([_, value]) => value?.trim?.() !== ""
    );

    if (!estanTodosCompletos) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const nuevo = addTicket({
      ...form,
      custom: false,
    });

    onCrearTicket(nuevo);
    onClose();
  };

  const versionesDisponibles =
    productos.find((p) => p.nombre === form.producto)?.versiones || [];

  return (
    <form className="space-y-4 text-sm">
      {showError && (
        <div className="mb-4 bg-red-500 p-2 rounded-md text-white text-center font-semibold">
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
          <label className="font-semibold block mb-1">Producto:</label>
          <select
            name="producto"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.producto}
            onChange={handleChange}
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p, i) => (
              <option key={i} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Versión:</label>
          <select
            name="version"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.version}
            onChange={handleChange}
            disabled={!form.producto}
          >
            <option value="">Seleccionar versión</option>
            {versionesDisponibles.map((v, idx) => (
              <option key={idx} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Prioridad:</label>
          <select
            name="prioridad"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.prioridad}
            onChange={handleChange}
          >
            <option value="">Prioridad</option>
            {opciones.prioridad.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
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
            <option value="">Severidad</option>
            {opciones.severidad.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
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
            <option value="">Cliente</option>
            <option value="AgroTech">AgroTech</option>
            <option value="TextilSur">TextilSur</option>
          </select>
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
