/**
 * Sistema de templates inteligentes para generación de contenido.
 * Último eslabón de la cadena: se activa cuando todas las APIs de IA fallan.
 */

const { construirPromptImagen } = require('./pollinationsService');

// ─── Estructuras de texto por plataforma y tono ───────────────────────────────

const ESTRUCTURAS = {
  instagram: {
    formal:      ['{intro}. {desarrollo}. {cta} ✨'],
    creativo:    ['🌟 {intro} — {desarrollo}. ¿{pregunta}? {cta}'],
    promocional: ['🔥 {intro}! {beneficio}. {urgencia}. {cta}'],
    profesional: ['💼 {intro}. {desarrollo}. {cta}'],
    juvenil:     ['👀 {intro}?? {desarrollo}!! {cta} 🙌']
  },
  twitter: {
    formal:      ['{intro}. {desarrollo}. {cta}'],
    creativo:    ['{intro} → {desarrollo}. {cta}'],
    promocional: ['🔥 {intro}! {beneficio}. {cta}'],
    profesional: ['{intro}. {desarrollo}. {cta}'],
    juvenil:     ['{intro}?? {desarrollo}! {cta} 🔥']
  },
  facebook: {
    formal:      ['{intro}. {desarrollo}. {reflexion}. {cta}'],
    creativo:    ['🌟 {intro}. {desarrollo}. ¿{pregunta}? {cta}'],
    promocional: ['🎯 {intro}! {beneficio}. {urgencia}. {cta}'],
    profesional: ['{intro}. {desarrollo}. {reflexion}. {cta}'],
    juvenil:     ['😎 {intro}! {desarrollo}. ¿{pregunta}? {cta}']
  },
  linkedin: {
    formal:      ['{intro}. {desarrollo}. {reflexion}. {cta}'],
    creativo:    ['{intro}. {desarrollo}. {reflexion}. {cta}'],
    promocional: ['{intro}. {beneficio}. {reflexion}. {cta}'],
    profesional: ['{intro}. {desarrollo}. {reflexion}. {cta}'],
    juvenil:     ['{intro}. {desarrollo}. {reflexion}. {cta}']
  },
  general: {
    formal:      ['{intro}. {desarrollo}. {cta}'],
    creativo:    ['✨ {intro}. {desarrollo}. {cta}'],
    promocional: ['🎯 {intro}! {beneficio}. {cta}'],
    profesional: ['{intro}. {desarrollo}. {cta}'],
    juvenil:     ['🔥 {intro}! {desarrollo}. {cta}']
  }
};

// ─── Banco de frases por objetivo ─────────────────────────────────────────────
// {tema} = nombre del tema, {objetivo} = texto libre del usuario

