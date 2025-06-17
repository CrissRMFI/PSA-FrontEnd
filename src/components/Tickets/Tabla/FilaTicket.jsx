import { FaLayerGroup } from "react-icons/fa";
import Estado from "../Estado";
import Link from "next/link";

export default function FilaTicket({ ticket }) {
  return (
    <tr className="hover:bg-gray-50 border-t border-gray-100">
      <td className="px-4 py-3 text-center">{ticket.id}</td>
      <td className="px-4 py-3 text-center">{ticket.nombre}</td>
      <td className="px-4 py-3 text-center">{ticket.cliente}</td>
      <td className="px-4 py-3 text-center">{ticket.responsable}</td>
      <td className="px-4 py-3 font-extrabold text-center">
        <Estado estado={ticket.estado} />
      </td>
      <td className="px-4 py-3 text-center">{ticket.severidad}</td>
      <td className="px-4 py-3 text-center">{ticket.prioridad}</td>
      <td className="px-4 py-3 text-center">
        <Link href={`/Soporte/${ticket.id}`} className="flex justify-center">
          <FaLayerGroup className="text-gray-600 hover:text-black cursor-pointer" />
        </Link>
      </td>
    </tr>
  );
}
