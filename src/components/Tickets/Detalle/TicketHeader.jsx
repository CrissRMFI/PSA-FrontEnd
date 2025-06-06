export default function TicketHeader({ id, nombre }) {
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {id} – {nombre}
      </h1>
    </div>
  );
}
