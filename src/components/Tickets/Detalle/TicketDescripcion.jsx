export default function TicketDescripcion({ descripcion }) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm mb-6">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Descripción</h3>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{descripcion}</p>
    </div>
  );
}
