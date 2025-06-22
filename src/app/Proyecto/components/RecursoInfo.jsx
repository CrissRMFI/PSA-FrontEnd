export default function RecursoInfo({ 
  recurso, 
  stringValue, 
  tipo = "general", // "lider", "responsable", "general"
  showBadge = true,
  showDni = false,
  size = "normal" // "small", "normal", "large"
}) {
  
  // Si hay recurso, usar los datos del recurso; si no, usar el string
  const displayName = recurso?.nombreCompleto || stringValue || 'Sin asignar';
  const isRecursoReal = !!recurso;

  const getAvatarSize = () => {
    switch (size) {
      case 'small': return 'w-6 h-6 text-xs';
      case 'large': return 'w-12 h-12 text-lg';
      default: return 'w-8 h-8 text-sm';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getBadgeColor = () => {
    switch (tipo) {
      case 'lider': return 'bg-blue-100 text-blue-600';
      case 'responsable': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getTypeIcon = () => {
    switch (tipo) {
      case 'lider':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'responsable':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!displayName || displayName === 'Sin asignar') {
    return (
      <div className="flex items-center text-gray-500">
        <div className={`${getAvatarSize()} bg-gray-200 rounded-full flex items-center justify-center mr-2`}>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className={`${getTextSize()} italic`}>Sin asignar</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {/* Avatar */}
      <div className={`${getAvatarSize()} ${isRecursoReal ? 'bg-blue-100' : 'bg-gray-200'} rounded-full flex items-center justify-center mr-2 flex-shrink-0`}>
        <span className={`font-semibold ${isRecursoReal ? 'text-blue-600' : 'text-gray-600'}`}>
          {getInitials(displayName)}
        </span>
      </div>

      {/* Información del recurso */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`font-medium text-gray-800 truncate ${getTextSize()}`}>
            {displayName}
          </span>
          
          {/* Badge de tipo de recurso */}
          {showBadge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isRecursoReal ? getBadgeColor() : 'bg-gray-100 text-gray-500'
            }`}>
              {getTypeIcon()}
              <span className="ml-1">
                {isRecursoReal ? 'Recurso' : 'Texto'}
              </span>
            </span>
          )}
        </div>

        {/* Información adicional para recursos reales */}
        {isRecursoReal && showDni && recurso.dni && (
          <div className="text-xs text-gray-500 mt-0.5">
            DNI: {recurso.dni}
          </div>
        )}

        {/* Información adicional para strings */}
        {!isRecursoReal && showBadge && (
          <div className="text-xs text-gray-500 mt-0.5">
            Asignación manual
          </div>
        )}
      </div>

      {/* Indicador de estado del recurso */}
      {isRecursoReal && (
        <div className="ml-2 flex-shrink-0">
          <div className="w-2 h-2 bg-green-400 rounded-full" title="Recurso activo"></div>
        </div>
      )}
    </div>
  );
}
