import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error);
    
    if (error.response?.status === 500) {
      throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Solicitud inválida');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. Por favor, intenta de nuevo.');
    } else {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }
);

// Servicios de contenido
export const contenidoService = {
  // Generar contenido completo
  generarContenido: async (datos) => {
    try {
      const response = await api.post('/contenido/generar', datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener tonos disponibles
  obtenerTonos: async () => {
    try {
      const response = await api.get('/contenido/tonos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener plataformas disponibles
  obtenerPlataformas: async () => {
    try {
      const response = await api.get('/contenido/plataformas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de código
export const codigoService = {
  // Analizar código
  analizarCodigo: async (datos) => {
    try {
      const response = await api.post('/codigo/analizar', datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener lenguajes soportados
  obtenerLenguajes: async () => {
    try {
      const response = await api.get('/codigo/lenguajes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener métricas de calidad
  obtenerMetricas: async () => {
    try {
      const response = await api.get('/codigo/metricas');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Servicios de galería (Strapi CMS)
export const galeriaService = {
  obtenerGaleria: async ({ pagina = 1, porPagina = 12, plataforma, tono } = {}) => {
    const params = new URLSearchParams({ pagina, porPagina });
    if (plataforma) params.append('plataforma', plataforma);
    if (tono)       params.append('tono', tono);
    const response = await api.get(`/galeria?${params.toString()}`);
    return response.data;
  },

  guardarPublicacion: async (datos) => {
    const response = await api.post('/galeria', datos);
    return response.data;
  },

  eliminarPublicacion: async (id) => {
    const response = await api.delete(`/galeria/${id}`);
    return response.data;
  },

  obtenerEstado: async () => {
    try {
      const response = await api.get('/galeria/estado');
      return response.data;
    } catch {
      return { exito: false, strapi: 'offline' };
    }
  },
};

// Utilidades
export const utils = {
  // Copiar texto al portapapeles
  copiarAlPortapapeles: async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (error) {
      console.error('Error copiando al portapapeles:', error);
      return false;
    }
  },

  // Formatear fecha
  formatearFecha: (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Validar formulario de contenido
  validarFormularioContenido: (datos) => {
    const errores = {};

    if (!datos.tema?.trim()) {
      errores.tema = 'El tema es obligatorio';
    }

    if (!datos.objetivo?.trim()) {
      errores.objetivo = 'El objetivo es obligatorio';
    }

    if (datos.tema && datos.tema.length > 200) {
      errores.tema = 'El tema no puede exceder los 200 caracteres';
    }

    if (datos.objetivo && datos.objetivo.length > 500) {
      errores.objetivo = 'El objetivo no puede exceder los 500 caracteres';
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores
    };
  },

  // Validar formulario de código
  validarFormularioCodigo: (datos) => {
    const errores = {};

    if (!datos.codigo?.trim()) {
      errores.codigo = 'El código es obligatorio';
    }

    if (datos.codigo && datos.codigo.length > 50000) {
      errores.codigo = 'El código no puede exceder los 50,000 caracteres';
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores
    };
  },
};

export default api;
