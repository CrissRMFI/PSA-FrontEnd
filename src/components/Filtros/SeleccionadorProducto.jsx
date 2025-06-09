import { productos } from "@/api/mock/productosDatos";

export default function SeleccionadorProducto({
  productoSeleccionado,
  onSeleccionarProducto,
}) {
  return (
    <div className="mb-6 flex justify-center">
      <select
        value={productoSeleccionado}
        onChange={(e) => onSeleccionarProducto(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm text-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      >
        <option value="">Seleccione un producto</option>
        {productos.map(({ nombre }) => (
          <option key={nombre} value={nombre}>
            {nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
