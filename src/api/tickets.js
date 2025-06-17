const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket`;

export const prioridades = [
  { label: "Alta", value: "HIGH_PRIORITY" },
  { label: "Media", value: "MEDIUM_PRIORITY" },
  { label: "Baja", value: "LOW_PROORITY" },
];

export const severidades = [
  { label: "1", value: "LEVEL_1" },
  { label: "2", value: "LEVEL_2" },
  { label: "3", value: "LEVEL_3" },
  { label: "4", value: "LEVEL_4" },
  { label: "5", value: "LEVEL_5" },
];

export const getTickets = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener tickets");
  return await res.json();
};

export const addTicket = async (ticket) => {
  console.log(ticket);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error("Error al agregar ticket");
  return await res.json();
};
