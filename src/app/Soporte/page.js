"use client";

import { useState } from "react";
import SeleccionadorProducto from "@/components/Filtros/SeleccionadorProducto";
import SeleccionadorVersion from "@/components/Filtros/SeleccionadorVersion";
import TicketContainer from "@/components/Tickets/TicketContainer";

export default function SoportePage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [versionSeleccionada, setVersionSeleccionada] = useState("");

  return (
    <div className="p-10">
      <h2 className="text-4xl text-slate-500 mb-10">Soporte / Productos</h2>

      <SeleccionadorProducto
        onSeleccionarProducto={(prod) => {
          setProductoSeleccionado(prod);
          setVersionSeleccionada("");
        }}
        productoSeleccionado={productoSeleccionado}
      />

      {productoSeleccionado && (
        <SeleccionadorVersion
          producto={productoSeleccionado}
          versionSeleccionada={versionSeleccionada}
          onSeleccionarVersion={setVersionSeleccionada}
        />
      )}

      {productoSeleccionado && versionSeleccionada && (
        <TicketContainer
          producto={productoSeleccionado}
          version={versionSeleccionada}
        />
      )}
    </div>
  );
}
