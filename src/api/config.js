// src/api/config.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Sistema PSA';
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG === 'true';

console.log('🔧 API Config:', { API_BASE_URL, APP_NAME, DEBUG_MODE });

// Función para manejar respuestas
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${error}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// Función base para hacer llamadas API
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    if (DEBUG_MODE) {
      console.log('🌐 API Call:', options.method || 'GET', url);
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

export { API_BASE_URL, APP_NAME, DEBUG_MODE };
