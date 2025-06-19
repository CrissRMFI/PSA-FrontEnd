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
    <div className="my-5">
      <label className="block text-lg mb-1">Versión:</label>
      <select
        className="border rounded px-3 py-2 w-full"
        value={versionSeleccionada}
        onChange={(e) => onSeleccionarVersion(e.target.value)}
      >
        <option value="">Seleccione una versión</option>
        {versiones.map((v) => (
          <option key={v.idVersion} value={v.idVersion}>
            {v.nombreVersion}
          </option>
        ))}
      </select>
    </div>
  );
}
