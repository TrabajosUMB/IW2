/**
 * Servicio de generación de imágenes usando Pollinations.ai.
 * No requiere API key — devuelve una URL directa de imagen, no base64.
 * URL base: https://image.pollinations.ai/prompt/{prompt_encoded}
 *
 * Anti-caché: se añade un seed aleatorio a cada URL para forzar
 * una imagen distinta por cada generación.
 */

const ESTILOS_TONO = {
  creativo:    'artistic, colorful, creative composition',
  profesional: 'clean, professional, corporate style',
  juvenil:     'vibrant, energetic, trendy, youthful',
  formal:      'elegant, sophisticated, high-end photography',
  promocional: 'eye-catching, bold colors, marketing style'
};

const FORMATOS_PLATAFORMA = {
  instagram: 'social media content, square format, highly aesthetic',
  twitter:   'bold visual, high contrast, attention-grabbing',
  facebook:  'warm, community-oriented, shareable content',
  linkedin:  'professional, business context, clean background',
  general:   'versatile social media style, clean composition'
};

/**
 * Construye la URL de Pollinations con seed aleatorio para evitar caché.
 * @param {string} prompt  - Descripción de la imagen en inglés
 * @param {object} opciones
 * @param {number} [opciones.width=1024]
 * @param {number} [opciones.height=1024]
 * @param {number} [opciones.seed]       - Si no se pasa, se genera aleatoriamente
 * @returns {string} URL directa de la imagen
 */
function generarImagenUrl(prompt, opciones = {}) {
  const { width = 1024, height = 1024, seed } = opciones;
  const semilla = seed !== undefined ? seed : Math.floor(Math.random() * 999999);
  const codificado = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${codificado}?width=${width}&height=${height}&seed=${semilla}&nologo=true&enhance=true`;
}

/**
 * Construye un prompt de imagen en inglés cuando la IA no proporcionó uno.
 * Combina tema + objetivo con el estilo del tono y el formato de la plataforma.
 * @param {string} tema
 * @param {string} plataforma
 * @param {string} tono
 * @param {string} [objetivo='']
 * @returns {string}
 */
function construirPromptImagen(tema, plataforma, tono, objetivo = '') {
  const tonoKey = (tono      || 'profesional').toLowerCase();
  const platKey = (plataforma || 'general').toLowerCase();
  const estilo  = ESTILOS_TONO[tonoKey]      || 'professional photography';
  const formato = FORMATOS_PLATAFORMA[platKey] || 'social media style';
  // Combinar tema y objetivo para un prompt más específico y contextual
  const sujeto  = objetivo ? `${tema}, ${objetivo}` : tema;
  return `${sujeto}, ${estilo}, ${formato}, high quality, detailed, 4k`;
}

/**
 * Genera la URL de imagen combinando tema y parámetros cuando no hay prompt de IA.
 * @param {string} tema
 * @param {string} plataforma
 * @param {string} tono
 * @param {string} objetivo
 * @returns {{ url: string, descripcion: string }}
 */
function generarImagen(tema, plataforma, tono, objetivo) {
  const prompt = construirPromptImagen(tema, plataforma, tono);
  return {
    url: generarImagenUrl(prompt),
    descripcion: `Imagen generada con Pollinations.ai para el tema: ${tema}`
  };
}

module.exports = { generarImagen, generarImagenUrl, construirPromptImagen };
