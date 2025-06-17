import { useState, useEffect } from "react";
import { getTicketsFiltrados } from "@/api/tickets";

export default function useTickets(producto, version) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async (producto, version) => {
      try {
        const data = await getTicketsFiltrados({
          idProducto: producto,
          version,
        });
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets(producto, version);
  }, [producto, version]);

  return { tickets, setTickets, loading };
}
