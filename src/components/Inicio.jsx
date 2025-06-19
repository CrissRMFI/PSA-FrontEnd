import React from "react";
import { AreaSoporte } from "./Botones/AreaSoporte";
import AreaProyecto from "./Botones/AreaProyecto";

export const Inicio = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-[40px] font-extrabold mb-10 ">Bienvenido a</h1>
      <h1 className="text-[60px] font-extrabold mb-10"> Pro Sync Analytics</h1>
      <div className="flex justify-evenly w-1/2">
        <AreaSoporte />
        <AreaProyecto />
      </div>
    </div>
  );
};
