export default function TicketInfo({ ticket }) {
  return (
    <div className="p-4 shadow-2xl bg-white space-y-2 text-sm hover:shadow-sky-950 rounded-md h-full">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-semibold text-md">
        <span className="text-gray-600">Cliente:</span>
        <span>{ticket.cliente}</span>

        <span className="text-gray-600">Producto:</span>
        <span>{ticket.producto}</span>

        <span className="text-gray-600">Versión:</span>
        <span>{ticket.version}</span>

        <span className="text-gray-600">Prioridad:</span>
        <span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-white text-xs font-semibold
              ${
                ticket.prioridad === "Alta"
                  ? "bg-red-600"
                  : ticket.prioridad === "Media"
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }
            `}
          >
            {ticket.prioridad}
          </span>
        </span>

        <span className="text-gray-600">Severidad:</span>
        <span>{ticket.severidad}</span>

        <span className="text-gray-600">Estado Actual:</span>
        <span>
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
            {ticket.estado}
          </span>
        </span>

        <span className="text-gray-600">Fecha de creación:</span>
        <span>{ticket.fechaCreacion || "—"}</span>

        <span className="text-gray-600">SLA:</span>
        <span>{ticket.sla}</span>
      </div>
    </div>
  );
}
