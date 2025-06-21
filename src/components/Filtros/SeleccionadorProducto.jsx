import { useEffect, useState } from "react";
import { getProductos } from "@/api/productos";


export default function SeleccionadorProducto({
  onSeleccionarProducto,
  productoSeleccionado,
  
}) {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

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
      onSeleccionarProducto(""); // Deselecciona
    } else {
      onSeleccionarProducto(id); // Selecciona
    }
  };

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className= {productoSeleccionado ? "" :"flex flex-col min-h-[70vh] justify-between"}>
    
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
          <span className="text-sm font-semibold">
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
