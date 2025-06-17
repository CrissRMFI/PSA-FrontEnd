"use client";

import { useEffect, useState } from "react";
import useTickets from "@/hooks/useTickets";
import { PRIORIDADES, SEVERIDADES, ESTADOS } from "@/constantes/tickets";
import Filtros from "@/components/Filtros/Filtros";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import VistaSelector from "./VistaSelector";
import { getClientes, getResponsables } from "@/api/serviciosExternos";

export default function TicketContainer({ producto, version }) {
  const { tickets, setTickets, loading } = useTickets(producto, version);
  const [vista, setVista] = useState("tabla");
  const [clientes, setClientes] = useState([]);
  const [responsables, setResponsables] = useState([]);

  const [filtros, setFiltros] = useState({
    severidad: "",
    prioridad: "",
    estado: "",
  });

  const ticketsFiltrados = tickets.filter((ticket) => {
    return (
      ticket.idProducto === producto &&
      ticket.version === version &&
      (filtros.severidad === "" || ticket.severidad === filtros.severidad) &&
      (filtros.prioridad === "" || ticket.prioridad === filtros.prioridad) &&
      (filtros.estado === "" || ticket.estado === filtros.estado)
    );
  });

  useEffect(() => {
    const fetchClientesYResponsables = async () => {
      try {
        const [clientesData, responsablesData] = await Promise.all([
          getClientes(),
          getResponsables(),
        ]);
        setClientes(clientesData);
        setResponsables(responsablesData);
      } catch (error) {
        console.error("Error al obtener clientes o responsables:", error);
      }
    };
    fetchClientesYResponsables();
  }, []);

  const obtenerNombreCliente = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente["razon_social"] : "Desconocido";
  };

  const obtenerNombreResponsable = (id) => {
    const responsable = responsables.find((r) => r.id === id);
    return responsable
      ? `${responsable.nombre} ${responsable.apellido}`
      : "Desconocido";
  };

  const obtenerLabelPrioridad = (code) => {
    const p = PRIORIDADES.find((p) => p.code === code);
    return p ? p.label : code;
  };

  const obtenerLabelSeveridad = (code) => {
    const s = SEVERIDADES.find((s) => s.code === code);
    return s ? s.label : code;
  };

  const obtenerLabelEstado = (code) => {
    const estado = ESTADOS.find((e) => e.code === code);
    return estado ? estado.label : code;
  };

  const ticketsConNombres = ticketsFiltrados.map((ticket) => ({
    ...ticket,
    nombreCliente: obtenerNombreCliente(ticket.idCliente),
    nombreResponsable: obtenerNombreResponsable(ticket.idResponsable),
    prioridadLabel: obtenerLabelPrioridad(ticket.prioridad),
    severidadLabel: obtenerLabelSeveridad(ticket.severidad),
    estadoLabel: obtenerLabelEstado(ticket.estado),
  }));

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mt-6 mb-4">
        <Filtros filtros={filtros} setFiltros={setFiltros} />
        <VistaSelector vista={vista} setVista={setVista} />
      </div>

      {vista === "tabla" ? (
        <TablaTickets tickets={ticketsConNombres} />
      ) : (
        <KanbanVista tickets={ticketsConNombres} />
      )}
    </>
  );
}
