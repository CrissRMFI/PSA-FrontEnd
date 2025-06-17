export default function VistaSelector({ vista, setVista }) {
  return (
    <button
      className="bg-emerald-700 border-none px-5 py-1 rounded text-md font-bold text-white"
      onClick={() =>
        setVista((prev) => (prev === "tabla" ? "kanban" : "tabla"))
      }
    >
      {vista === "tabla" ? "Vista Kanban" : "Vista Tabla"}
    </button>
  );
}
