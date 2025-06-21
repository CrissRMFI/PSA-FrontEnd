"use client";

import Link from "next/link";
import React from "react";

export const AreaSoporte = () => {
  const manejarClick = () => {
    localStorage.removeItem("soporte_productoSeleccionado");
    localStorage.removeItem("soporte_versionSeleccionada");
  };

  return (
    <Link href="/Soporte">
      <button
        onClick={manejarClick}
        className="border-2 rounded-md p-4 font-extrabold hover:bg-slate-50"
      >
        ÁREA DE SOPORTE
      </button>
    </Link>
  );
};
