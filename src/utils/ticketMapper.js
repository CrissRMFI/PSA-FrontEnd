// utils/ticketMapper.js

export function mapearPrioridad(code) {
  const map = {
    HIGH_PRIORITY: "Alta",
    MEDIUM_PRIORITY: "Media",
    LOW_PRIORITY: "Baja",
  };
  return map[code] || code;
}

export function mapearSeveridad(code) {
  const map = {
    LEVEL_1: "Crítica",
    LEVEL_2: "Alta",
    LEVEL_3: "Media",
    LEVEL_4: "Baja",
    LEVEL_5: "Muy Baja",
  };
  return map[code] || code;
}

export function mapearEstado(code) {
  const map = {
    CREATED: "Creado",
    IN_PROGRESS: "En progreso",
    ESCALATED: "Escalado",
    CLOSED: "Cerrado",
  };
  return map[code] || code;
}

export function mapearCliente(id, listaClientes) {
  const cliente = listaClientes.find((c) => c.id === id);
  return cliente?.["razon_social"] || id;
}

export function mapearResponsable(id, listaResponsables) {
  const r = listaResponsables.find((r) => r.id === id);
  return r ? `${r.nombre} ${r.apellido}` : id;
}
