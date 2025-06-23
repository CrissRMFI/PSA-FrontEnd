import { FaLayerGroup } from "react-icons/fa";
import Estado from "../Estado";
import Link from "next/link";
import Prioridad from "../Prioridad";

export default function FilaTicket({ ticket }) {
  if (ticket.estadoLabel === "CANCELADO") return null;

  return (
    <tr className="hover:bg-gray-50 border-t border-gray-100">
      <td className="px-4 py-3 text-center">{ticket.nombre}</td>
      <td className="px-4 py-3 text-center">{ticket.nombreCliente}</td>
      <td className="px-4 py-3 text-center">{ticket.nombreResponsable}</td>
      <td className="px-4 py-3 font-extrabold text-center">
        <Estado estado={ticket.estadoLabel} />
      </td>
      <td className="px-4 py-3 text-center">{ticket.severidadLabel}</td>
      <td className="px-4 py-3 text-center">
        <Prioridad prioridad={ticket.prioridadLabel} />
      </td>
      <td className="px-4 py-3 text-center">
        <Link
          href={`/Soporte/${ticket.internalId}`}
          className="flex justify-center"
        >
          <FaLayerGroup className="text-gray-600 hover:text-black cursor-pointer" />
        </Link>
      </td>
    </tr>
  );
}
