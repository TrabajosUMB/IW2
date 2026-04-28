const strapiService = require('../services/strapiService');

class GaleriaController {

  async obtenerGaleria(req, res) {
    try {
      const { pagina, porPagina, plataforma, tono } = req.query;
      const resultado = await strapiService.obtenerGaleria({
        pagina:    parseInt(pagina)    || 1,
        porPagina: parseInt(porPagina) || 12,
        plataforma,
        tono,
      });
      res.json({ exito: true, ...resultado });
    } catch (error) {
      res.status(503).json({ exito: false, error: 'Strapi no disponible', detalle: error.message });
    }
  }

  async guardarPublicacion(req, res) {
    try {
      const { tema, objetivo, tono, plataforma, texto, hashtags, imagenUrl, modelo } = req.body;
      if (!tema || !texto) {
        return res.status(400).json({ exito: false, error: 'tema y texto son obligatorios' });
      }
      const item = await strapiService.guardarPublicacion({
        tema, objetivo, tono, plataforma, texto,
        hashtagsPrincipales: hashtags?.principales || [],
        hashtagsSecundarios: hashtags?.secundarios || [],
        imagenUrl, modelo,
      });
      res.status(201).json({ exito: true, datos: item });
    } catch (error) {
      res.status(503).json({ exito: false, error: 'No se pudo guardar en Strapi', detalle: error.message });
    }
  }

  async eliminarPublicacion(req, res) {
    try {
      await strapiService.eliminarPublicacion(req.params.id);
      res.json({ exito: true });
    } catch (error) {
      res.status(503).json({ exito: false, error: 'No se pudo eliminar', detalle: error.message });
    }
  }

  async estado(req, res) {
    const disponible = await strapiService.isDisponible();
    res.json({ exito: true, strapi: disponible ? 'online' : 'offline' });
  }
}

module.exports = new GaleriaController();
