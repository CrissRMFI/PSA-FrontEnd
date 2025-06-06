import { productos } from "@/api/mock/productosDatos";

export default function SeleccionadorVersion({
  producto,
  versionSeleccionada,
  onSeleccionarVersion,
}) {
  if (!producto) return null;

  const prod = productos.find((p) => p.nombre === producto);

  const versiones = prod?.versiones || [];

  return (
    <div className="mb-6 flex justify-center mt-10 flex-col items-center">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Seleccioná una versión de <strong>{producto}</strong>
      </label>
      <select
        value={versionSeleccionada}
        onChange={(e) => onSeleccionarVersion(e.target.value)}
        className="block w-full max-w-xs px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">-- Seleccionar versión --</option>
        {versiones.map((v, idx) => (
          <option key={idx} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
