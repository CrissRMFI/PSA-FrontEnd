import { useEffect, useState } from "react";
import { getProductos } from "@/api/productos";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

export default function SeleccionadorProducto({
  onSeleccionarProducto,
  productoSeleccionado,
  filtroNombre, // <- AÑADIDO
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

  // 🔍 Aplicamos filtro por nombre si está presente
  const productosFiltradosBase = productoSeleccionado
    ? productos.filter((p) => p.idProducto === productoSeleccionado)
    : productos;

  const productosFiltrados = filtroNombre
    ? productosFiltradosBase.filter((p) =>
        p.nombreProducto.toLowerCase().includes(filtroNombre.toLowerCase())
      )
    : productosFiltradosBase;

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

  const irAPagina = (num) => setPaginaActual(num);
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
              key={producto.idProducto}
              className={`p-5 rounded-lg border shadow-sm transition-all w-full max-w-sm cursor-pointer
                ${
                  productoSeleccionado === producto.idProducto
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-slate-50"
                }`}
              onClick={() => manejarSeleccion(producto.idProducto)}
            >
              <div className="flex items-center justify-center mb-2 text-blue-400">
                <Package className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-slate-700 text-center">
                {producto.nombreProducto}
              </h3>

              <p className="text-sm text-blue-500 text-center mt-1">
                Versiones: {producto.versiones.length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {!productoSeleccionado && totalPaginas > 1 && (
        <div className="flex flex-col items-center justify-center mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className={`flex items-center px-3 py-1 rounded-md text-sm transition ${
                paginaActual === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
                <button
                  key={numeroPagina}
                  onClick={() => irAPagina(numeroPagina)}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    paginaActual === numeroPagina
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {numeroPagina}
                </button>
              ))}
            </div>

            <button
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className={`flex items-center px-3 py-1 rounded-md text-sm transition ${
                paginaActual === totalPaginas
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
