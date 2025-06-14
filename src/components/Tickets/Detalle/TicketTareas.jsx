export default function TicketTareas({ tareas = [] }) {
  return (
    <div className="rounded-md p-4 shadow-2xl bg-white text-md hover:shadow-cyan-950">
      <h3 className="font-semibold text-gray-700 mb-2">Tareas asociadas</h3>
      {tareas.length === 0 ? (
        <p className="text-gray-500 italic">Aún no se definieron tareas.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {tareas.map((tarea, idx) => (
            <li key={idx} className="text-gray-700">
              {tarea}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
