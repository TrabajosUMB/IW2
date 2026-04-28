const aiService = require('./aiService');
const { generarImagenUrl, construirPromptImagen } = require('./pollinationsService');
const { generarContenidoTemplate } = require('./templateService');
const db = require('../db');

/**
 * Servicio de generación de contenido para redes sociales.
 * - Texto y hashtags: aiService (DeepSeek R1 vía OpenRouter, gratuito)
 * - Imagen: pollinationsService (pollinations.ai, gratuito, sin API key)
 * Si DeepSeek falla (cuota, clave inválida, JSON malformado, etc.),
 * se devuelve contenido mock y la respuesta incluye modoMock: true.
 * Cada generación exitosa se guarda en historial_contenido.
 */
class ContenidoService {
  /**
   * Genera contenido completo: texto, hashtags e imagen.
   * @param {{ tema, objetivo, tono, plataforma }} datos
   * @returns {Promise<{ exito: boolean, modoMock: boolean, datos: object }>}
   */
  async generarContenidoCompleto({ tema, objetivo, tono, plataforma }) {
    try {
      if (!tema || !objetivo) {
        throw new Error('El tema y el objetivo son obligatorios');
      }

      const tonoFinal = tono || 'profesional';
      const plataformaFinal = plataforma || 'general';
      let modoMock = false;
      let modeloTexto = 'openrouter-ai';
      let textoContenido;
      let razonamiento = null;

      // 1. Intentar generar texto con DeepSeek R1; si falla, usar templates
      try {
        const respuestaDeepSeek = await aiService.generarTextoContenido(
          tema.trim(),
          objetivo.trim(),
          tonoFinal,
          plataformaFinal
        );
        textoContenido = respuestaDeepSeek;
        razonamiento = respuestaDeepSeek.razonamiento || null;
      } catch (errorDeepSeek) {
        console.warn('⚠️  DeepSeek falló, usando templates inteligentes:', errorDeepSeek.message);
        modoMock = true;
        modeloTexto = 'template';
        textoContenido = generarContenidoTemplate(tema.trim(), objetivo.trim(), tonoFinal, plataformaFinal);
        razonamiento = textoContenido.razonamiento || null;
      }

      // 2. Generar imagen con Pollinations (siempre disponible, sin API key)
      const promptParaImagen = textoContenido.promptImagen
        || construirPromptImagen(tema.trim(), plataformaFinal, tonoFinal, objetivo.trim());
      const imagenUrl = generarImagenUrl(promptParaImagen);
      const imagen = {
        url: imagenUrl,
        descripcion: `Imagen generada con Pollinations.ai para el tema: ${tema.trim()}`
      };

      const resultado = {
        exito: true,
        modoMock,
        datos: {
          texto: textoContenido.texto,
          hashtags: {
            principales: textoContenido.hashtagsPrincipales,
            secundarios: textoContenido.hashtagsSecundarios
          },
          imagen: {
            url: imagen.url,
            descripcion: imagen.descripcion
          },
          razonamiento,
          metadatos: {
            tema,
            objetivo,
            tono: tonoFinal,
            plataforma: plataformaFinal,
            modelo: modeloTexto,
            modeloImagen: 'pollinations.ai',
            fechaGeneracion: new Date().toISOString()
          }
        }
      };

      // 3. Guardar en historial (no propagar error de DB si falla)
      try {
        await db.query(
          `INSERT INTO historial_contenido
            (tema, objetivo, tono, plataforma, texto_generado,
             hashtags_principales, hashtags_secundarios, imagen_url, modo_mock)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            tema.trim(),
            objetivo.trim().substring(0, 100),
            tonoFinal,
            plataformaFinal,
            textoContenido.texto,
            textoContenido.hashtagsPrincipales,
            textoContenido.hashtagsSecundarios,
            imagen.url,
            modoMock
          ]
        );
      } catch (errorDb) {
        console.error('Error guardando en historial_contenido:', errorDb.message);
      }

      return resultado;

    } catch (errorCritico) {
      // Último recurso: cualquier error inesperado (import fallido, crash de Pollinations, etc.)
      // Nunca propagamos el error — siempre devolvemos contenido usable
      console.error('⛔ Error crítico en contenidoService, usando template de emergencia:', errorCritico.message);
      const temaSeguro = (tema || 'contenido').toString().trim();
      const objetivoSeguro = (objetivo || 'informar').toString().trim();
      const tonoSeguro = tono || 'profesional';
      const plataformaSegura = plataforma || 'instagram';

      const datosEmergencia = generarContenidoTemplate(temaSeguro, objetivoSeguro, tonoSeguro, plataformaSegura);
      const urlEmergencia = generarImagenUrl(
        construirPromptImagen(temaSeguro, plataformaSegura, tonoSeguro, objetivoSeguro)
      );

      return {
        exito: true,
        modoMock: true,
        datos: {
          texto: datosEmergencia.texto,
          hashtags: {
            principales: datosEmergencia.hashtagsPrincipales,
            secundarios: datosEmergencia.hashtagsSecundarios
          },
          imagen: {
            url: urlEmergencia,
            descripcion: `Imagen de emergencia para el tema: ${temaSeguro}`
          },
          razonamiento: 'Template de emergencia — error crítico en el servicio',
          metadatos: {
            tema: temaSeguro,
            objetivo: objetivoSeguro,
            tono: tonoSeguro,
            plataforma: plataformaSegura,
            modelo: 'template-emergencia',
            modeloImagen: 'pollinations.ai',
            fechaGeneracion: new Date().toISOString()
          }
        }
      };
    }
  }


}

module.exports = new ContenidoService();
