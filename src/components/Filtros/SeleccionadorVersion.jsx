import { getProductos } from "@/api/productos";
import { useEffect, useState } from "react";

export default function SeleccionadorVersion({
  producto,
  versionSeleccionada,
  onSeleccionarVersion,
}) {
  if (!producto) return null;

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const prod = productos.find((p) => p.nombre === producto);

  const versiones = prod?.versiones || [];

  return (
    <div className="mb-6 flex justify-center mt-10 flex-col items-center">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Seleccioná una versión de <strong>{producto}</strong>
      </label>
      <select
        value={versionSeleccionada}
        onChange={(e) => onSeleccionarVersion(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm text-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      >
        <option value="">-- Seleccionar versión --</option>
        {versiones.map((v, idx) => (
          <option key={idx} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
