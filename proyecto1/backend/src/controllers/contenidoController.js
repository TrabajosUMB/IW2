const contenidoService = require('../services/contenidoService');
const db = require('../db');

/**
 * Controlador para manejar las solicitudes de generación de contenido.
 * Delega toda la lógica de IA al contenidoService.
 * Si Gemini falla, el servicio devuelve modoMock: true con contenido de ejemplo.
 */
class ContenidoController {
  /**
   * Genera contenido completo para redes sociales.
   */
  async generarContenido(req, res) {
    const { tema, objetivo, tono, plataforma } = req.body;

    // Validaciones básicas — único caso que sí devuelve 400
    if (!tema || !objetivo) {
      return res.status(400).json({
        exito: false,
        error: 'El tema y el objetivo son campos obligatorios',
        mensaje: 'Por favor, proporciona un tema y un objetivo para generar el contenido'
      });
    }

    try {
      const resultado = await contenidoService.generarContenidoCompleto({
        tema,
        objetivo,
        tono,
        plataforma
      });
      // El servicio siempre devuelve exito: true (con o sin IA)
      return res.status(200).json(resultado);
    } catch (error) {
      // Esto solo ocurre si el propio catch de emergencia del servicio falla (muy improbable)
      console.error('Error en contenidoController (inesperado):', error);
      return res.status(200).json({
        exito: false,
        modoMock: true,
        error: 'Servicio temporalmente no disponible',
        datos: null
      });
    }
  }

  /**
   * Devuelve los últimos 20 registros del historial de contenido generado.
   */
  async obtenerHistorial(req, res) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM historial_contenido ORDER BY creado_en DESC LIMIT 20'
      );
      res.status(200).json({ exito: true, datos: rows });
    } catch (error) {
      console.error('Error obteniendo historial de contenido:', error);
      res.status(500).json({ exito: false, error: 'Error obteniendo el historial de contenido' });
    }
  }

  /**
   * Obtiene los tonos disponibles.
   */
  obtenerTonosDisponibles(req, res) {
    try {
      const tonos = [
        { id: 'formal',       nombre: 'Formal',       descripcion: 'Tono profesional y corporativo' },
        { id: 'creativo',     nombre: 'Creativo',     descripcion: 'Tono innovador y original' },
        { id: 'promocional',  nombre: 'Promocional',  descripcion: 'Tono orientado a ventas' },
        { id: 'profesional',  nombre: 'Profesional',  descripcion: 'Tono serio y experto' },
        { id: 'juvenil',      nombre: 'Juvenil',      descripcion: 'Tono moderno y casual' }
      ];
      res.status(200).json({ exito: true, datos: tonos });
    } catch (error) {
      console.error('Error obteniendo tonos:', error);
      res.status(500).json({ exito: false, error: 'Error obteniendo los tonos disponibles' });
    }
  }

  /**
   * Obtiene las plataformas disponibles.
   */
  obtenerPlataformasDisponibles(req, res) {
    try {
      const plataformas = [
        { id: 'general',   nombre: 'General',    descripcion: 'Contenido adaptable a cualquier plataforma' },
        { id: 'instagram', nombre: 'Instagram',  descripcion: 'Contenido visual y descriptivo' },
        { id: 'twitter',   nombre: 'Twitter/X',  descripcion: 'Contenido breve y conciso' },
        { id: 'facebook',  nombre: 'Facebook',   descripcion: 'Contenido conversacional' },
        { id: 'linkedin',  nombre: 'LinkedIn',   descripcion: 'Contenido profesional y corporativo' }
      ];
      res.status(200).json({ exito: true, datos: plataformas });
    } catch (error) {
      console.error('Error obteniendo plataformas:', error);
      res.status(500).json({ exito: false, error: 'Error obteniendo las plataformas disponibles' });
    }
  }
}

module.exports = new ContenidoController();