// Regla de distribución: intro → usa {objetivo}, desarrollo/reflexion → usa {tema}
// Esto evita que el objetivo se repita múltiples veces en el mismo texto.
const FRASES = {
  informar: {
    intro: [
      'Hoy queremos contarte sobre {objetivo}',
      '{objetivo}: todo lo que necesitas saber',
      'Te compartimos lo más importante: {objetivo}',
      'Descubre {objetivo} y por qué importa'
    ],
    desarrollo: [
      'En el mundo de {tema}, esto es fundamental y merece tu atención',
      '{tema} tiene más para ofrecer de lo que imaginas',
      'La información sobre {tema} está transformando la manera en que actuamos',
      'Conocer {tema} a fondo marca una diferencia real'
    ],
    reflexion: [
      'Estar bien informado sobre {tema} te da una ventaja real',
      'El conocimiento es poder — y {tema} no es la excepción',
      'Quien entiende {tema} toma mejores decisiones'
    ],
    cta: [
      'Comparte si también te parece importante',
      '¿Qué opinas? Déjanos tu comentario',
      'Guarda esta publicación para tenerla siempre a mano'
    ],
    pregunta: ['ya sabías esto sobre {tema}', 'qué tanto sabes de {tema}']
  },
  vender: {
    intro: [
      'Presentamos {objetivo} — exactamente lo que estabas buscando',
      '¿Buscas {objetivo}? Lo encontraste',
      '{objetivo}: la oportunidad que no puedes dejar pasar',
      'Llega lo que estabas esperando: {objetivo}'
    ],
    desarrollo: [
      'En {tema} encontrarás la calidad y el valor que mereces',
      'Miles de personas ya confían en {tema} para obtener resultados reales',
      '{tema} está diseñado para quienes buscan lo mejor'
    ],
    beneficio: [
      'Con {tema} obtienes resultados visibles desde el primer día',
      'Ahorra tiempo, dinero y esfuerzo con {tema}',
      'La mejor inversión que puedes hacer hoy'
    ],
    urgencia: [
      'Oferta por tiempo limitado — ¡no te lo pierdas!',
      'Quedan pocos lugares disponibles',
      'Actúa hoy y empieza a disfrutar los beneficios'
    ],
    cta: [
      'Haz clic en el enlace de la bio para saber más',
      'Escríbenos y te damos toda la info',
      '¡Reserva tu lugar ahora!'
    ],
    pregunta: ['estás listo para dar el siguiente paso', 'qué esperas para empezar']
  },
  inspirar: {
    intro: [
      '{objetivo}: una meta que vale la pena perseguir',
      '{objetivo} empieza con una decisión — la tuya',
      'Lo extraordinario empieza cuando decides apostar por {objetivo}',
      'Cada día es una nueva oportunidad para {objetivo}'
    ],
    desarrollo: [
      'Los grandes logros no ocurren de la noche a la mañana, pero con {tema} todo es posible',
      'Tu potencial no tiene límites — y {tema} es el camino',
      'La diferencia entre el éxito y el estancamiento está en dar el primer paso en {tema}'
    ],
    reflexion: [
      'Recuerda: el camino con {tema} suele llevar a los mejores destinos',
      'No importa dónde estés, siempre puedes avanzar en {tema}',
      'Cada pequeño paso en {tema} te acerca a quien quieres ser'
    ],
    cta: [
      'Comparte con alguien que necesite escuchar esto hoy',
      '¿Te identificas? Cuéntanos en los comentarios',
      'Guarda esto para los días que necesites motivación'
    ],
    pregunta: ['esto te inspira', 'ya diste el primer paso en {tema}']
  },
  entretener: {
    intro: [
      '¿Sabías que {objetivo}?',
      'Prepárate: {objetivo} — y esto te va a sorprender',
      'Lo que nadie te había contado sobre {objetivo}',
      '{objetivo}: el dato que cambia todo'
    ],
    desarrollo: [
      'Y es que {tema} tiene un lado que muy pocos conocen',
      'La realidad supera a la ficción, especialmente en {tema}',
      '{tema} es tan fascinante como inesperado — y esto lo prueba'
    ],
    reflexion: [
      'Al final, siempre hay algo nuevo que descubrir en {tema}',
      'La curiosidad sobre {tema} es el primer paso hacia lo extraordinario'
    ],
    cta: [
      '¡Deja tu reacción en los comentarios!',
      'Etiqueta a alguien que necesita ver esto',
      '¿Conocías este lado de {tema}? ¡Cuéntanos!'
    ],
    pregunta: ['ya lo sabías', 'qué fue lo que más te sorprendió de {tema}']
  },
  educar: {
    intro: [
      'Guía práctica: {objetivo}',
      'Aprende {objetivo} paso a paso',
      'Todo lo que necesitas para {objetivo}',
      'Lección del día: {objetivo}'
    ],
    desarrollo: [
      'El primer paso es entender los fundamentos de {tema} — y es más sencillo de lo que crees',
      'Dominar {tema} abre puertas que antes parecían cerradas',
      'Este conocimiento sobre {tema} puede cambiar tu perspectiva completamente'
    ],
    reflexion: [
      'El aprendizaje continuo es la mejor inversión que puedes hacer',
      'Quien domina {tema} siempre tiene ventaja'
    ],
    cta: [
      'Guarda esta publicación para repasar más tarde',
      '¿Tienes dudas? Pregunta en los comentarios',
      'Comparte con alguien que también quiera aprender sobre {tema}'
    ],
    pregunta: ['ya conocías todo esto sobre {tema}', 'en qué nivel estás tú con {tema}']
  }
};

// ─── Hashtags ─────────────────────────────────────────────────────────────────

const HASHTAGS_PLATAFORMA = {
  instagram: ['#Instagram', '#InstaContent', '#ContentCreator', '#DigitalMarketing'],
  twitter:   ['#Twitter', '#Trending', '#ViralContent', '#SocialMedia'],
  facebook:  ['#Facebook', '#FBContent', '#Community', '#SocialMedia'],
  linkedin:  ['#LinkedIn', '#ProfessionalDevelopment', '#Business', '#Networking'],
  general:   ['#SocialMedia', '#ContentMarketing', '#DigitalMarketing', '#Branding']
};

const HASHTAGS_TONO = {
  creativo:    ['#CreativeContent', '#Inspiration', '#Creative'],
  profesional: ['#Professional', '#Excellence', '#Leadership'],
  juvenil:     ['#GenZ', '#TrendAlert', '#Viral'],
  formal:      ['#Official', '#Quality', '#Trusted'],
  promocional: ['#Promo', '#Oferta', '#MustHave']
};

/**
 * Genera hashtags combinando palabras clave del tema con tags de plataforma y tono.
 * @param {string} tema
 * @param {string} plataforma
 * @param {string} tono
 * @returns {{ principales: string[], secundarios: string[] }}
 */
