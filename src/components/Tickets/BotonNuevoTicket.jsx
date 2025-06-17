export default function BotonNuevoTicket({ openModal }) {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white text-md px-5 py-1 rounded"
      onClick={openModal}
    >
      + Nuevo Ticket
    </button>
  );
}
