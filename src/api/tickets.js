const tickets = [
  {
    id: "ERP-000001",
    nombre: "Error al emitir factura",
    cliente: "AgroTech",
    version: "5.2.1",
    estado: "Resuelto",
    sla: "7 días - 100%",
    area: "Nivel 1",
    severidad: 1,
    prioridad: "Media",
    custom: "sí",
  },
  {
    id: "ERP-000002",
    nombre: "Falló la actualización de stock",
    cliente: "TextilSur",
    version: "5.1.0",
    estado: "Nuevo",
    sla: "5 días - 20%",
    area: "Nivel 1",
    severidad: 4,
    prioridad: "Media",
    custom: "no",
  },
  {
    id: "ERP-000003",
    nombre: "Descuadre de asiento contable",
    cliente: "AgroTech",
    version: "5.2.1",
    estado: "En Progreso",
    sla: "2 días - 40%",
    area: "Nivel 1",
    severidad: 1,
    prioridad: "Alta",
    custom: "sí",
  },
  {
    id: "ERP-000004",
    nombre: "No se puede cerrar el periodo",
    cliente: "AgroTech",
    version: "5.2.1",
    estado: "En Progreso",
    sla: "1 día - 50%",
    area: "Nivel 2",
    severidad: 3,
    prioridad: "Baja",
    custom: "sí",
  },
  {
    id: "ERP-000005",
    nombre: "Problema con el tipo de cambio",
    cliente: "AgroTech",
    version: "5.1.0",
    estado: "Escalado",
    sla: "6 días - 10%",
    area: "Nivel 3",
    severidad: 5,
    prioridad: "Baja",
    custom: "no",
  },
];

export const getTickets = () => [...tickets];

export const addTicket = (ticket) => {
  const nuevo = {
    id: generarId(),
    estado: "Nuevo",
    sla: "0 días - 0%",
    area: "Nivel 1",
    ...ticket,
  };
  tickets.push(nuevo);
  return nuevo;
};

let idCounter = 6;
const generarId = () => `ERP-00000${idCounter++}`;
