const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket`;

export const getTickets = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener tickets");
  return await res.json();
};

export const addTicket = async (ticket) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  if (!res.ok) throw new Error("Error al agregar ticket");
  return await res.json();
};
