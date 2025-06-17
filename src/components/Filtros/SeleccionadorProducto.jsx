import { useState, useEffect } from "react";
import { getProductos } from "@/api/productos";

export default function SeleccionadorProducto({
  productoSeleccionado,
  onSeleccionarProducto,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosAMostrar = productoSeleccionado
    ? productos.filter((p) => p.nombre === productoSeleccionado)
    : productosFiltrados;

  const manejarSeleccion = (nombre) => {
    if (productoSeleccionado === nombre) {
      onSeleccionarProducto("");
    } else {
      onSeleccionarProducto(nombre);
    }
  };

  useEffect(() => {
    const getProductosAPI = async () => {
      const productos = await getProductos();
      setProductos(productos);
    };

    getProductosAPI();
  }, []);

  return (
    <div className="mb-6 p-4">
      {!productoSeleccionado && (
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      <div
        className={`${
          productoSeleccionado
            ? "flex justify-center"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        } gap-4`}
      >
        {productosAMostrar.map(({ nombre }, index) => {
          const seleccionado = nombre === productoSeleccionado;

          return (
            <div
              key={nombre}
              onClick={() => manejarSeleccion(nombre)}
              className={`cursor-pointer border rounded-lg shadow-md transition-all duration-300
              ${
                seleccionado
                  ? "border-blue-600 bg-blue-50"
                  : "hover:shadow-xl hover:border-blue-400"
              }
              flex items-center justify-center
              w-[220px] h-[180px] p-4
            `}
            >
              <div className="text-lg font-bold text-gray-800 text-center">
                {nombre}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
