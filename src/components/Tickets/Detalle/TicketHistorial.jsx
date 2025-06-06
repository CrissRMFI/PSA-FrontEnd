export default function TicketHistorial({ historial = [] }) {
  return (
    <div className="border rounded-md p-4 shadow-sm bg-white text-sm space-y-2">
      <h3 className="font-semibold text-gray-700 mb-2">
        Historial de acciones
      </h3>
      {historial.length === 0 ? (
        <p className="text-gray-500 italic">Sin acciones registradas.</p>
      ) : (
        <ul className="space-y-1">
          {historial.map((item, idx) => (
            <li key={idx} className="border-b pb-1">
              <div className="flex justify-between">
                <span className="font-medium">{item.accion}</span>
                <span className="text-gray-400 text-xs">{item.fecha}</span>
              </div>
              {item.detalles && (
                <p className="text-gray-600 text-sm">{item.detalles}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
