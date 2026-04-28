import type { Core } from '@strapi/strapi';

const PLATAFORMAS = [
  { slug: 'instagram', nombre: 'Instagram', limite_caracteres: 2200, estilo_imagen: 'artistic, colorful, creative composition', formato_imagen: 'social media content, square format, highly aesthetic', max_emojis: 4, descripcion: 'Red social visual, posts emotivos con emojis' },
  { slug: 'twitter',   nombre: 'Twitter/X', limite_caracteres: 240,  estilo_imagen: 'bold visual, high contrast', formato_imagen: 'bold visual, high contrast, attention-grabbing', max_emojis: 2, descripcion: 'Máximo 240 caracteres, directo e impactante' },
  { slug: 'facebook',  nombre: 'Facebook',  limite_caracteres: 63206, estilo_imagen: 'warm, community-oriented', formato_imagen: 'warm, community-oriented, shareable content', max_emojis: 3, descripcion: 'Conversacional, incluir pregunta al final' },
  { slug: 'linkedin',  nombre: 'LinkedIn',  limite_caracteres: 3000, estilo_imagen: 'clean, professional, corporate style', formato_imagen: 'professional, business context, clean background', max_emojis: 1, descripcion: 'Profesional, estructura problema→insight→CTA' },
  { slug: 'general',   nombre: 'General',   limite_caracteres: 2200, estilo_imagen: 'versatile social media style', formato_imagen: 'versatile social media style, clean composition', max_emojis: 3, descripcion: 'Adaptable a cualquier plataforma' },
];

const FRASES_SEED = [
  // informar – intro
  { categoria: 'informar', slot: 'intro', texto: 'Hoy queremos contarte sobre {objetivo}', activo: true },
  { categoria: 'informar', slot: 'intro', texto: '{objetivo}: todo lo que necesitas saber', activo: true },
  { categoria: 'informar', slot: 'intro', texto: 'Descubre {objetivo} y por qué importa', activo: true },
  // informar – desarrollo
  { categoria: 'informar', slot: 'desarrollo', texto: 'En el mundo de {tema}, esto es fundamental y merece tu atención', activo: true },
  { categoria: 'informar', slot: 'desarrollo', texto: '{tema} tiene más para ofrecer de lo que imaginas', activo: true },
  // informar – cta
  { categoria: 'informar', slot: 'cta', texto: 'Comparte si también te parece importante', activo: true },
  { categoria: 'informar', slot: 'cta', texto: '¿Qué opinas? Déjanos tu comentario', activo: true },
  // vender – intro
  { categoria: 'vender', slot: 'intro', texto: 'Presentamos {objetivo} — exactamente lo que estabas buscando', activo: true },
  { categoria: 'vender', slot: 'intro', texto: '¿Buscas {objetivo}? Lo encontraste', activo: true },
  // vender – beneficio
  { categoria: 'vender', slot: 'beneficio', texto: 'Con {tema} obtienes resultados visibles desde el primer día', activo: true },
  { categoria: 'vender', slot: 'urgencia', texto: 'Oferta por tiempo limitado — ¡no te lo pierdas!', activo: true },
  { categoria: 'vender', slot: 'cta', texto: 'Haz clic en el enlace de la bio para saber más', activo: true },
  // educar – intro
  { categoria: 'educar', slot: 'intro', texto: 'Guía práctica: {objetivo}', activo: true },
  { categoria: 'educar', slot: 'intro', texto: 'Aprende {objetivo} paso a paso', activo: true },
  { categoria: 'educar', slot: 'desarrollo', texto: 'El primer paso es entender los fundamentos de {tema}', activo: true },
  { categoria: 'educar', slot: 'cta', texto: 'Guarda esta publicación para repasar más tarde', activo: true },
  // inspirar – intro
  { categoria: 'inspirar', slot: 'intro', texto: '{objetivo}: una meta que vale la pena perseguir', activo: true },
  { categoria: 'inspirar', slot: 'desarrollo', texto: 'Los grandes logros no ocurren de la noche a la mañana, pero con {tema} todo es posible', activo: true },
  { categoria: 'inspirar', slot: 'cta', texto: 'Comparte con alguien que necesite escuchar esto hoy', activo: true },
  // entretener – intro
  { categoria: 'entretener', slot: 'intro', texto: '¿Sabías que {objetivo}?', activo: true },
  { categoria: 'entretener', slot: 'desarrollo', texto: 'Y es que {tema} tiene un lado que muy pocos conocen', activo: true },
  { categoria: 'entretener', slot: 'cta', texto: 'Etiqueta a alguien que necesita ver esto', activo: true },
];

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seed plataformas si no existen
    for (const p of PLATAFORMAS) {
      const existe = await strapi.db.query('api::platform-config.platform-config').findOne({ where: { slug: p.slug } });
      if (!existe) {
        await strapi.db.query('api::platform-config.platform-config').create({ data: p });
      }
    }

    // Seed frases de template si no existen
    const totalFrases = await strapi.db.query('api::template-frase.template-frase').count({});
    if (totalFrases === 0) {
      for (const f of FRASES_SEED) {
        await strapi.db.query('api::template-frase.template-frase').create({ data: f });
      }
    }

    // Configurar permisos públicos para GET en published-contents y platform-configs
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
      const permisos = [
        { action: 'api::published-content.published-content.find',   subject: null },
        { action: 'api::published-content.published-content.findOne', subject: null },
        { action: 'api::published-content.published-content.create',  subject: null },
        { action: 'api::platform-config.platform-config.find',        subject: null },
        { action: 'api::template-frase.template-frase.find',          subject: null },
      ];
      for (const p of permisos) {
        const existePermiso = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action: p.action, role: publicRole.id } });
        if (!existePermiso) {
          await strapi.db.query('plugin::users-permissions.permission').create({ data: { ...p, role: publicRole.id, enabled: true } });
        }
      }
    }
  },
};
