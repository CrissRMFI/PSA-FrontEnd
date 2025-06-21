"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTicketById } from "@/api/tickets";

import TicketDescripcion from "@/components/Tickets/Detalle/TicketDescripcion";
import TicketHeader from "@/components/Tickets/Detalle/TicketHeader";
import TicketInfo from "@/components/Tickets/Detalle/TicketInfo";
import TicketTareas from "@/components/Tickets/Detalle/TicketTareas";
import { getProductos } from "@/api/productos";
import { ArrowLeft } from "lucide-react";

const VistaTicket = () => {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [producto, setProducto] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
        const productoNombre = await getProductos();
        const productoFiltrado = productoNombre.find(
          (p) => p.id === data.idProducto
        );
        setProducto(productoFiltrado ? productoFiltrado.nombre : "Desconocido");
      } catch (error) {
        console.error("Error al obtener el ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <p className="p-10 text-slate-400">Cargando ticket...</p>;
  if (!ticket) return <p className="p-10 text-red-500">Ticket no encontrado</p>;

  return (
    <div className="p-10">
      <div className="w-[90%] mx-auto">
       
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </button>

      
        <h2 className="text-4xl text-slate-500 mb-6">{`Soporte / Producto / ${producto}`}</h2>

       
        <div className="space-y-8">
          <TicketHeader ticket={ticket} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketInfo ticket={ticket} />
            <TicketDescripcion descripcion={ticket.descripcion} />
          </div>

          <div className="flex-grow h-[2px] bg-gray-200"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketTareas tareas={[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaTicket;
