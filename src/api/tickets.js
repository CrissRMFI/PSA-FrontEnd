const BASE_URL = `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/ticket`;

export const getTicketsFiltrados = async ({ idProducto, version }) => {
  const query = new URLSearchParams({ idProducto, version }).toString();
  const res = await fetch(`${BASE_URL}/filtrados?${query}`);
  if (!res.ok) throw new Error("Error al obtener tickets filtrados");
  return await res.json();
};

export const getTicketsByVersion = async ({  idVersion }) => {
  console.log("VERSION FETCH " + idVersion)
  const res = await fetch(`${BASE_URL}/version/${idVersion}`);
  if (!res.ok) throw new Error("Error al obtener tickets filtrados por version");
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

const BASE_METADATOS = `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/metadatos`;

export const getMetadatos = async () => {
  const res = await fetch(`${BASE_METADATOS}`);
  if (!res.ok) throw new Error("Error al obtener metadatos del ticket");
  return await res.json();
};

export const getTicketById = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/ticket/data/${id}`
  );
  if (!res.ok) throw new Error("Error al obtener el ticket");
  return res.json();
};

export const updateTicket = async (internalId, data) => {
  console.log(internalId, data);
  const res = await fetch(`${BASE_URL}/${internalId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Error al actualizar ticket: " + errorText);
  }

  return "Ticket actualizado correctamente";
};

export const deleteTicket = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Error al eliminar ticket: " + errorText);
  }

  return await res.text(); 
};
