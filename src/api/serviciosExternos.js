const URL_CLIENTES = `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/external/clients`;
const URL_RESPONSABLES = `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/external/resources`;

export const getClientes = async () => {
  console.log(URL_CLIENTES)
  const res = await fetch(URL_CLIENTES);
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
};

export const getResponsables = async () => {
  console.log(URL_RESPONSABLES)
  const res = await fetch(URL_RESPONSABLES);
  if (!res.ok) throw new Error("Error al obtener responsables");
  return res.json();
};
