"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Building2, Package, Save, X, Plus } from 'lucide-react';

// Mock data - después esto viene de las APIs
const mockClientes = [
  { id: 1, nombre: "Empresa ABC S.A.", email: "contacto@empresaabc.com" },
  { id: 2, nombre: "TechCorp Ltd.", email: "info@techcorp.com" },
  { id: 3, nombre: "InnovateCorp", email: "hello@innovatecorp.com" },
  { id: 4, nombre: "Global Solutions", email: "contact@globalsolutions.com" }
];

const mockRecursos = [
  { id: 1, nombre: "Leonardo", apellido: "Felici", legajo: "EMP001" },
  { id: 2, nombre: "María", apellido: "González", legajo: "EMP002" },
  { id: 3, nombre: "Carlos", apellido: "Mendoza", legajo: "EMP003" },
  { id: 4, nombre: "Ana", apellido: "Rodríguez", legajo: "EMP004" },
  { id: 5, nombre: "Pedro", apellido: "López", legajo: "EMP005" }
];

// Productos del CSV
const mockProductos = [
  { nombre: "SAP ERP", versiones: ["7.50", "7.51"] },
  { nombre: "Oracle ERP Cloud", versiones: ["23C"] },
  { nombre: "Microsoft Dynamics 365", versiones: ["2024 Wave 1", "2023 Wave 2", "2023 Wave 1"] },
  { nombre: "Workday HCM", versiones: ["2024 R2", "2024 R1"] },
  { nombre: "ServiceNow", versiones: ["Paris", "Quebec"] },
  { nombre: "Tableau", versiones: ["2024.1", "2023.4", "2023.3", "2022.4"] },
  { nombre: "Salesforce CRM", versiones: ["2025 Spring Release", "2024 Winter Release", "2023 Summer Release"] },
  { nombre: "Jira Software", versiones: ["9.4.0", "9.3.1"] },
  { nombre: "Confluence", versiones: ["8.11.0", "8.10.0", "8.9.0"] }
];

