const URL_CLIENTES = `${process.env.SUPPORT_MODULE_BACKEND_URL}/external/clients`;
const URL_RESPONSABLES = `${process.env.SUPPORT_MODULE_BACKEND_URL}/external/resources`;

export const getClientes = async () => {
  const res = await fetch(URL_CLIENTES);
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
};

export const getResponsables = async () => {
  const res = await fetch(URL_RESPONSABLES);
  if (!res.ok) throw new Error("Error al obtener responsables");
  return res.json();
};
