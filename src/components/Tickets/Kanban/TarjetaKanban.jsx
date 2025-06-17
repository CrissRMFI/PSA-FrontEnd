export default function TarjetaTicket({ ticket }) {
  console.log(ticket);
  return (
    <div className="bg-white rounded-md p-3 shadow-xl  text-sm space-y-1 mb-5 w-75">
      <div className="flex justify-between items-center font-medium text-lg">
        <span>{ticket.codigo}</span>
      </div>

      <div className="text-lg font-bold">{ticket.nombre}</div>
      <div className="text-md text-gray-600">
        <strong>{ticket.version}</strong>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-lg text-gray-800 font-semibold">
          {ticket.nombreCliente}
        </div>

        <div className="flex flex-wrap gap-1 mt-1 items-center text-md">
          <span
            className={`px-2 py-0.5 rounded-md text-white ${
              ticket.prioridadLabel === "Alta"
                ? "bg-red-600"
                : ticket.prioridadLabel === "Media"
                ? "bg-orange-500"
                : "bg-blue-700"
            }`}
          >
            {ticket.prioridadLabel}
          </span>
          <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-md">
            {ticket.severidadLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
