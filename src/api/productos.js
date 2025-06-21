const PRODUCTOS_URL = `${process.env.NEXT_PUBLIC_SUPPORT_MODULE_BACKEND_URL}/productos`;

export const getProductos = async () => {
  const res = await fetch(PRODUCTOS_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};
