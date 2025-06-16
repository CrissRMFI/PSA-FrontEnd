// Agrega este componente en tu TareasManager.jsx (antes del export default):

function TareaAvanzadaForm({ tarea, fases, recursos, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    nombre: tarea?.nombre || '',
    descripcion: tarea?.descripcion || '',
    asignadoA: tarea?.asignadoA?.id || '',
    prioridad: tarea?.prioridad || 'MEDIA',
    estado: tarea?.estado || 'PENDIENTE',
    fechaInicio: tarea?.fechaInicio || '',
    fechaFin: tarea?.fechaFin || '',
    estimacionHoras: tarea?.estimacionHoras || '',
    porcentajeAvance: tarea?.porcentajeAvance || 0,
    participacionFases: tarea?.participacionFases || [
      {
        faseId: fases[0]?.id || '',
        faseName: fases[0]?.nombre || '',
        porcentajeParticipacion: 100,
        fechaInicioFase: tarea?.fechaInicio || '',
        fechaFinFase: tarea?.fechaFin || '',
        estadoEnFase: tarea?.estado || 'PENDIENTE',
        horasEnFase: tarea?.estimacionHoras || '',
        entregablesEnFase: []
      }
    ]
  });

  const [errores, setErrores] = useState({});

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: null }));
    }
  };

  const handleParticipacionChange = (index, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      participacionFases: prev.participacionFases.map((participacion, i) => 
        i === index 
          ? { 
              ...participacion, 
              [campo]: valor,
              ...(campo === 'faseId' && { faseName: fases.find(f => f.id == valor)?.nombre || '' })
            }
          : participacion
      )
    }));
  };

  const agregarParticipacionFase = () => {
    const fasesSinUsar = fases.filter(fase => 
      !formData.participacionFases.some(p => p.faseId == fase.id)
    );
    
    if (fasesSinUsar.length === 0) {
      alert('Ya has asignado la tarea a todas las fases disponibles');
      return;
    }

    const nuevaParticipacion = {
      faseId: fasesSinUsar[0].id,
      faseName: fasesSinUsar[0].nombre,
      porcentajeParticipacion: 0,
      fechaInicioFase: formData.fechaInicio,
      fechaFinFase: formData.fechaFin,
      estadoEnFase: 'PENDIENTE',
      horasEnFase: 0,
      entregablesEnFase: []
    };

    setFormData(prev => ({
      ...prev,
      participacionFases: [...prev.participacionFases, nuevaParticipacion]
    }));
  };

  const eliminarParticipacionFase = (index) => {
    if (formData.participacionFases.length <= 1) {
      alert('Una tarea debe pertenecer al menos a una fase');
      return;
    }
    setFormData(prev => ({
      ...prev,
      participacionFases: prev.participacionFases.filter((_, i) => i !== index)
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es requerida';
    if (!formData.asignadoA) nuevosErrores.asignadoA = 'Debe asignar la tarea a alguien';
    if (!formData.fechaInicio) nuevosErrores.fechaInicio = 'La fecha de inicio es requerida';
    if (!formData.fechaFin) nuevosErrores.fechaFin = 'La fecha de fin es requerida';
    if (!formData.estimacionHoras || formData.estimacionHoras <= 0) {
      nuevosErrores.estimacionHoras = 'La estimación debe ser mayor a 0';
    }

    const totalParticipacion = formData.participacionFases.reduce((sum, p) => sum + (p.porcentajeParticipacion || 0), 0);
    if (totalParticipacion !== 100) {
      nuevosErrores.participacionFases = `La suma de participación debe ser 100% (actual: ${totalParticipacion}%)`;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const tareaData = {
        ...formData,
        id: tarea?.id || Date.now(),
        asignadoA: recursos.find(r => r.id == formData.asignadoA),
        horasReales: tarea?.horasReales || 0,
        comentarios: tarea?.comentarios || 0,
        dependencias: tarea?.dependencias || []
      };
      onGuardar(tareaData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la tarea *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Implementar módulo de usuarios"
              />
              {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignado a *
              </label>
              <select
                value={formData.asignadoA}
                onChange={(e) => handleChange('asignadoA', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccionar recurso</option>
                {recursos.map(recurso => (
                  <option key={recurso.id} value={recurso.id}>
                    {recurso.nombre} - {recurso.rol}
                  </option>
                ))}
              </select>
              {errores.asignadoA && <p className="text-red-600 text-sm mt-1">{errores.asignadoA}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Describe los detalles de la tarea..."
            />
            {errores.descripcion && <p className="text-red-600 text-sm mt-1">{errores.descripcion}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => handleChange('prioridad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="BAJA">🟢 Baja</option>
                <option value="MEDIA">🟡 Media</option>
                <option value="ALTA">🔴 Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => handleChange('fechaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin *</label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => handleChange('fechaFin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horas estimadas *</label>
              <input
                type="number"
                min="1"
                value={formData.estimacionHoras}
                onChange={(e) => handleChange('estimacionHoras', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="40"
              />
            </div>
          </div>

          {/* Participación en fases - Versión simplificada */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Participación en Fases</h3>
            
            {errores.participacionFases && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">{errores.participacionFases}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.participacionFases.map((participacion, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Fase #{index + 1}</h4>
                    {formData.participacionFases.length > 1 && (
                      <button type="button" onClick={() => eliminarParticipacionFase(index)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fase *</label>
                      <select
                        value={participacion.faseId}
                        onChange={(e) => handleParticipacionChange(index, 'faseId', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Seleccionar fase</option>
                        {fases.map(fase => (
                          <option key={fase.id} value={fase.id}>{fase.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participación (%) *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={participacion.porcentajeParticipacion}
                        onChange={(e) => handleParticipacionChange(index, 'porcentajeParticipacion', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horas en fase</label>
                      <input
                        type="number"
                        min="0"
                        value={participacion.horasEnFase}
                        onChange={(e) => handleParticipacionChange(index, 'horasEnFase', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={agregarParticipacionFase}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600"
              >
                <Plus className="w-4 h-4 mx-auto mb-1" />
                Agregar otra fase
              </button>
            </div>

            {/* Resumen */}
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Total participación: <span className="font-semibold">
                  {formData.participacionFases.reduce((sum, p) => sum + (p.porcentajeParticipacion || 0), 0)}%
                </span>
                {formData.participacionFases.reduce((sum, p) => sum + (p.porcentajeParticipacion || 0), 0) !== 100 && 
                  <span className="text-red-600 ml-2">(Debe sumar 100%)</span>
                }
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancelar} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save className="w-4 h-4" />
              {tarea ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
