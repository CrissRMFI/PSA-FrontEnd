const PRODUCTOS_URL = `${process.env.SUPPORT_MODULE_BACKEND_URL}/external/resources`;

export const getProductos = async () => {
  const res = await fetch(PRODUCTOS_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};
