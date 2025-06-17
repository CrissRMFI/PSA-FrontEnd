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

  const productosAMostrar = productoSeleccionado
    ? productos.filter((p) => p.id === productoSeleccionado)
    : productos;

  const manejarSeleccion = (id) => {
    if (productoSeleccionado === id) {
      onSeleccionarProducto(""); // Deselecciona
    } else {
      onSeleccionarProducto(id); // Selecciona
    }
  };

  return (
    <div
      className={`${
        productoSeleccionado
          ? "flex justify-center"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      } gap-4 mb-6`}
    >
      {productosAMostrar.map((producto) => (
        <div
          key={producto.id}
          className={`p-4 rounded border shadow hover:shadow-md cursor-pointer transition-all w-full max-w-sm
            ${
              productoSeleccionado === producto.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          onClick={() => manejarSeleccion(producto.id)}
        >
          <h3 className="text-lg font-semibold text-slate-700 text-center">
            {producto.nombre}
          </h3>
          <p className="text-sm text-slate-500 text-center">
            Versiones: {producto.versiones.length}
          </p>
        </div>
      ))}
    </div>
  );
}
