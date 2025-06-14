export default function TicketDescripcion({ descripcion }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-2xl mb-6 hover:shadow-sky-950 h-full">
      <h3 className="font-extrabold text-md text-gray-700 mb-2">Descripción</h3>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{descripcion}</p>
    </div>
  );
}
