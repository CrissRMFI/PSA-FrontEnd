export default function DeleteConfirm({ item, itemName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          {/* Ícono de Advertencia */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
            ¿Eliminar {itemName}?
          </h3>

          {/* Mensaje */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Esta acción no se puede deshacer. Se eliminará permanentemente:
            </p>
            <p className="font-semibold text-gray-800 bg-gray-50 p-2 rounded">
              "{item.nombre}"
            </p>
            {item.totalTareas > 0 && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ Este {itemName} tiene {item.totalTareas} tareas asociadas que también se eliminarán.
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
