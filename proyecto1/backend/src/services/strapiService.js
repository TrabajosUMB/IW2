const axios = require('axios');

/**
 * Servicio de integración con Strapi CMS.
 * Gestiona la galería de publicaciones generadas y configuraciones de plataforma.
 * Si Strapi no está corriendo, todas las operaciones fallan silenciosamente.
 */
class StrapiService {
  constructor() {
    this.baseUrl  = process.env.STRAPI_URL      || 'http://localhost:1337';
    this.apiToken = process.env.STRAPI_API_TOKEN || '';

    this.client = axios.create({
      baseURL: `${this.baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {}),
      },
      timeout: 8000,
    });

    if (!this.apiToken) {
      console.warn('⚠️  STRAPI_API_TOKEN no configurado. Usando acceso público a Strapi.');
    } else {
      console.log('✅ Strapi configurado en', this.baseUrl);
    }
  }

  // ── Galería (published-content) ──────────────────────────────────────────

  async obtenerGaleria({ pagina = 1, porPagina = 12, plataforma, tono } = {}) {
    const filters = {};
    if (plataforma) filters.plataforma = { $eq: plataforma };
    if (tono)       filters.tono       = { $eq: tono };

    const params = {
      'pagination[page]':     pagina,
      'pagination[pageSize]': porPagina,
      'sort':                 'createdAt:desc',
      'publicationState':     'live',
    };
    if (plataforma) params['filters[plataforma][$eq]'] = plataforma;
    if (tono)       params['filters[tono][$eq]']       = tono;

    const res = await this.client.get('/published-contents', { params });
    // Strapi v5 usa documentId para operaciones (no el id numérico)
    const items = (res.data.data || []).map(item => ({
      ...item,
      id: item.documentId || item.id,
    }));
    return {
      items,
      paginacion: res.data.meta?.pagination,
    };
  }

  async guardarPublicacion(datos) {
    const payload = {
      data: {
        tema:                  datos.tema,
        objetivo:              datos.objetivo,
        tono:                  datos.tono,
        plataforma:            datos.plataforma,
        texto:                 datos.texto,
        hashtags_principales:  datos.hashtagsPrincipales || [],
        hashtags_secundarios:  datos.hashtagsSecundarios || [],
        imagen_url:            datos.imagenUrl || '',
        modelo_usado:          datos.modelo    || 'openrouter-ai',
        publishedAt:           new Date().toISOString(),
      },
    };
    const res = await this.client.post('/published-contents', payload);
    const item = res.data.data;
    return { ...item, id: item.documentId || item.id };
  }

  async eliminarPublicacion(id) {
    await this.client.delete(`/published-contents/${id}`);
    return true;
  }

  // ── Plataformas desde CMS ─────────────────────────────────────────────────

  async obtenerPlataformas() {
    const res = await this.client.get('/platform-configs', {
      params: { 'sort': 'slug:asc' }
    });
    return res.data.data.map(p => ({
      id:          p.attributes.slug,
      nombre:      p.attributes.nombre,
      descripcion: p.attributes.descripcion,
      limiteChars: p.attributes.limite_caracteres,
    }));
  }

  // ── Health check ─────────────────────────────────────────────────────────

  async isDisponible() {
    try {
      await axios.get(`${this.baseUrl}/_health`, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new StrapiService();
