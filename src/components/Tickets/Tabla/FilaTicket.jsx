import { FaLayerGroup } from "react-icons/fa";
import Estado from "../Estado";

export default function FilaTicket({ ticket }) {
  return (
    <tr className="hover:bg-gray-50 border-t border-gray-100">
      <td className="px-4 py-3">{ticket.id}</td>
      <td className="px-4 py-3">{ticket.nombre}</td>
      <td className="px-4 py-3">{ticket.cliente}</td>
      <td className="px-4 py-3">{ticket.version}</td>
      <td className="px-4 py-3 font-extrabold">
        <Estado estado={ticket.estado} />
      </td>
      <td className="px-4 py-3">{ticket.sla}</td>
      <td className="px-4 py-3">{ticket.area}</td>
      <td className="px-4 py-3 text-center">{ticket.severidad}</td>
      <td className="px-4 py-3">{ticket.prioridad}</td>
      <td className="px-4 py-3">{ticket.custom}</td>
      <td className="px-4 py-3 text-center">
        <FaLayerGroup className="text-gray-600 hover:text-black cursor-pointer" />
      </td>
    </tr>
  );
}
