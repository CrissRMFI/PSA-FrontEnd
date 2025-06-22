export default function Prioridad({ prioridad }) {
  const estilo = {
    "BAJA": "bg-green-100 text-green-700",
    "MEDIA": "bg-orange-100 text-orange-700",
    "ALTA": "bg-red-100 text-red-700",
  
  }[prioridad] || "bg-gray-100 text-gray-700"; // default

  return (
    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${estilo}`}>
      {prioridad}
    </span>
  );
}
