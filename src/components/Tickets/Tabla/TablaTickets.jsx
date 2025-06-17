import FilaTicket from "./FilaTicket";

export default function TablaTickets({ tickets }) {
  const headers = [
    "ID",
    "Nombre",
    "Cliente",
    "Responsable",
    "Estado",
    "Severidad",
    "Prioridad",
    "Ver",
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-6">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
          <tr className="font-extrabold text-[14px] text-center">
            {headers.map((col) => (
              <th key={col} className="px-4 py-3 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, idx) => (
            <FilaTicket key={idx} ticket={ticket} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
