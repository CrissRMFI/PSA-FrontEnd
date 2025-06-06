import { tickets } from "@/api/mock/ticketsDatos";
let idCounter = tickets.length + 1;

export const getTickets = () => [...tickets];

export const addTicket = (ticket) => {
  const nuevo = {
    estado: "Nuevo",
    nombre: ticket.nombre,
    prioridad: ticket.prioridad,
    severidad: ticket.severidad,
    cliente: ticket.cliente,
    version: ticket.version || "1",
    descripcion: ticket.descripcion,
    sla: ticket.sla || "7 días - 100%",
    producto: ticket.producto,
  };

  nuevo.id = generarId();

  tickets.push(nuevo);
  return nuevo;
};

const generarId = () => `ERP-00000${idCounter++}`;