export default function ProyectoForm({ proyecto = null, onCancel, onSave }) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [productos] = useState(mockProductos);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    clienteId: '',
    liderProyecto: '',
    productos: [],
    recursosAsignados: []
  });

  const [errors, setErrors] = useState({});
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [showRecursoModal, setShowRecursoModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        fechaInicio: proyecto.fechaInicio || '',
        fechaFinEstimada: proyecto.fechaFinEstimada || '',
        clienteId: proyecto.cliente?.id || '',
        liderProyecto: proyecto.liderProyecto || '',
        productos: proyecto.productos || [],
        recursosAsignados: proyecto.recursos || []
      });
    }
  }, [proyecto]);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      // Simular llamadas a APIs
      await new Promise(resolve => setTimeout(resolve, 500));
      setClientes(mockClientes);
      setRecursos(mockRecursos);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpiar error del campo
    if (errors[campo]) {
      setErrors(prev => ({
        ...prev,
        [campo]: null
      }));
    }
  };

  const agregarProducto = (producto, version) => {
    const productoCompleto = `${producto} ${version}`;
    if (!formData.productos.includes(productoCompleto)) {
      setFormData(prev => ({
        ...prev,
        productos: [...prev.productos, productoCompleto]
      }));
    }
    setShowProductoModal(false);
  };

  const quitarProducto = (producto) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p !== producto)
    }));
  };

  const agregarRecurso = (recurso, rol) => {
    const recursoCompleto = {
      id: recurso.id,
      nombre: `${recurso.nombre} ${recurso.apellido}`,
      rol: rol
    };
    
    // Verificar si ya está agregado
    const yaExiste = formData.recursosAsignados.find(r => r.id === recurso.id);
    if (!yaExiste) {
      setFormData(prev => ({
        ...prev,
        recursosAsignados: [...prev.recursosAsignados, recursoCompleto]
      }));
    }
    setShowRecursoModal(false);
  };

  const quitarRecurso = (recursoId) => {
    setFormData(prev => ({
      ...prev,
      recursosAsignados: prev.recursosAsignados.filter(r => r.id !== recursoId)
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFinEstimada) {
      nuevosErrores.fechaFinEstimada = 'La fecha de fin estimada es obligatoria';
    }

    if (formData.fechaInicio && formData.fechaFinEstimada) {
      if (new Date(formData.fechaInicio) >= new Date(formData.fechaFinEstimada)) {
        nuevosErrores.fechaFinEstimada = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (!formData.clienteId) {
      nuevosErrores.clienteId = 'Debe seleccionar un cliente';
    }

    if (!formData.liderProyecto.trim()) {
      nuevosErrores.liderProyecto = 'Debe asignar un líder de proyecto';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Preparar datos para enviar al backend
      const proyectoData = {
        ...formData,
        cliente: clientes.find(c => c.id === parseInt(formData.clienteId)),
        estado: proyecto ? proyecto.estado : 'ACTIVO'
      };

      onSave && onSave(proyectoData);
      
    } catch (error) {
      console.error('Error guardando proyecto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !clientes.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h1>
              <p className="text-gray-600 mt-1">
                {proyecto ? 'Modifica los datos del proyecto' : 'Completa la información del nuevo proyecto'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Implementación SAP ERP"
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.descripcion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe los objetivos y alcance del proyecto"
                />
                {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin Estimada *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.fechaFinEstimada}
                    onChange={(e) => handleInputChange('fechaFinEstimada', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.fechaFinEstimada ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fechaFinEstimada && <p className="text-red-500 text-sm mt-1">{errors.fechaFinEstimada}</p>}
              </div>
            </div>
          </div>

          {/* Cliente y Líder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente y Responsables</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={formData.clienteId}
                    onChange={(e) => handleInputChange('clienteId', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.clienteId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.clienteId && <p className="text-red-500 text-sm mt-1">{errors.clienteId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Líder de Proyecto *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.liderProyecto}
                    onChange={(e) => handleInputChange('liderProyecto', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.liderProyecto ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre del líder de proyecto"
                  />
                </div>
                {errors.liderProyecto && <p className="text-red-500 text-sm mt-1">{errors.liderProyecto}</p>}
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Productos y Versiones</h2>
              <button
                type="button"
                onClick={() => setShowProductoModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {formData.productos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.productos.map((producto, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    <Package className="w-4 h-4" />
                    {producto}
                    <button
                      type="button"
                      onClick={() => quitarProducto(producto)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay productos agregados</p>
            )}
          </div>

          {/* Recursos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recursos Asignados</h2>
              <button
                type="button"
                onClick={() => setShowRecursoModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Asignar Recurso
              </button>
            </div>

            {formData.recursosAsignados.length > 0 ? (
              <div className="space-y-2">
                {formData.recursosAsignados.map((recurso, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{recurso.nombre}</p>
                        <p className="text-sm text-gray-500">{recurso.rol}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarRecurso(recurso.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay recursos asignados</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {proyecto ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Agregar Producto */}
      {showProductoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Agregar Producto</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {productos.map((producto, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">{producto.nombre}</h4>
                  <div className="flex flex-wrap gap-2">
                    {producto.versiones.map((version, vIndex) => (
                      <button
                        key={vIndex}
                        onClick={() => agregarProducto(producto.nombre, version)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      >
                        {version}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowProductoModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asignar Recurso */}
      {showRecursoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Asignar Recurso</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recursos.map((recurso) => (
                <div key={recurso.id} className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{recurso.nombre} {recurso.apellido}</h4>
                  <p className="text-sm text-gray-500 mb-2">Legajo: {recurso.legajo}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => agregarRecurso(recurso, 'Desarrollador')}
                      className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
                    >
                      Desarrollador
                    </button>
                    <button
                      type="button"
                      onClick={() => agregarRecurso(recurso, 'Analista')}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      Analista
                    </button>
                    <button
                      type="button"
                      onClick={() => agregarRecurso(recurso, 'Tester')}
                      className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
                    >
                      Tester
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowRecursoModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}