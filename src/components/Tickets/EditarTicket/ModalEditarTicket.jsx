import { Dialog } from "@headlessui/react";
import { Fragment } from "react";
import FormularioEditarTicket from "./FormularioEditarTicket";

export default function ModalEditarTicket({ isOpen, onClose, ticket, onSave }) {
  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <Dialog.Title className="text-xl font-bold mb-4">
            Editar Ticket
          </Dialog.Title>
          <FormularioEditarTicket
            ticket={ticket}
            onClose={onClose}
            onSave={onSave}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
