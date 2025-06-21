"use client";

import { useEffect, useState } from "react";
import useTickets from "@/hooks/useTickets";
import Filtros from "@/components/Filtros/Filtros";
import TablaTickets from "@/components/Tickets/Tabla/TablaTickets";
import KanbanVista from "@/components/Tickets/Kanban/KanbanVista";
import VistaSelector from "./VistaSelector";
//import { getClientes, getResponsables } from "@/api/serviciosExternos";
//import { PRIORIDADES, SEVERIDADES, ESTADOS } from "@/constantes/tickets";
//import { mapearTicketsConDatos } from "@/utils/mapTicketData";

export default function TicketContainer({ producto, version }) {

  const { tickets, setTickets, loading } = useTickets(producto, version);
  const [vista, setVista] = useState("tabla");
  //const [clientes, setClientes] = useState([]);
  //const [responsables, setResponsables] = useState([]);

  const [filtros, setFiltros] = useState({
    severidad: "",
    prioridad: "",
    estado: "",
  });

  const ticketsFiltrados = tickets.filter((ticket) => {
    return (
      (filtros.severidad === "" || ticket.severidad == filtros.severidad) &&
      (filtros.prioridad === "" || ticket.prioridad == filtros.prioridad) &&
      (filtros.estado === "" || ticket.estado == filtros.estado)
    );
  });
 //const ticketsFiltrados = tickets;



 /*
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
  */

  const ticketsConNombres = ticketsFiltrados;
  /*
  const ticketsConNombres = mapearTicketsConDatos(
    ticketsFiltrados,
    clientes,
    responsables
  );
  */


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
