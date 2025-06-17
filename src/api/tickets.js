const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket`;

export const getTicketsFiltrados = async ({ idProducto, version }) => {
  const query = new URLSearchParams({ idProducto, version }).toString();
  const res = await fetch(`${BASE_URL}/filtrados?${query}`);
  if (!res.ok) throw new Error("Error al obtener tickets filtrados");
  return await res.json();
};

export const addTicket = async (ticket) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Error al agregar ticket: " + errorText);
  }

  return await res.text();
};

const BASE_METADATOS = `${process.env.NEXT_PUBLIC_SERVICIOS_METADATOS}`;

export const getMetadatos = async () => {
  const res = await fetch(`${BASE_METADATOS}`);
  if (!res.ok) throw new Error("Error al obtener metadatos del ticket");
  return await res.json();
};
