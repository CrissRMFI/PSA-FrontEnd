import { PRIORIDADES, SEVERIDADES, ESTADOS } from "@/constantes/tickets";

export const obtenerNombreCliente = (id, clientes) => {
  const cliente = clientes.find((c) => c.id === id);
  return cliente ? cliente["razon_social"] : "Desconocido";
};

export const obtenerNombreResponsable = (id, responsables) => {
  const responsable = responsables.find((r) => r.id === id);
  return responsable
    ? `${responsable.nombre} ${responsable.apellido}`
    : "Desconocido";
};

export const obtenerLabelPrioridad = (code) => {
  const p = PRIORIDADES.find((p) => p.code === code);
  return p ? p.label : code;
};

export const obtenerLabelSeveridad = (code) => {
  const s = SEVERIDADES.find((s) => s.code === code);
  return s ? s.label : code;
};

export const obtenerLabelEstado = (code) => {
  const e = ESTADOS.find((e) => e.code === code);
  return e ? e.label : code;
};

export const mapearTicketsConDatos = (tickets, clientes, responsables) => {
  const ticketsMap = tickets.map((ticket) => { const t = ({
    ...ticket,
    nombreCliente: obtenerNombreCliente(ticket.idCliente, clientes),
    nombreResponsable: obtenerNombreResponsable(
      ticket.idResponsable,
      responsables
    ),
    prioridadLabel: obtenerLabelPrioridad(ticket.prioridad),
    severidadLabel: obtenerLabelSeveridad(ticket.severidad),
    estadoLabel: obtenerLabelEstado(ticket.estado),
  }
)
  console.log("TicketMap " + JSON.stringify(t))
  return t
});
  return ticketsMap
};

export const mapearTicketConDatos = (ticket, clientes, responsables) => {
  const ticketDatos = {
    ...ticket,
    nombreCliente: obtenerNombreCliente(ticket.idCliente, clientes),
    nombreResponsable: obtenerNombreResponsable(
      ticket.idResponsable,
      responsables
    ),
    prioridadLabel: obtenerLabelPrioridad(ticket.prioridad),
    severidadLabel: obtenerLabelSeveridad(ticket.severidad),
    estadoLabel: obtenerLabelEstado(ticket.estado),
  };

  return ticketDatos
};
