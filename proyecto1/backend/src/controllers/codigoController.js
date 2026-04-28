const codigoService = require('../services/codigoService');
const db = require('../db');

/**
 * Controlador para manejar las solicitudes de análisis de código
 */
class CodigoController {
  /**
   * Analiza un fragmento de código y devuelve observaciones
   */
  async analizarCodigo(req, res) {
    try {
      const { codigo, lenguaje = 'auto' } = req.body;

      // Validaciones básicas
      if (!codigo || codigo.trim().length === 0) {
        return res.status(400).json({
          exito: false,
          error: 'El código es un campo obligatorio',
          mensaje: 'Por favor, proporciona el código que deseas analizar'
        });
      }

      // Limitar tamaño del código para evitar sobrecarga
      if (codigo.length > 50000) {
        return res.status(400).json({
          exito: false,
          error: 'El código es demasiado largo',
          mensaje: 'Por favor, proporciona fragmentos de código más pequeños (máximo 50,000 caracteres)'
        });
      }

      // Analizar código
      const resultado = await codigoService.analizarCodigo(codigo, lenguaje);

      if (resultado.exito) {
        res.status(200).json(resultado);
      } else {
        res.status(500).json(resultado);
      }
    } catch (error) {
      console.error('Error en controlador de código:', error);
      res.status(500).json({
        exito: false,
        error: 'Error interno del servidor',
        mensaje: 'No se pudo analizar el código proporcionado'
      });
    }
  }

  /**
   * Obtiene los lenguajes de programación soportados
   */
  obtenerLenguajesSoportados(req, res) {
    try {
      const lenguajes = [
        { 
          id: 'auto', 
          nombre: 'Detección Automática', 
          descripcion: 'Detecta automáticamente el lenguaje del código' 
        },
        { 
          id: 'javascript', 
          nombre: 'JavaScript', 
          descripcion: 'JavaScript, TypeScript, JSX, TSX' 
        },
        { 
          id: 'python', 
          nombre: 'Python', 
          descripcion: 'Python 3.x' 
        },
        { 
          id: 'java', 
          nombre: 'Java', 
          descripcion: 'Java 8+' 
        }
      ];

      res.status(200).json({
        exito: true,
        datos: lenguajes
      });
    } catch (error) {
      console.error('Error obteniendo lenguajes soportados:', error);
      res.status(500).json({
        exito: false,
        error: 'Error obteniendo los lenguajes soportados'
      });
    }
  }

  /**
   * Devuelve los últimos 20 registros del historial de análisis de código.
   */
  async obtenerHistorial(req, res) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM historial_codigo ORDER BY creado_en DESC LIMIT 20'
      );
      res.status(200).json({ exito: true, datos: rows });
    } catch (error) {
      console.error('Error obteniendo historial de código:', error);
      res.status(500).json({ exito: false, error: 'Error obteniendo el historial de código' });
    }
  }

  /**
   * Obtiene métricas de calidad detalladas
   */
  obtenerMetricasCalidad(req, res) {
    try {
      const metricas = {
        densidadComentarios: {
          nombre: 'Densidad de Comentarios',
          descripcion: 'Proporción de comentarios respecto al código total',
          excelente: '> 15%',
          bueno: '10-15%',
          medio: '5-10%',
          bajo: '< 5%'
        },
        complejidadCiclomatica: {
          nombre: 'Complejidad Ciclomática',
          descripcion: 'Medida de complejidad basada en estructuras de control',
          excelente: '1-5',
          bueno: '6-10',
          medio: '11-15',
          alto: '> 15'
        },
        mantenibilidad: {
          nombre: 'Índice de Mantenibilidad',
          descripcion: 'Puntuación de 0-100 sobre la facilidad de mantenimiento',
          excelente: '85-100',
          bueno: '70-84',
          medio: '50-69',
          bajo: '< 50'
        },
        legibilidad: {
          nombre: 'Legibilidad',
          descripcion: 'Claridad y facilidad de lectura del código',
          factores: [
            'Longitud de líneas',
            'Consistencia de indentación',
            'Nombres descriptivos',
            'Estructura clara'
          ]
        }
      };

      res.status(200).json({
        exito: true,
        datos: metricas
      });
    } catch (error) {
      console.error('Error obteniendo métricas de calidad:', error);
      res.status(500).json({
        exito: false,
        error: 'Error obteniendo las métricas de calidad'
      });
    }
  }
}

module.exports = new CodigoController();
