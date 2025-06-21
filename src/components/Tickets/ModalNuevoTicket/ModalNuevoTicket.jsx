import { Dialog } from "@headlessui/react";
import { Fragment } from "react";
import FormularioTicket from "@/components/Tickets/ModalNuevoTicket/FormularioNuevoTicket";

export default function ModalNuevoTicket({ isOpen, onClose, onTicketCreado }) {
  const handleTicketCreado = (ticketNuevo) => {
  
    if (onTicketCreado) {
      onTicketCreado(ticketNuevo);
    }
   
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Dialog.Panel className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg">
          <Dialog.Title className="text-2xl font-semibold mb-4">
            Nuevo Ticket
          </Dialog.Title>
          <FormularioTicket onClose={onClose} onTicketCreado={handleTicketCreado} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
