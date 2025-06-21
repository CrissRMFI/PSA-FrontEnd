import { useEffect, useState } from "react";
import { getProductos } from "@/api/productos";
import { Package } from "lucide-react";

export default function SeleccionadorProducto({
  onSeleccionarProducto,
  productoSeleccionado,
}) {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await getProductos();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const productosFiltrados = productoSeleccionado
    ? productos.filter((p) => p.id === productoSeleccionado)
    : productos;

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;

  const productosAMostrar = productoSeleccionado
    ? productosFiltrados
    : productosFiltrados.slice(indicePrimero, indiceUltimo);

  const manejarSeleccion = (id) => {
    if (productoSeleccionado === id) {
      onSeleccionarProducto("");
    } else {
      onSeleccionarProducto(id);
    }
  };

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className={productoSeleccionado ? "" : "flex flex-col min-h-[70vh] justify-between"}>
      <div className={productoSeleccionado ? "" : "flex-grow"}>
        <div
          className={`${
            productoSeleccionado
              ? "flex justify-center"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          } gap-4`}
        >
          {productosAMostrar.map((producto) => (
            <div
              key={producto.id}
              className={`p-5 rounded-lg border shadow-sm transition-all w-full max-w-sm cursor-pointer
                ${
                  productoSeleccionado === producto.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-slate-50"
                }`}
              onClick={() => manejarSeleccion(producto.id)}
            >
              <div className="flex items-center justify-center mb-2 text-blue-400">
                <Package className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-slate-700 text-center">
                {producto.nombre}
              </h3>

              <p className="text-sm text-blue-500 text-center mt-1">
                Versiones: {producto.versiones.length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {!productoSeleccionado && totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-5 mb-4">
          <button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-slate-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={siguientePagina}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
