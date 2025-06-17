"use client";
import { Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function ModalEditarTarea({
  isOpen,
  onClose,
  tarea,
  onGuardar,
}) {
  const [form, setForm] = useState({
    nombre: tarea?.nombre || "",
    descripcion: tarea?.descripcion || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Editar Tarea
          </Dialog.Title>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="w-full border border-gray-300 rounded px-3 py-1 mt-1"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Descripción</label>
              <textarea
                name="descripcion"
                rows="4"
                className="w-full border border-gray-300 rounded px-3 py-1 mt-1"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
