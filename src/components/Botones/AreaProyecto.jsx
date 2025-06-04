import Link from "next/link";
import React from "react";

const AreaProyecto = () => {
  return (
    <Link href={"/Proyecto"}>
      <button className="border-none rounded-md p-4 font-extrabold text-white bg-[#444444] hover:bg-slate-700">
        ÁREA DE PROYECTO
      </button>
    </Link>
  );
};

export default AreaProyecto;
