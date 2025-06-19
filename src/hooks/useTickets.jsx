import { useState, useEffect } from "react";
import { getTicketsByVersion } from "@/api/tickets";

export default function useTickets(producto, versionId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async (producto, versionId) => {
      try {
        console.log("VERSION USE EFF" + versionId)
        const data = await getTicketsByVersion({
          idVersion: versionId,
          //idProducto: producto,
        });
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets(producto, versionId);
  }, [producto, versionId]);

  return { tickets, setTickets, loading };
}
