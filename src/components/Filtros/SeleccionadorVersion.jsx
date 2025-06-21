import { useEffect, useState } from "react";
import { getProductos } from "@/api/productos";

export default function SeleccionadorVersion({
  producto,
  versionSeleccionada,
  onSeleccionarVersion,
}) {
  const [versiones, setVersiones] = useState([]);

  useEffect(() => {
    const fetchVersiones = async () => {
      const productos = await getProductos();
      const productoEncontrado = productos.find((p) => p.idProducto === producto);
      setVersiones(productoEncontrado?.versiones || []);
    };

    if (producto) fetchVersiones();
  }, [producto]);

  return (
    <div className="my-5 flex justify-center">
      <div className="w-full max-w-xs text-center">
        <label className="block text-lg mb-2 font-medium text-gray-700">
          Versión:
        </label>
        <select
          className="border rounded px-3 py-2 w-full text-center text-gray-700"
          value={versionSeleccionada}
          onChange={(e) => onSeleccionarVersion(e.target.value)}
        >
          <option value="">Seleccione una versión</option>
          {versiones.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
