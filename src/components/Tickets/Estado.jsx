export default function Estado({ estado }) {
  const color =
    {
      Resuelto: "text-green-600",
      Nuevo: "text-orange-500",
      "En Progreso": "text-blue-600",
      Escalado: "text-red-600",
    }[estado] || "text-gray-600";

  return <span className={`font-bold ${color}`}>{estado}</span>;
}
