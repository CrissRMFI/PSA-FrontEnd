"use client";
import { getProductos } from "@/api/productos";
import { useState, useEffect } from "react";
import { getClientes, getResponsables } from "@/api/serviciosExternos";
import { addTicket, getMetadatos } from "@/api/tickets";

export default function FormularioTicket({ onClose, onTicketCreado }) {
  const [form, setForm] = useState({
    nombre: "",
    prioridad: "",
    severidad: "",
    idCliente: "",
    idProducto: "",
    version: "",
    descripcion: "",
    idResponsable: "",
  });

  const [clientes, setClientes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [showError, setShowError] = useState(false);
  const [prioridadesMeta, setPrioridadesMeta] = useState([]);
  const [severidadesMeta, setSeveridadesMeta] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getClientes().then(setClientes).catch(console.error);
    getResponsables().then(setResponsables).catch(console.error);
    getMetadatos()
      .then((data) => {
        setPrioridadesMeta(data.prioridades);
        setSeveridadesMeta(data.severidades);
      })
      .catch(console.error);
    getProductos()
      .then(setProductos)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idProducto") {
      setForm((prev) => ({
        ...prev,
        idProducto: value,
        version: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const estanTodosCompletos = Object.entries(form).every(
      ([_, value]) => value?.trim?.() !== ""
    );

    if (!estanTodosCompletos) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    try {
      const nuevo = await addTicket({ ...form });

     
      if (onTicketCreado) onTicketCreado(nuevo);

      onClose();
    } catch (error) {
      console.error("Error al crear ticket:", error);
     
    }
  };

  const productoSeleccionado = productos.find((p) => p.id === form.idProducto);
  const versionesDisponibles = productoSeleccionado?.versiones || [];

  console.log("VERSION SEL" + versionesDisponibles)

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
            name="idProducto"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.idProducto}
            onChange={(e) => {
              const selectedId = e.target.value;
              setForm((prev) => ({
                ...prev,
                idProducto: selectedId,
                version: "",
              }));
            }}
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p.idProducto} value={p.idProducto}>
                {p.nombreProducto}
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
            disabled={!form.idProducto}
          >
            <option value="">Seleccionar versión</option>
            {versionesDisponibles.map(v => (
              <option key={v.idVersion} value={v.idVersion}>
                {v.nombreVersion}
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
            {prioridadesMeta.map(p => (
              <option key={p.code} value={p.code}>
                {p.label}
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
            {severidadesMeta.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Cliente:</label>
          <select
            name="idCliente"
            className="border border-gray-300 rounded w-full px-2 py-1"
            value={form.idCliente}
            onChange={handleChange}
          >
            <option value="">Cliente</option>
            {clientes.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli["razon_social"]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="font-semibold block mb-1">Responsable:</label>
        <select
          name="idResponsable"
          className="border border-gray-300 rounded w-full px-2 py-1"
          value={form.idResponsable}
          onChange={handleChange}
        >
          <option value="">Responsable</option>
          {responsables.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre} {r.apellido}
            </option>
          ))}
        </select>
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
