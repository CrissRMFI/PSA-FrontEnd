import { useEffect, useState } from "react";
import { getProductos } from "@/api/productos";

export default function SeleccionadorProducto({
  onSeleccionarProducto,
  productoSeleccionado,
}) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await getProductos();
      setProductos(data);
    };

    fetchProductos();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {productos.map((producto) => (
        <div
          key={producto.idProducto}
          className={`p-4 rounded border shadow hover:shadow-md cursor-pointer transition-all
            ${
              productoSeleccionado === producto.idProducto
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          onClick={() => onSeleccionarProducto(producto.idProducto)}
        >
          <h3 className="text-lg font-semibold text-slate-700">
            {producto.nombreProducto}
          </h3>
          <p className="text-sm text-slate-500">
            Versiones: {producto.versiones.length}
          </p>
        </div>
      ))}
    </div>
  );
}
