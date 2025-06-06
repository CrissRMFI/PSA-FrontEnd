import { productos } from "@/api/mock/productosDatos";

export default function SeleccionadorProducto({
  productoSeleccionado,
  onSeleccionarProducto,
}) {
  return (
    <div className="mb-6 flex justify-evenly">
      <div className="flex flex-col w-full gap-y-5 lg:flex-row lg:gap-x-5 lg:justify-evenly">
        {productos.map(({ nombre }) => (
          <button
            key={nombre}
            onClick={() => onSeleccionarProducto(nombre)}
            className={`px-4 py-2 rounded-md border text-md font-medium
              ${
                nombre === productoSeleccionado
                  ? "bg-blue-600 text-white border-blue-700 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
              }
            `}
          >
            {nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
