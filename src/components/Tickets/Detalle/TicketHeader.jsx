export default function TicketHeader({ id, nombre }) {
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {id} – {nombre}
      </h1>

      <div className="flex items-center gap-4 mt-6">
        <button className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700">
          Editar
        </button>
        <button className="bg-white border px-4 py-2 rounded hover:bg-gray-50">
          Crear Tarea
        </button>
      </div>
    </div>
  );
}
