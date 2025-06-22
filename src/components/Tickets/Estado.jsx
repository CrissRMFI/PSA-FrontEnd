export default function Estado({ estado }) {
  const estilo = {
    "RESUELTO": "bg-green-100 text-green-700",
    "NUEVO": "bg-orange-100 text-orange-700",
    "EN PROGRESO": "bg-blue-100 text-blue-700",
    "CREADO": "bg-indigo-100 text-indigo-700",
    "EN ESPERA DE INFORMACION": "bg-yellow-100 text-yellow-700",
    "BLOQUEADO": "bg-red-100 text-red-700",
    "FINALIZADO": "bg-green-100 text-green-800",
    "CANCELADO": "bg-gray-100 text-gray-700",
    "RECHAZADO": "bg-red-100 text-red-800",
  }[estado] || "bg-gray-100 text-gray-700"; // default

  return (
    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${estilo}`}>
      {estado}
    </span>
  );
}
