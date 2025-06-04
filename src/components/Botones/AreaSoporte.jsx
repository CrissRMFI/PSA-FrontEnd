import Link from "next/link";
import React from "react";

export const AreaSoporte = () => {
  return (
    <Link href="/Soporte">
      <button className="border-2 rounded-md p-4 font-extrabold hover:bg-slate-50">
        ÁREA DE SOPORTE
      </button>
    </Link>
  );
};