function generarHashtags(tema, plataforma, tono) {
  // Extraer palabras clave del tema (más de 3 letras)
  const palabras = tema
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes para el slug
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .filter(p => p.length > 3);

  const hashtagsTema = palabras.map(p => `#${p.charAt(0).toUpperCase()}${p.slice(1)}`);

  const porPlataforma = HASHTAGS_PLATAFORMA[plataforma] || HASHTAGS_PLATAFORMA.general;
  const porTono = HASHTAGS_TONO[tono] || [];

  const principales = [
    ...hashtagsTema.slice(0, 2),
    ...porPlataforma.slice(0, 2)
  ].slice(0, 4);

  const secundarios = [
    ...hashtagsTema.slice(2, 4),
    ...porTono.slice(0, 2),
    ...porPlataforma.slice(2, 4),
    '#AIContent',
    '#ContentStrategy'
  ].slice(0, 7);

  return { principales, secundarios };
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Detecta el objetivo más cercano en el banco de frases a partir del texto libre del usuario.
 * @param {string} objetivo
 * @returns {string} clave del objetivo
 */
function detectarObjetivo(objetivo) {
  const obj = objetivo.toLowerCase();
  if (/vend|compr|adquir|reserv|compra|paga|precio|ofert|descuento/.test(obj)) return 'vender';
  if (/inspir|motiv|superac|logro|éxito|exito|crecer|crece/.test(obj))           return 'inspirar';
  if (/aprend|educa|enseña|compren|explain|guía|guia|curso|tutorial/.test(obj))  return 'educar';
  if (/entret|divert|humor|rir|curiosid|sorpren/.test(obj))                      return 'entretener';
  return 'informar'; // default
}

/**
 * Elige un elemento aleatorio de un array y sustituye {tema} y {objetivo}.
 * @param {string[]} arr
 * @param {string} tema
 * @param {string} objetivo
 * @returns {string}
 */
function pick(arr, tema, objetivo) {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return item
    .replace(/\{tema\}/g, tema)
    .replace(/\{objetivo\}/g, objetivo || tema);
}

/**
 * Genera contenido de texto mediante templates inteligentes.
 * No requiere APIs externas — siempre produce un resultado válido.
 *
 * @param {string} tema
 * @param {string} objetivo
 * @param {string} tono
 * @param {string} plataforma
 * @returns {{
 *   texto: string,
 *   hashtagsPrincipales: string[],
 *   hashtagsSecundarios: string[],
 *   razonamiento: string
 * }}
 */
function generarContenidoTemplate(tema, objetivo, tono, plataforma) {
  const plataformaKey = (plataforma || 'general').toLowerCase().replace(/[^a-z]/g, '');
  const tonoKey      = (tono      || 'profesional').toLowerCase();
  const objetivoKey  = detectarObjetivo(objetivo || '');

  // Seleccionar plantilla de estructura
  const estructurasPlataforma = ESTRUCTURAS[plataformaKey] || ESTRUCTURAS.general;
  const estructurasTono = estructurasPlataforma[tonoKey] || estructurasPlataforma.profesional;
  const plantilla = estructurasTono[Math.floor(Math.random() * estructurasTono.length)];

  // Seleccionar frases del objetivo detectado
  const frases = FRASES[objetivoKey] || FRASES.informar;

  // Sustituir todos los tokens de la plantilla
  let texto = plantilla
    .replace('{intro}',      pick(frases.intro, tema, objetivo))
    .replace('{desarrollo}', pick(frases.desarrollo, tema, objetivo))
    .replace('{reflexion}',  pick(frases.reflexion  || frases.desarrollo, tema, objetivo))
    .replace('{cta}',        pick(frases.cta, tema, objetivo))
    .replace('{beneficio}',  pick(frases.beneficio  || frases.desarrollo, tema, objetivo))
    .replace('{urgencia}',   pick(frases.urgencia   || frases.cta, tema, objetivo))
    .replace('{pregunta}',   pick(frases.pregunta   || ['qué opinas'], tema, objetivo))
    .replace(/\{tema\}/g, tema)
    .replace(/\{objetivo\}/g, objetivo); // residuales

  // Twitter: truncar si excede 240 caracteres
  if (plataformaKey === 'twitter' && texto.length > 240) {
    texto = texto.substring(0, 237) + '...';
  }

  const { principales, secundarios } = generarHashtags(tema, plataformaKey, tonoKey);

  return {
    texto,
    hashtagsPrincipales: principales,
    hashtagsSecundarios: secundarios,
    razonamiento: `Contenido generado mediante templates inteligentes para ${plataforma} con tono ${tono} (sin IA disponible)`,
    promptImagen: construirPromptImagen(tema, plataformaKey, tonoKey, objetivo)
  };
}

module.exports = { generarContenidoTemplate };
