import {
  mapearSeveridad,
  mapearCliente,
  mapearEstado,
  mapearPrioridad,
  mapearResponsable,
} from "@/utils/ticketMapper";
import { mapearTicketConDatos } from "@/utils/mapTicketData";
import { useState, useEffect } from "react";
import { getClientes, getResponsables } from "@/api/serviciosExternos";

export default function TicketInfo({ ticket }) {
  const [clientes, setClientes] = useState([]);
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchClientesYResponsables = async () => {
      try {
        const [clientesData, responsablesData] = await Promise.all([
          getClientes(),
          getResponsables(),
        ]);
        setClientes(clientesData);
        setResponsables(responsablesData);
      } catch (error) {
        console.error("Error al obtener clientes o responsables:", error);
      }
    };
    fetchClientesYResponsables();
  }, []);

  const ticketFormateado = mapearTicketConDatos(ticket, clientes, responsables);

  return (
    <div className="p-4 shadow-2xl bg-white space-y-2 text-sm hover:shadow-sky-950 rounded-md h-full">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-semibold text-md">
        <span className="text-gray-600">Cliente:</span>
        <span>{ticketFormateado.nombreCliente}</span>

        <span className="text-gray-600">Responsable:</span>
        <span>{ticketFormateado.nombreResponsable}</span>

        <span className="text-gray-600">Versión:</span>
        <span>{ticket.version}</span>

        <span className="text-gray-600">Prioridad:</span>
        <span>
          <span
            className={`inline-block px-2 py-0.5 rounded text-white text-xs font-semibold
              ${
                mapearPrioridad(ticketFormateado.prioridadLabel) === "Alta"
                  ? "bg-red-600"
                  : mapearPrioridad(ticketFormateado.prioridadLabel) === "Media"
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }
            `}
          >
            {mapearPrioridad(ticketFormateado.prioridadLabel) || "—"}
          </span>
        </span>

        <span className="text-gray-600">Severidad:</span>
        <span>{mapearSeveridad(ticketFormateado.severidadLabel)}</span>

        <span className="text-gray-600">Estado Actual:</span>
        <span>
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
            {mapearEstado(ticket.estado) || "—"}
          </span>
        </span>

        <span className="text-gray-600">Fecha de creación:</span>
        <span>{ticket.fechaCreacion || "—"}</span>
      </div>
    </div>
  );
}
